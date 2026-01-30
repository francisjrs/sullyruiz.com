"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { getUTMParams } from "./utm";

// GA4 Recommended Event: generate_lead
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead
export function trackLeadGeneration(params: {
  lead_source: "chat_wizard" | "lead_magnet";
  flow?: "buy" | "sell" | null;
  guide_type?: "buyer" | "seller";
}) {
  sendGAEvent("event", "generate_lead", {
    currency: "USD",
    value: 1,
    lead_source: params.lead_source,
    ...(params.flow && { flow: params.flow }),
    ...(params.guide_type && { guide_type: params.guide_type }),
  });
}

// Track CTA button clicks
export function trackCTAClick(params: {
  cta_source: string;
  flow?: "buy" | "sell" | null;
}) {
  sendGAEvent("event", "cta_click", {
    cta_source: params.cta_source,
    ...(params.flow && { flow: params.flow }),
  });
}

// Track wizard modal open
export function trackWizardOpen(params: { cta_source: string }) {
  sendGAEvent("event", "wizard_opened", {
    cta_source: params.cta_source,
  });
}

// Track wizard modal close
export function trackWizardClose(params: { step: string; flow?: string | null }) {
  sendGAEvent("event", "wizard_closed", {
    exit_step: params.step,
    ...(params.flow && { flow: params.flow }),
  });
}

// Track wizard step progression
export function trackWizardStep(params: {
  step: string;
  flow?: string | null;
  value?: string;
}) {
  sendGAEvent("event", "wizard_step", {
    step_name: params.step,
    ...(params.flow && { flow: params.flow }),
    ...(params.value && { step_value: params.value }),
  });
}

// Track guide type toggle in lead magnet
export function trackGuideToggle(params: { guide_type: "buyer" | "seller" }) {
  sendGAEvent("event", "guide_type_selected", {
    guide_type: params.guide_type,
  });
}

// Track form validation errors
export function trackFormError(params: {
  form_name: "chat_wizard" | "lead_magnet";
  error_field: "email" | "phone" | "name" | "firstName";
  error_type: "invalid" | "required";
}) {
  sendGAEvent("event", "form_error", {
    form_name: params.form_name,
    error_field: params.error_field,
    error_type: params.error_type,
  });
}

// Set GA4 user properties for segmentation
export function setUserProperties(params: {
  user_locale: string;
  user_type: "new" | "returning";
}) {
  sendGAEvent("set", "user_properties", {
    user_locale: params.user_locale,
    user_type: params.user_type,
  });

  // Also set UTM params as user properties if present
  const utmParams = getUTMParams();
  if (utmParams.utm_source) {
    sendGAEvent("set", "user_properties", {
      first_utm_source: utmParams.utm_source,
      first_utm_medium: utmParams.utm_medium,
      first_utm_campaign: utmParams.utm_campaign,
    });
  }
}

// Track scroll depth milestones
export function trackScrollDepth(percent: number) {
  sendGAEvent("event", "scroll_depth", {
    percent_scrolled: percent,
    page_path: typeof window !== "undefined" ? window.location.pathname : "/",
  });
}

// Initialize scroll depth tracking
// Returns cleanup function to remove event listener
export function initScrollTracking(): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const thresholds = [25, 50, 75, 90];
  const reached = new Set<number>();
  let ticking = false;

  const getScrollPercent = (): number => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.round((window.scrollY / docHeight) * 100);
  };

  const handleScroll = () => {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      const percent = getScrollPercent();
      thresholds.forEach((threshold) => {
        if (percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackScrollDepth(threshold);
        }
      });
      ticking = false;
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}
