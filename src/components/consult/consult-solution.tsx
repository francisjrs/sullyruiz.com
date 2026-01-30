"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

export function ConsultSolution() {
  const t = useTranslations("consult.solution");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    t("benefits.benefit1"),
    t("benefits.benefit2"),
    t("benefits.benefit3"),
    t("benefits.benefit4"),
    t("benefits.benefit5"),
  ];

  return (
    <section ref={ref} className="section-padding bg-white">
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

        <div className="max-w-xl mx-auto">
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-[#f4f1ec] p-4"
              >
                <div className="w-6 h-6 rounded-full bg-[#BEB09E] flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="body-md">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
