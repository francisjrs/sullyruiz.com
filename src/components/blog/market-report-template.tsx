import type { BlogPostMeta } from "@/lib/blog-types";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

interface MarketReportTemplateProps {
  meta: BlogPostMeta;
  children: React.ReactNode;
}

export function MarketReportTemplate({
  meta,
  children,
}: MarketReportTemplateProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const date = new Date(meta.publishedAt).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long" }
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Report header */}
      <div className="border-2 border-[var(--blog-accent)] rounded-xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="blog-category-badge">{t("categories.market-report")}</span>
          <span className="text-xs text-[var(--blog-text-muted)]">{date}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{meta.title}</h1>
        <p className="mt-2 text-[var(--blog-text-muted)]">
          {meta.description}
        </p>
      </div>

      {/* Content */}
      <div className="blog-prose">{children}</div>

      {/* CTA */}
      <div className="mt-10 bg-[var(--blog-card-bg)] border border-[var(--blog-border)] rounded-xl p-6 sm:p-8 text-center">
        <h3 className="text-xl font-bold mb-2">{t("cta.valuation")}</h3>
        <p className="text-sm text-[var(--blog-text-muted)] mb-4">
          {t("cta.valuationSub")}
        </p>
        <Link
          href={`${prefix}/screening`}
          className="inline-block bg-[var(--blog-accent)] text-white font-semibold px-6 py-3 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          {t("cta.button")}
        </Link>
      </div>
    </div>
  );
}
