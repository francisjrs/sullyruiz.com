"use client";

import { sendGAEvent } from "@next/third-parties/google";

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
