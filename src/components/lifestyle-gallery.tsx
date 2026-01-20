"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface GalleryImage {
  src: string;
  titleKey: string;
}

const austinImages: GalleryImage[] = [
  { src: "/images/Austin_lifestyle.webp", titleKey: "austin.lifestyle" },
  { src: "/images/South_Congress.webp", titleKey: "austin.southCongress" },
];

const propertyImages: GalleryImage[] = [
  { src: "/images/Luxury_living_Room.webp", titleKey: "property.livingRoom" },
  { src: "/images/Gourmet_Kitchen.webp", titleKey: "property.kitchen" },
  { src: "/images/Master_Suite.webp", titleKey: "property.bedroom" },
  { src: "/images/outdoor-living.webp", titleKey: "property.outdoor" },
];

function GalleryCard({ image, t, delay }: { image: GalleryImage; t: (key: string) => string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay }}
      className="group relative overflow-hidden aspect-[4/3]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={t(image.titleKey)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {/* Gold accent border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#BEB09E] transition-colors duration-500" />
      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-sans text-white text-sm uppercase tracking-widest opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          {t(image.titleKey)}
        </h3>
      </div>
    </motion.div>
  );
}

export function LifestyleGallery() {
  const t = useTranslations("gallery");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-[#f4f1ec]">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
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

        {/* Austin Lifestyle Row - 2 columns */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {austinImages.map((image, index) => (
            <GalleryCard
              key={image.titleKey}
              image={image}
              t={t}
              delay={0.1 * index}
            />
          ))}
        </div>

        {/* Property Gallery Row - 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {propertyImages.map((image, index) => (
            <GalleryCard
              key={image.titleKey}
              image={image}
              t={t}
              delay={0.1 * (index + 2)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
