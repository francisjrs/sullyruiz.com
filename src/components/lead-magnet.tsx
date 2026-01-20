"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSessionId, setCTASource, clearSession } from "@/lib/session";

export function LeadMagnet() {
  const t = useTranslations("leadMagnet");
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const features = [
    t("features.feature1"),
    t("features.feature2"),
    t("features.feature3"),
    t("features.feature4"),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Set CTA source for lead magnet
      setCTASource("lead_magnet");
      const sessionId = getSessionId();

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead_magnet",
          session_id: sessionId,
          cta_source: "lead_magnet",
          contact: { firstName, email },
          locale,
        }),
      });

      if (response.ok) {
        clearSession();
        setIsSuccess(true);
        setFirstName("");
        setEmail("");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="section-padding bg-[#f4f1ec]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#BEB09E]/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#BEB09E]" />
                </div>
                <span className="font-sans text-xs uppercase tracking-widest text-[#BEB09E]">
                  Free Download
                </span>
              </div>

              <div className="relative mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/buyers-guide-mockup.webp"
                  alt="Texas Home Buyer's Guide"
                  className="w-48 h-auto mx-auto lg:mx-0 drop-shadow-xl"
                />
              </div>

              <h2 className="heading-lg text-2xl md:text-3xl mb-4">
                {t("title")}
              </h2>
              <p className="body-lg text-muted-foreground mb-8">
                {t("subtitle")}
              </p>

              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#BEB09E] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="body-md">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 lg:p-10 shadow-lg"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-[#BEB09E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-[#BEB09E]" />
                  </div>
                  <p className="body-lg">{t("success")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="font-sans text-sm uppercase tracking-wider"
                    >
                      {t("form.firstName")}
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-sans text-sm uppercase tracking-wider"
                    >
                      {t("form.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif text-lg"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest py-6 rounded-none transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      t("form.submit")
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground font-serif">
                    {t("form.privacy")}
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
