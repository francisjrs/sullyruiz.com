"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardCheck, Gift, Users, MapPin } from "lucide-react";

export function ConsultDeliverables() {
  const t = useTranslations("consult.deliverables");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const items = [
    {
      icon: ClipboardCheck,
      title: t("items.item1.title"),
      description: t("items.item1.description"),
    },
    {
      icon: Gift,
      title: t("items.item2.title"),
      description: t("items.item2.description"),
    },
    {
      icon: Users,
      title: t("items.item3.title"),
      description: t("items.item3.description"),
    },
    {
      icon: MapPin,
      title: t("items.item4.title"),
      description: t("items.item4.description"),
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-[#f4f1ec]">
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
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-white p-8 h-full border border-[#BEB09E]/20 hover:border-[#BEB09E] transition-colors duration-300">
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sans text-5xl font-light text-[#BEB09E]/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <item.icon className="w-8 h-8 text-[#BEB09E]" strokeWidth={1.5} />
                </div>

                <h3 className="heading-sm text-lg mb-4">{item.title}</h3>
                <p className="body-md text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
