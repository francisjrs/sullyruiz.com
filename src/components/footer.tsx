"use client";

import { useTranslations } from "next-intl";
import { Instagram, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/sullyrealtygroup/", label: "Instagram" },
  ];

  return (
    <footer id="contact" className="bg-black text-white section-padding">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-sans text-2xl font-medium tracking-[0.2em] uppercase">
                Sully Ruiz
              </span>
            </Link>
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

          {/* Social */}
          <div>
            <h3 className="heading-sm text-sm mb-6 text-[#BEB09E]">
              {t("social.title")}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-[#BEB09E] hover:bg-[#BEB09E] transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 group-hover:text-black transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-white/10" />

        {/* Compliance */}
        <div className="text-center space-y-3 mb-8">
          <p className="body-sm text-white/60">
            {t("compliance.brokerage")} • {t("compliance.address")} • {t("compliance.license")}
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
            <span className="text-white/30">|</span>
            <span className="body-sm text-white/60">{t("compliance.equalHousing")}</span>
          </div>
          <p className="body-sm text-white/50 italic">
            {t("compliance.disclaimer")}
          </p>
        </div>

        <Separator className="mb-8 bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="body-sm text-white/50">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="body-sm text-white/50 hover:text-[#BEB09E] transition-colors"
            >
              {t("legal.privacy")}
            </a>
            <a
              href="#"
              className="body-sm text-white/50 hover:text-[#BEB09E] transition-colors"
            >
              {t("legal.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
