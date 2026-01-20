"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function TrustSection() {
  const t = useTranslations("trust");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: t("stats.homesSold"), label: t("stats.homesSoldLabel") },
    { value: t("stats.salesVolume"), label: t("stats.salesVolumeLabel") },
    { value: t("stats.clientSatisfaction"), label: t("stats.clientSatisfactionLabel") },
    { value: t("stats.googleRating"), label: t("stats.googleRatingLabel") },
  ];

  return (
    <section ref={ref} className="relative section-padding overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/austin-aerial.webp')" }}
      />
      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-2xl md:text-3xl lg:text-4xl">{t("title")}</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative inline-block">
                <span className="font-sans text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
                  {stat.value}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#BEB09E]" />
              </div>
              <p className="body-md mt-4 text-muted-foreground uppercase tracking-wider text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Decorative border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 h-px bg-[#BEB09E]/30 origin-center"
        />
      </div>
    </section>
  );
}
