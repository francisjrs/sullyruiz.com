import { NextResponse } from "next/server";
import { validateLeadPayload, normalizePhone } from "@/lib/validation";
import { sendConversionEvent, extractMetaCookies } from "@/lib/meta-capi";

type CTASource =
  | "navbar"
  | "hero_buy"
  | "hero_sell"
  | "about"
  | "services_buy"
  | "services_sell"
  | "lead_magnet"
  | "consult_form";

interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

interface LeadMagnetPayload {
  type: "lead_magnet";
  guideType: "buyer" | "seller";
  session_id: string;
  cta_source: CTASource;
  contact: {
    firstName: string;
    email: string;
  };
  locale: string;
  utm?: UTMParams;
  event_id?: string;
}

interface ChatWizardPayload {
  type: "chat_wizard";
  flow: "buy" | "sell";
  session_id: string;
  cta_source: CTASource;
  answers: {
    propertyType?: string;
    area?: string;
    budget?: string;
    timeline?: string;
    reason?: string;
    address?: string;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  locale: string;
  utm?: UTMParams;
  event_id?: string;
}

interface ConsultLeadPayload {
  type: "consult";
  session_id: string;
  cta_source: CTASource;
  contact: {
    name: string;
    phone: string;
    email: string;
    languagePreference: "en" | "es";
  };
  qualification: {
    timeline: string;
    incomeType: string;
    bankStatus: string;
    downPayment: string;
    area: string;
  };
  tracking: {
    source: string;
    notes?: string;
  };
  locale: string;
  utm?: UTMParams;
  event_id?: string;
}

type LeadPayload = LeadMagnetPayload | ChatWizardPayload | ConsultLeadPayload;

// Response types from n8n workflow
interface N8nSuccessResponse {
  success: true;
  leadId: string;
  notifications: {
    emailSent: boolean;
    whatsappSent: boolean;
    agentNotified: boolean;
  };
  message: {
    en: string;
    es: string;
  };
  nextSteps: {
    en: string[];
    es: string[];
  };
}

interface N8nErrorResponse {
  success: false;
  error: string;
  message: string;
  code: string;
}

type N8nResponse = N8nSuccessResponse | N8nErrorResponse;

// Helper to send Meta CAPI event (non-blocking)
async function sendMetaConversion(
  body: LeadPayload,
  request: Request
): Promise<void> {
  // Skip if no event_id (client-side tracking not done)
  if (!body.event_id) return;

  // Extract user data based on lead type
  const userData: {
    email?: string;
    phone?: string;
    name?: string;
    firstName?: string;
    fbc?: string;
    fbp?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
  } = {
    clientUserAgent: request.headers.get("user-agent") || undefined,
    clientIpAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined,
  };

  // Extract Meta cookies from request
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const metaCookies = extractMetaCookies(cookieHeader);
    userData.fbc = metaCookies.fbc;
    userData.fbp = metaCookies.fbp;
  }

  // Extract contact info based on lead type
  if (body.type === "lead_magnet") {
    userData.email = body.contact.email;
    userData.firstName = body.contact.firstName;
  } else if (body.type === "chat_wizard" || body.type === "consult") {
    userData.email = body.contact.email;
    userData.phone = body.contact.phone;
    userData.name = body.contact.name;
  }

  // Determine event type
  const eventName = body.type === "consult" ? "Contact" : "Lead";
  const eventValue = body.type === "consult" ? 5 : 1;

  // Build event source URL
  const referer = request.headers.get("referer");
  const eventSourceUrl = referer || "https://sullyruiz.com";

  try {
    await sendConversionEvent({
      eventName,
      eventId: body.event_id,
      eventSourceUrl,
      userData,
      customData: {
        value: eventValue,
        currency: "USD",
        content_name: body.type,
      },
    });
  } catch (error) {
    // Log but don't fail the request
    console.error("Meta CAPI error:", error);
  }
}

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    // Validate required fields
    if (!body.type || !body.locale) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate contact information with format validation
    const validationResult = validateLeadPayload(body.contact, body.type);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.errors },
        { status: 400 }
      );
    }

    // Normalize phone number if present (for chat_wizard and consult)
    if ((body.type === "chat_wizard" || body.type === "consult") && body.contact.phone) {
      body.contact.phone = normalizePhone(body.contact.phone);
    }

    // Log the lead (for development)
    console.log("New lead received:", JSON.stringify(body, null, 2));

    // Forward to n8n webhook if configured
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const apiKey = process.env.N8N_API_KEY;

    if (webhookUrl) {
      // Create abort controller for 30s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // Add API key header if configured
        if (apiKey) {
          headers["X-API-Key"] = apiKey;
        }

        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...body,
            timestamp: new Date().toISOString(),
            source: "sullyruiz.com",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // For consult type, parse and forward the n8n response
        if (body.type === "consult") {
          if (webhookResponse.ok) {
            // Send Meta CAPI event on success (non-blocking)
            sendMetaConversion(body, request);

            try {
              const n8nData: N8nResponse = await webhookResponse.json();
              return NextResponse.json(n8nData, { status: 200 });
            } catch {
              // If response isn't valid JSON, return generic success
              return NextResponse.json({
                success: true,
                message: "Lead received successfully",
              });
            }
          } else {
            // n8n returned an error status
            try {
              const n8nError: N8nErrorResponse = await webhookResponse.json();
              return NextResponse.json(n8nError, { status: webhookResponse.status });
            } catch {
              return NextResponse.json(
                {
                  success: false,
                  error: "storage_failed",
                  message: "Unable to save your information. Please try again.",
                  code: "STORAGE_ERROR",
                },
                { status: 500 }
              );
            }
          }
        }

        // For other lead types, just log errors but don't fail
        if (!webhookResponse.ok) {
          console.error(
            "Webhook response not OK:",
            webhookResponse.status,
            await webhookResponse.text()
          );
        } else {
          // Send Meta CAPI event on success for non-consult types
          sendMetaConversion(body, request);
        }
      } catch (webhookError) {
        clearTimeout(timeoutId);

        // Check if it was a timeout
        if (webhookError instanceof Error && webhookError.name === "AbortError") {
          console.error("Webhook timeout after 30 seconds");
          if (body.type === "consult") {
            return NextResponse.json(
              {
                success: false,
                error: "timeout",
                message: "Request timed out. Please try again.",
                code: "TIMEOUT_ERROR",
              },
              { status: 504 }
            );
          }
        } else {
          // Log webhook error but don't fail the request for non-consult types
          console.error("Error forwarding to webhook:", webhookError);
          if (body.type === "consult") {
            return NextResponse.json(
              {
                success: false,
                error: "network_error",
                message: "Unable to process your request. Please try again.",
                code: "NETWORK_ERROR",
              },
              { status: 500 }
            );
          }
        }
      }
    } else {
      console.log("N8N_WEBHOOK_URL not configured - lead stored locally only");
      // Still send Meta CAPI even without n8n
      sendMetaConversion(body, request);
    }

    return NextResponse.json({
      success: true,
      message: "Lead received successfully",
    });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
