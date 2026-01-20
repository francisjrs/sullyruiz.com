"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Target, Handshake, Key } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: MessageSquare,
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
    },
    {
      icon: Target,
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
    },
    {
      icon: Handshake,
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
    },
    {
      icon: Key,
      title: t("steps.step4.title"),
      description: t("steps.step4.description"),
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="section-padding bg-[#f4f1ec]">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-2xl md:text-3xl lg:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connection line (visible on large screens) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-[#BEB09E]/30" />
              )}

              <div className="bg-white p-8 h-full border border-[#BEB09E]/20 hover:border-[#BEB09E] transition-colors duration-300">
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sans text-5xl font-light text-[#BEB09E]/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <step.icon className="w-8 h-8 text-[#BEB09E]" strokeWidth={1.5} />
                </div>

                <h3 className="heading-sm text-lg mb-4">{step.title}</h3>
                <p className="body-md text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
