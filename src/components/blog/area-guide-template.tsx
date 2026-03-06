import type { BlogPostMeta } from "@/lib/blog-types";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

interface AreaGuideTemplateProps {
  meta: BlogPostMeta;
  children: React.ReactNode;
}

export function AreaGuideTemplate({ meta, children }: AreaGuideTemplateProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;
  const city = meta.cities[0] || "Central Texas";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* City header */}
      <div className="bg-[var(--blog-accent)] text-white rounded-xl p-6 sm:p-8 mb-8">
        <p className="text-sm font-medium opacity-80 mb-1">
          {t("areaGuide")}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">{meta.title}</h1>
        <p className="mt-2 opacity-90">{meta.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <div className="blog-prose">{children}</div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-[var(--blog-border)] rounded-lg p-5 sticky top-20">
            <h3 className="font-bold text-sm mb-3">{t("quickFacts")}</h3>
            <dl className="space-y-2 text-sm">
              <dt className="font-semibold">{t("area")}</dt>
              <dd className="text-[var(--blog-text-muted)]">{city}, TX</dd>
              {meta.tags.length > 0 && (
                <>
                  <dt className="font-semibold mt-2">{t("topics")}</dt>
                  <dd className="flex flex-wrap gap-1">
                    {meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-[var(--blog-card-bg)] px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </>
              )}
            </dl>

            <Link
              href={`${prefix}/consult`}
              className="mt-4 block text-center bg-[var(--blog-accent)] text-white font-semibold py-2.5 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              {t("cta.tour")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
