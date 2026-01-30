"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";

interface VideoHeroProps {
  onCTAClick: () => void;
  videoSrc?: string;
}

export function VideoHero({ onCTAClick, videoSrc }: VideoHeroProps) {
  const t = useTranslations("consult.hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
      {/* Decorative blur circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#BEB09E]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#BEB09E]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#BEB09E]/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-12 h-px bg-[#BEB09E]" />
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#BEB09E]">
              {t("tagline")}
            </span>
            <div className="w-12 h-px bg-[#BEB09E]" />
          </motion.div>

          {/* Headline with highlighted text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="heading-xl text-3xl md:text-5xl lg:text-6xl mb-6 text-white"
          >
            {t("headline").replace(t("headlineHighlight"), "").trim()}{" "}
            <span className="text-[#BEB09E]">{t("headlineHighlight")}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="body-lg text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-12"
          >
            {t("subheadline")}
          </motion.p>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="w-full max-w-3xl mx-auto mb-12"
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-[#BEB09E]/30 shadow-2xl shadow-[#BEB09E]/10">
              <VideoPlayer
                videoSrc={videoSrc}
                posterSrc="/videos/hero-poster.png"
                fallbackSrc="/images/hero.webp"
                muteLabel={t("video.muteLabel")}
                unmuteLabel={t("video.unmuteLabel")}
                playLabel={t("video.playLabel")}
                onPlayClick={onCTAClick}
              />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Button
              onClick={onCTAClick}
              className="bg-[#BEB09E] text-black hover:bg-white font-sans text-sm uppercase tracking-widest px-10 py-6 rounded-none transition-all duration-300"
            >
              {t("cta")}
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
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
