"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const t = useTranslations("faq");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: t("items.q1.question"),
      answer: t("items.q1.answer"),
    },
    {
      question: t("items.q2.question"),
      answer: t("items.q2.answer"),
    },
    {
      question: t("items.q3.question"),
      answer: t("items.q3.answer"),
    },
    {
      question: t("items.q4.question"),
      answer: t("items.q4.answer"),
    },
    {
      question: t("items.q5.question"),
      answer: t("items.q5.answer"),
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-[#BEB09E]/20 px-6 data-[state=open]:border-[#BEB09E]"
              >
                <AccordionTrigger className="font-sans text-left text-sm md:text-base uppercase tracking-wider py-6 hover:no-underline hover:text-[#BEB09E] transition-colors [&[data-state=open]]:text-[#BEB09E]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="body-md text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
