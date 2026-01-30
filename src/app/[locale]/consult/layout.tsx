import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import {
  siteConfig,
  getCanonicalUrl,
  getAlternateLinks,
  getOgLocale,
} from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const consultMessages = messages.consult as {
    metadata: { title: string; description: string };
  };
  const metadata = consultMessages?.metadata || {
    title: locale === "es"
      ? "Consulta Gratis para Compradores | Sully Ruiz"
      : "Free Homebuyer Consultation | Sully Ruiz",
    description: locale === "es"
      ? "¿El banco te dijo que no? Obtén una consulta gratis para explorar tu camino hacia la compra de casa."
      : "Bank said no? Get a free consultation to explore your path to homeownership.",
  };

  const canonicalUrl = getCanonicalUrl("/consulta", locale);
  const alternateLinks = getAlternateLinks("/consulta");

  return {
    title: metadata.title,
    description: metadata.description,
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
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: `/${locale}/consulta/opengraph-image`,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [`/${locale}/consulta/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function ConsultaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
