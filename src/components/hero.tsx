"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onBuy: () => void;
  onSell: () => void;
}

export function Hero({ onBuy, onSell }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.webp')" }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#BEB09E]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#BEB09E]/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#BEB09E]" />
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#BEB09E]">
                Texas Real Estate
              </span>
              <div className="w-12 h-px bg-[#BEB09E]" />
            </div>

            {/* Headline */}
            <h1 className="heading-xl text-3xl md:text-5xl lg:text-6xl mb-6 text-white">
              {t("headline")}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="body-lg text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-12"
          >
            {t("subheadline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Button
              onClick={onBuy}
              className="w-full sm:w-auto bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest px-10 py-6 rounded-none transition-all duration-300 group"
            >
              <span className="relative">
                {t("buyButton")}
                <span className="absolute left-0 bottom-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </span>
            </Button>
            <Button
              onClick={onSell}
              variant="outline"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black font-sans text-sm uppercase tracking-widest px-10 py-6 rounded-none transition-all duration-300"
            >
              {t("sellButton")}
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
