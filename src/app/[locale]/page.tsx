"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TrustSection } from "@/components/trust-section";
import { HowItWorks } from "@/components/how-it-works";
import { Services } from "@/components/services";
import { LeadMagnet } from "@/components/lead-magnet";
import { LifestyleGallery } from "@/components/lifestyle-gallery";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { ChatWizard } from "@/components/chat-wizard";
import { setCTASource, type CTASource } from "@/lib/session";
import { trackCTAClick, trackWizardOpen, initScrollTracking, setUserProperties } from "@/lib/analytics";
import { captureUTMParams } from "@/lib/utm";

type FlowType = "buy" | "sell" | null;

import { About } from "@/components/about";

const RETURNING_USER_KEY = "sullyruiz_returning";

export default function Home() {
  const locale = useLocale();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialFlow, setInitialFlow] = useState<FlowType>(null);

  // Initialize analytics tracking on mount
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

  const openChat = (flow: FlowType, ctaSource: CTASource) => {
    setCTASource(ctaSource);
    setInitialFlow(flow);
    setIsChatOpen(true);
    trackCTAClick({ cta_source: ctaSource, flow });
    trackWizardOpen({ cta_source: ctaSource });
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setInitialFlow(null);
  };

  return (
    <main className="min-h-screen">
      <Navbar onGetStarted={() => openChat(null, "navbar")} />
      <Hero
        onBuy={() => openChat("buy", "hero_buy")}
        onSell={() => openChat("sell", "hero_sell")}
      />
      <TrustSection />
      <About onContact={() => openChat(null, "about")} />
      <HowItWorks />
      <Services
        onBuy={() => openChat("buy", "services_buy")}
        onSell={() => openChat("sell", "services_sell")}
      />
      <LifestyleGallery />
      <LeadMagnet />
      <Testimonials />
      <FAQ />
      <Footer />

      <ChatWizard
        isOpen={isChatOpen}
        onClose={closeChat}
        initialFlow={initialFlow}
      />
    </main>
  );
}
