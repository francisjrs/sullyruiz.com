"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface AboutProps {
    onContact?: () => void;
}

export function About({ onContact }: AboutProps) {
    const t = useTranslations("about");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section-padding bg-[#f4f1ec] overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:ml-auto">
                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border-2 border-[#BEB09E] translate-x-4 translate-y-4" />

                            {/* Image Container */}
                            <div className="relative h-full w-full overflow-hidden bg-white shadow-xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/images/sully-ruiz.png"
                                    alt="Sully Ruiz"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Minimal Label */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 bg-white px-6 py-3 shadow-lg border border-[#BEB09E]/20">
                            <span className="font-sans text-xs uppercase tracking-widest text-[#BEB09E]">
                                Est. 2018
                            </span>
                        </div>
                    </motion.div>

                    {/* Text Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        <span className="inline-block font-sans text-xs uppercase tracking-[0.2em] text-[#BEB09E] mb-4">
                            {t("subtitle")}
                        </span>
                        <h2 className="heading-lg text-3xl md:text-4xl lg:text-5xl mb-8">
                            {t("title")}
                        </h2>

                        <div className="space-y-6 text-muted-foreground body-lg">
                            <p>{t("bio1")}</p>
                            <p>{t("bio2")}</p>
                        </div>

                        <div className="mt-10">
                            <Button
                                onClick={onContact}
                                className="bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest px-10 py-6 rounded-none transition-all duration-300"
                            >
                                {t("cta")}
                            </Button>
                        </div>

                        {/* Signature or stylistic element */}
                        <div className="mt-12 opacity-40">
                            <span className="font-serif text-4xl italic text-[#BEB09E]">Sully Ruiz</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
