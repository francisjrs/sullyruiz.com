// Meta Conversions API (CAPI) server-side tracking
// Requires META_PIXEL_ID and META_CAPI_ACCESS_TOKEN environment variables

import { createHash } from "crypto";

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fbc?: string; // Facebook click ID (from _fbc cookie)
  fbp?: string; // Facebook browser ID (from _fbp cookie)
  clientIpAddress?: string;
  clientUserAgent?: string;
}

interface EventData {
  eventName: "Lead" | "Contact" | "ViewContent";
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData: UserData;
  customData?: Record<string, unknown>;
}

// SHA256 hash for PII fields (required by Meta)
function sha256Hash(value: string): string {
  return createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex");
}

// Normalize and hash email per Meta requirements
function normalizeEmail(email: string): string {
  return sha256Hash(email.toLowerCase().trim());
}

// Normalize and hash phone per Meta requirements
// Removes all non-digits, ensures country code
function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, "");

  // Add US country code if not present
  if (digits.length === 10) {
    digits = "1" + digits;
  }

  return sha256Hash(digits);
}

// Normalize and hash name
function normalizeName(name: string): string {
  return sha256Hash(name.toLowerCase().trim());
}

// Extract user data from request and hash PII
export function extractUserData(params: {
  email?: string;
  phone?: string;
  name?: string;
  firstName?: string;
  fbc?: string;
  fbp?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}): Record<string, string | undefined> {
  const userData: Record<string, string | undefined> = {};

  if (params.email) {
    userData.em = normalizeEmail(params.email);
  }

  if (params.phone) {
    userData.ph = normalizePhone(params.phone);
  }

  if (params.firstName) {
    userData.fn = normalizeName(params.firstName);
  } else if (params.name) {
    // Extract first name from full name
    const firstName = params.name.split(" ")[0];
    if (firstName) {
      userData.fn = normalizeName(firstName);
    }
    // Extract last name if present
    const nameParts = params.name.split(" ");
    if (nameParts.length > 1) {
      const lastName = nameParts[nameParts.length - 1];
      userData.ln = normalizeName(lastName);
    }
  }

  // Pass through non-PII fields as-is
  if (params.fbc) userData.fbc = params.fbc;
  if (params.fbp) userData.fbp = params.fbp;
  if (params.clientIpAddress) userData.client_ip_address = params.clientIpAddress;
  if (params.clientUserAgent) userData.client_user_agent = params.clientUserAgent;

  return userData;
}

// Send conversion event to Meta Conversions API
export async function sendConversionEvent(eventData: EventData): Promise<{
  success: boolean;
  error?: string;
}> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.log("Meta CAPI not configured - skipping server-side tracking");
    return { success: false, error: "Meta CAPI not configured" };
  }

  const userData = extractUserData(eventData.userData);

  const payload = {
    data: [
      {
        event_name: eventData.eventName,
        event_time: eventData.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: eventData.eventId,
        event_source_url: eventData.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: eventData.customData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Meta CAPI error:", errorData);
      return {
        success: false,
        error: errorData.error?.message || "Unknown error",
      };
    }

    const result = await response.json();
    console.log("Meta CAPI event sent:", eventData.eventName, result);
    return { success: true };
  } catch (error) {
    console.error("Error sending Meta CAPI event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Helper to extract fbc and fbp from cookie string
export function extractMetaCookies(cookieString: string): {
  fbc?: string;
  fbp?: string;
} {
  const cookies: Record<string, string> = {};

  cookieString.split(";").forEach((cookie) => {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name) {
      cookies[name] = valueParts.join("=");
    }
  });

  return {
    fbc: cookies["_fbc"],
    fbp: cookies["_fbp"],
  };
}
