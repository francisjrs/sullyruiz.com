"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote: t("items.testimonial1.quote"),
      author: t("items.testimonial1.author"),
      location: t("items.testimonial1.location"),
    },
    {
      quote: t("items.testimonial2.quote"),
      author: t("items.testimonial2.author"),
      location: t("items.testimonial2.location"),
    },
    {
      quote: t("items.testimonial3.quote"),
      author: t("items.testimonial3.author"),
      location: t("items.testimonial3.location"),
    },
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

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative"
            >
              <div
                className="bg-[#f4f1ec] p-8 h-full relative group hover:bg-white hover:shadow-lg transition-all duration-500 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/testimonial-bg.png')" }}
              >
                <div className="absolute inset-0 bg-[#f4f1ec]/90 group-hover:bg-white/95 transition-all duration-500" />
                <div className="relative z-10">
                  {/* Quote icon */}
                  <Quote
                    className="w-10 h-10 text-[#BEB09E]/30 mb-6"
                    strokeWidth={1}
                  />

                  {/* Quote text */}
                  <blockquote className="body-lg text-lg mb-8 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    {/* Placeholder avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#BEB09E]/20 flex items-center justify-center">
                      <span className="font-sans text-sm text-[#BEB09E]">
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-sm uppercase tracking-wider font-medium">
                        {testimonial.author}
                      </p>
                      <p className="body-sm text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Decorative border on hover */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#BEB09E] transition-all duration-500 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
