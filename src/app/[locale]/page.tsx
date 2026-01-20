"use client";

import { useState } from "react";
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

type FlowType = "buy" | "sell" | null;

import { About } from "@/components/about";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialFlow, setInitialFlow] = useState<FlowType>(null);

  const openChat = (flow: FlowType, ctaSource: CTASource) => {
    setCTASource(ctaSource);
    setInitialFlow(flow);
    setIsChatOpen(true);
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
