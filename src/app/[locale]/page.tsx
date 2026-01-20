"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TrustSection } from "@/components/trust-section";
import { HowItWorks } from "@/components/how-it-works";
import { Services } from "@/components/services";
import { LeadMagnet } from "@/components/lead-magnet";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { ChatWizard } from "@/components/chat-wizard";

type FlowType = "buy" | "sell" | null;

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialFlow, setInitialFlow] = useState<FlowType>(null);

  const openChat = (flow?: FlowType) => {
    setInitialFlow(flow ?? null);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setInitialFlow(null);
  };

  return (
    <main className="min-h-screen">
      <Navbar onGetStarted={() => openChat()} />
      <Hero onBuy={() => openChat("buy")} onSell={() => openChat("sell")} />
      <TrustSection />
      <HowItWorks />
      <Services onBuy={() => openChat("buy")} onSell={() => openChat("sell")} />
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
