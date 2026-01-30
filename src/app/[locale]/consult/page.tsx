"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import {
  VideoHero,
  ConsultStories,
  ConsultProblem,
  ConsultSolution,
  ConsultDeliverables,
  ConsultForm,
  ConsultFooter,
} from "@/components/consult";
import { captureUTMParams } from "@/lib/utm";
import { setUserProperties, initScrollTracking } from "@/lib/analytics";

const RETURNING_USER_KEY = "sullyruiz_returning";

export default function ConsultPage() {
  const locale = useLocale();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capture UTM parameters from URL
    captureUTMParams();

    // Determine user type (new vs returning)
    const isReturning = localStorage.getItem(RETURNING_USER_KEY) === "true";
    const userType = isReturning ? "returning" : "new";

    // Mark as returning for future visits
    if (!isReturning) {
      localStorage.setItem(RETURNING_USER_KEY, "true");
    }

    // Set user properties for GA4 segmentation
    setUserProperties({
      user_locale: locale,
      user_type: userType,
    });

    // Initialize scroll depth tracking
    const cleanupScroll = initScrollTracking();

    return () => {
      cleanupScroll();
    };
  }, [locale]);

  const scrollToForm = () => {
    const formElement = document.getElementById("form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen">
      <VideoHero onCTAClick={scrollToForm} />
      <ConsultStories />
      <ConsultProblem />
      <ConsultSolution />
      <ConsultDeliverables />
      <div ref={formRef}>
        <ConsultForm />
      </div>
      <ConsultFooter />
    </main>
  );
}
