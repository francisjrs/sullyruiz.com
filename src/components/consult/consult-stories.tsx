"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Heart, Share2, ThumbsUp } from "lucide-react";

export function ConsultStories() {
  const t = useTranslations("consult.stories");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stories = [
    {
      quote: t("items.story1.quote"),
      name: t("items.story1.name"),
      situation: t("items.story1.situation"),
      reviews: 3,
      photos: 1,
      timeAgo: "2 weeks ago",
      isNew: true,
      rotation: -3,
      likes: 4,
      initial: "M",
      color: "bg-pink-500",
    },
    {
      quote: t("items.story2.quote"),
      name: t("items.story2.name"),
      situation: t("items.story2.situation"),
      reviews: 7,
      photos: 2,
      timeAgo: "1 month ago",
      isNew: false,
      rotation: 2,
      likes: 8,
      initial: "C",
      color: "bg-blue-500",
    },
    {
      quote: t("items.story3.quote"),
      name: t("items.story3.name"),
      situation: t("items.story3.situation"),
      reviews: 1,
      photos: 0,
      timeAgo: "3 weeks ago",
      isNew: true,
      rotation: -2,
      likes: 2,
      initial: "J",
      color: "bg-purple-500",
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-[#f8f8f8] overflow-hidden">
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

        {/* Google Reviews-style cards */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-4 lg:gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, rotate: story.rotation }
                  : {}
              }
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative w-full max-w-[340px] md:max-w-[320px]"
              style={{ zIndex: stories.length - index }}
            >
              {/* Card shadow effect */}
              <div className="absolute inset-0 bg-black/10 rounded-2xl translate-y-2 translate-x-1 blur-sm" />

              {/* Main card */}
              <div className="relative bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                {/* Header: Avatar + Name + Reviews count */}
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar with initial */}
                  <div
                    className={`w-10 h-10 rounded-full ${story.color} flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}
                  >
                    {story.initial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {story.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {story.reviews} {story.reviews === 1 ? "review" : "reviews"}
                      {story.photos > 0 && ` · ${story.photos} ${story.photos === 1 ? "photo" : "photos"}`}
                    </p>
                  </div>
                </div>

                {/* Star rating + time + NEW badge */}
                <div className="flex items-center gap-2 mb-3">
                  {/* 5 stars */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{story.timeAgo}</span>
                  {story.isNew && (
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>

                {/* Review text with highlighted portions */}
                <p className="text-sm text-gray-800 leading-relaxed mb-4">
                  <HighlightedReview text={story.quote} />
                </p>

                {/* Situation/context tag */}
                <p className="text-xs text-gray-500 italic mb-4">
                  {story.situation}
                </p>

                {/* Footer: Like + Share actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{story.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Google "G" watermark */}
                <div className="absolute top-4 right-4 w-6 h-6 opacity-30">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer text like in the image */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center text-sm text-gray-500 mt-12 max-w-3xl mx-auto leading-relaxed"
        >
          {t("disclaimer", {
            defaultValue:
              "Individual experiences presented here may not be typical. Results vary based on individual circumstances.",
          })}
        </motion.p>
      </div>
    </section>
  );
}

// Component to highlight key phrases in the review
function HighlightedReview({ text }: { text: string }) {
  // Keywords to highlight
  const highlightPhrases = [
    "ITIN",
    "homeowner",
    "dueña de mi casa",
    "Round Rock",
    "bank statements",
    "estados de cuenta",
    "down payment assistance",
    "asistencia para enganche",
    "today",
    "hoy",
    "qualify",
    "califico",
  ];

  let result = text;

  // Create highlighted version
  highlightPhrases.forEach((phrase) => {
    const regex = new RegExp(`(${phrase})`, "gi");
    result = result.replace(
      regex,
      `<mark class="bg-yellow-200/70 px-0.5 rounded">$1</mark>`
    );
  });

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
