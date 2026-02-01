"use client";

// Meta Pixel client-side tracking functions
// Requires NEXT_PUBLIC_META_PIXEL_ID environment variable

declare global {
  interface Window {
    fbq: (
      action: string,
      eventOrId: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
    _fbq?: unknown;
  }
}

// Generate a unique event ID for deduplication with Conversions API
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Store event ID in session storage for retrieval when sending to CAPI
export function storeEventId(eventName: string, eventId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`meta_event_${eventName}`, eventId);
  } catch {
    // Session storage might be unavailable
  }
}

// Get stored event ID
export function getStoredEventId(eventName: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(`meta_event_${eventName}`);
  } catch {
    return null;
  }
}

// Clear stored event ID after use
export function clearStoredEventId(eventName: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(`meta_event_${eventName}`);
  } catch {
    // Session storage might be unavailable
  }
}

// Check if fbq is available
function isFbqAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

// Track Meta Lead event (for ChatWizard and LeadMagnet submissions)
export function trackMetaLead(params: {
  eventId: string;
  value?: number;
  currency?: string;
  contentName?: string;
}): void {
  if (!isFbqAvailable()) return;

  window.fbq("track", "Lead", {
    value: params.value ?? 1,
    currency: params.currency ?? "USD",
    content_name: params.contentName,
  }, { eventID: params.eventId });
}

// Track Meta ViewContent event (for ChatWizard open)
export function trackMetaViewContent(params: {
  eventId: string;
  contentName: string;
  contentCategory?: string;
}): void {
  if (!isFbqAvailable()) return;

  window.fbq("track", "ViewContent", {
    content_name: params.contentName,
    content_category: params.contentCategory ?? "lead_wizard",
  }, { eventID: params.eventId });
}

// Track Meta Contact event (for ConsultForm - higher intent)
export function trackMetaContact(params: {
  eventId: string;
  value?: number;
  currency?: string;
}): void {
  if (!isFbqAvailable()) return;

  window.fbq("track", "Contact", {
    value: params.value ?? 5,
    currency: params.currency ?? "USD",
  }, { eventID: params.eventId });
}

// Track Meta PageView (called on initial load)
export function trackMetaPageView(): void {
  if (!isFbqAvailable()) return;
  window.fbq("track", "PageView");
}
