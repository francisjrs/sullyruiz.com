"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesProps {
  onBuy: () => void;
  onSell: () => void;
}

export function Services({ onBuy, onSell }: ServicesProps) {
  const t = useTranslations("services");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const buyBenefits = [
    t("buy.benefits.benefit1"),
    t("buy.benefits.benefit2"),
    t("buy.benefits.benefit3"),
    t("buy.benefits.benefit4"),
  ];

  const sellBenefits = [
    t("sell.benefits.benefit1"),
    t("sell.benefits.benefit2"),
    t("sell.benefits.benefit3"),
    t("sell.benefits.benefit4"),
  ];

  return (
    <section id="services" ref={ref} className="section-padding bg-white">
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

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Buy Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative bg-[#f4f1ec] p-8 lg:p-12 border border-transparent hover:border-[#BEB09E] transition-all duration-500"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-px bg-[#BEB09E]" />
              <div className="absolute top-0 left-0 w-px h-full bg-[#BEB09E]" />
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16">
              <div className="absolute bottom-0 right-0 w-full h-px bg-[#BEB09E]" />
              <div className="absolute bottom-0 right-0 w-px h-full bg-[#BEB09E]" />
            </div>

            <div className="relative h-48 mb-6 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/services-buy.webp"
                alt="Couple receiving house keys"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative">
              <h3 className="heading-md text-xl lg:text-2xl mb-4">{t("buy.title")}</h3>
              <p className="body-lg text-muted-foreground mb-8">
                {t("buy.description")}
              </p>

              <ul className="space-y-4 mb-8">
                {buyBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#BEB09E]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#BEB09E]" />
                    </div>
                    <span className="body-md">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onBuy}
                className="w-full bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest py-6 rounded-none transition-all duration-300"
              >
                {t("buy.cta")}
              </Button>
            </div>
          </motion.div>

          {/* Sell Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative bg-black text-white p-8 lg:p-12 border border-transparent hover:border-[#BEB09E] transition-all duration-500"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-px bg-[#BEB09E]" />
              <div className="absolute top-0 left-0 w-px h-full bg-[#BEB09E]" />
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16">
              <div className="absolute bottom-0 right-0 w-full h-px bg-[#BEB09E]" />
              <div className="absolute bottom-0 right-0 w-px h-full bg-[#BEB09E]" />
            </div>

            <div className="relative h-48 mb-6 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/services-sell.webp"
                alt="Luxury home sold"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative">
              <h3 className="heading-md text-xl lg:text-2xl mb-4">{t("sell.title")}</h3>
              <p className="body-lg text-white/70 mb-8">{t("sell.description")}</p>

              <ul className="space-y-4 mb-8">
                {sellBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#BEB09E]/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#BEB09E]" />
                    </div>
                    <span className="body-md text-white/90">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onSell}
                className="w-full bg-[#BEB09E] text-black hover:bg-white font-sans text-sm uppercase tracking-widest py-6 rounded-none transition-all duration-300"
              >
                {t("sell.cta")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
