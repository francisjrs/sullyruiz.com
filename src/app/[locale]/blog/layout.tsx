import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogFooter } from "@/components/blog/blog-footer";
import {
  siteConfig,
  getCanonicalUrl,
  getAlternateLinks,
  getOgLocale,
} from "@/lib/seo-config";
import "./blog.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === "es"
      ? "Blog | Sully Ruiz Bienes Raices"
      : "Blog | Sully Ruiz Real Estate";
  const description =
    locale === "es"
      ? "Guias de bienes raices, reportes de mercado y consejos para compradores y vendedores en Texas Central."
      : "Real estate guides, market reports, and tips for buyers and sellers in Central Texas.";

  const canonicalUrl = getCanonicalUrl("/blog", locale);
  const alternateLinks = getAlternateLinks("/blog");

  return {
    title: {
      default: title,
      template: `%s | Sully Ruiz Blog`,
    },
    description,
    metadataBase: new URL(siteConfig.baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLinks,
    },
    openGraph: {
      type: "website",
      locale: getOgLocale(locale),
      alternateLocale: locale === "en" ? "es_MX" : "en_US",
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      title,
      description,
    },
  };
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="blog-theme min-h-screen flex flex-col">
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
