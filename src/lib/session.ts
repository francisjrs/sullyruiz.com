import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "lead_session_id";
const CTA_SOURCE_KEY = "lead_cta_source";

export type CTASource =
  | "navbar"
  | "hero_buy"
  | "hero_sell"
  | "about"
  | "services_buy"
  | "services_sell"
  | "lead_magnet"
  | "consult_form";

/**
 * Get or create a session ID for lead tracking.
 * Session ID persists in sessionStorage during the browser session.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return uuidv4();
  }

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Set the CTA source that triggered the lead capture.
 */
export function setCTASource(source: CTASource): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CTA_SOURCE_KEY, source);
}

/**
 * Get the current CTA source.
 */
export function getCTASource(): CTASource | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CTA_SOURCE_KEY) as CTASource | null;
}

/**
 * Clear the session after successful lead submission.
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(CTA_SOURCE_KEY);
}

/**
 * Get session data for API submission.
 */
export function getSessionData(): { session_id: string; cta_source: CTASource | null } {
  return {
    session_id: getSessionId(),
    cta_source: getCTASource(),
  };
}
