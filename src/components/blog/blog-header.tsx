"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { BlogLanguageToggle } from "./blog-language-toggle";

const CATEGORIES = [
  "area-guide",
  "market-report",
  "buyer-guide",
  "seller-guide",
] as const;

export function BlogHeader() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="relative z-10">
              <span className="font-sans text-xl font-medium tracking-[0.2em] uppercase">
                Sully Ruiz
              </span>
            </Link>
            <span className="hidden sm:inline text-[#BEB09E] text-sm font-sans uppercase tracking-widest">
              Blog
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`${prefix}/blog/category/${cat}`}
                className="font-sans text-xs uppercase tracking-widest text-black/60 hover:text-[#BEB09E] transition-colors"
              >
                {t(`categories.${cat}`)}
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <BlogLanguageToggle />
            </div>
            <Link
              href="/"
              className="hidden lg:inline-block bg-black text-white hover:bg-[#BEB09E] font-sans text-xs uppercase tracking-widest px-5 py-2.5 transition-all duration-300"
            >
              {locale === "es" ? "Inicio" : "Home"}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative z-10 p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-0 bg-white z-40 text-black"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {CATEGORIES.map((cat, index) => (
                <motion.a
                  key={cat}
                  href={`${prefix}/blog/category/${cat}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="font-sans text-lg uppercase tracking-[0.2em] hover:text-[#BEB09E] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t(`categories.${cat}`)}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-4 mt-8"
              >
                <BlogLanguageToggle />
                <Link
                  href="/"
                  className="bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest px-8 py-3 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {locale === "es" ? "Inicio" : "Home"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
