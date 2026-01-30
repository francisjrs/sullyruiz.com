"use client";

import { useTranslations } from "next-intl";
import { Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function ConsultFooter() {
  const t = useTranslations("consult.footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white section-padding">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Agent Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#BEB09E]">
                <Image
                  src="/images/sully-portrait.webp"
                  alt="Sully Ruiz"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-sans text-xl font-medium tracking-wide">
                  Sully Ruiz
                </span>
                <p className="body-sm text-white/60">Texas Real Estate</p>
              </div>
            </div>
            <p className="body-lg text-white/70 max-w-md">{t("tagline")}</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="heading-sm text-sm mb-6 text-[#BEB09E]">
              {t("contact.title")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${t("contact.email")}`}
                  className="flex items-center gap-3 body-md text-white/70 hover:text-[#BEB09E] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {t("contact.email")}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${t("contact.phone").replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-3 body-md text-white/70 hover:text-[#BEB09E] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {t("contact.phone")}
                </a>
              </li>
            </ul>
          </div>

          {/* Equal Housing */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  className="w-full h-full text-white/60"
                >
                  <path d="M24 4L4 20v24h16V32h8v12h16V20L24 4zm0 4.5L40 22v18h-8V28H16v12H8V22L24 8.5z" />
                </svg>
              </div>
              <p className="body-sm text-white/60">{t("compliance.equalHousing")}</p>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-white/10" />

        {/* Compliance */}
        <div className="text-center space-y-3 mb-8">
          <p className="body-sm text-white/60">
            {t("compliance.brokerage")} • {t("compliance.address")} •{" "}
            {t("compliance.license")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a
              href="https://www.trec.texas.gov/forms/information-about-brokerage-services"
              target="_blank"
              rel="noopener noreferrer"
              className="body-sm text-white/60 hover:text-[#BEB09E] transition-colors underline"
            >
              {t("compliance.iabs")}
            </a>
            <span className="text-white/30">|</span>
            <a
              href="https://www.trec.texas.gov/forms/consumer-protection-notice"
              target="_blank"
              rel="noopener noreferrer"
              className="body-sm text-white/60 hover:text-[#BEB09E] transition-colors underline"
            >
              {t("compliance.consumerProtection")}
            </a>
          </div>
        </div>

        <Separator className="mb-8 bg-white/10" />

        {/* Copyright */}
        <div className="text-center">
          <p className="body-sm text-white/50">
            {t("copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
