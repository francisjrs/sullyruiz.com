import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { BlogCategory } from "@/lib/blog-types";

interface BlogCTAProps {
  category?: BlogCategory;
}

export function BlogCTA({ category }: BlogCTAProps) {
  const t = useTranslations("blog.cta");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const isBuyerFocused =
    category === "buyer-guide" ||
    category === "area-guide" ||
    category === "financing";

  const href = isBuyerFocused
    ? `${prefix}/consult`
    : `${prefix}/screening`;

  const text = isBuyerFocused ? t("buyer") : t("seller");
  const subtext = isBuyerFocused ? t("buyerSub") : t("sellerSub");

  return (
    <div className="my-10 border border-[#BEB09E] p-6 sm:p-8 text-center">
      <h3 className="heading-md !text-xl mb-2">{text}</h3>
      <p className="body-md text-[var(--blog-text-muted)] mb-4">{subtext}</p>
      <Link
        href={href}
        className="inline-block bg-black text-white hover:bg-[#BEB09E] font-sans text-xs uppercase tracking-widest px-8 py-3 transition-all duration-300"
      >
        {t("button")}
      </Link>
    </div>
  );
}
