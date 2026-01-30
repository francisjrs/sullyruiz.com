"use client";

// Standard UTM parameters
export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const UTM_KEYS: (keyof UTMParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

const STORAGE_KEY = "utm_params";

/**
 * Capture UTM parameters from URL and store in sessionStorage
 * Call this once on initial page load
 */
export function captureUTMParams(): UTMParams {
  if (typeof window === "undefined") {
    return getEmptyUTMParams();
  }

  // Check if we already have UTM params stored (don't overwrite during session)
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as UTMParams;
    } catch {
      // Invalid stored data, continue to capture from URL
    }
  }

  // Parse UTM params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_term: urlParams.get("utm_term"),
    utm_content: urlParams.get("utm_content"),
  };

  // Only store if at least one UTM param is present
  const hasUTMParams = UTM_KEYS.some((key) => utmParams[key] !== null);
  if (hasUTMParams) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmParams));
  }

  return utmParams;
}

/**
 * Get stored UTM parameters
 */
export function getUTMParams(): UTMParams {
  if (typeof window === "undefined") {
    return getEmptyUTMParams();
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as UTMParams;
    } catch {
      return getEmptyUTMParams();
    }
  }

  return getEmptyUTMParams();
}

/**
 * Check if any UTM parameters are present
 */
export function hasUTMParams(): boolean {
  const params = getUTMParams();
  return UTM_KEYS.some((key) => params[key] !== null);
}

/**
 * Clear stored UTM parameters (e.g., after lead submission)
 */
export function clearUTMParams(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function getEmptyUTMParams(): UTMParams {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  };
}
