import { NextResponse } from "next/server";
import { validateLeadPayload, normalizePhone } from "@/lib/validation";

type CTASource =
  | "navbar"
  | "hero_buy"
  | "hero_sell"
  | "about"
  | "services_buy"
  | "services_sell"
  | "lead_magnet";

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
}

type LeadPayload = LeadMagnetPayload | ChatWizardPayload;

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

    // Normalize phone number if present (for chat_wizard)
    if (body.type === "chat_wizard" && body.contact.phone) {
      body.contact.phone = normalizePhone(body.contact.phone);
    }

    // Log the lead (for development)
    console.log("New lead received:", JSON.stringify(body, null, 2));

    // Forward to n8n webhook if configured
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const apiKey = process.env.N8N_API_KEY;

    if (webhookUrl) {
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
        });

        if (!webhookResponse.ok) {
          console.error(
            "Webhook response not OK:",
            webhookResponse.status,
            await webhookResponse.text()
          );
        }
      } catch (webhookError) {
        // Log webhook error but don't fail the request
        console.error("Error forwarding to webhook:", webhookError);
      }
    } else {
      console.log("N8N_WEBHOOK_URL not configured - lead stored locally only");
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
