import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { routing } from "@/i18n/routing";
import { ToastProvider } from "@/components/toast-provider";
import { StructuredData } from "@/components/structured-data";
import {
  siteConfig,
  getCanonicalUrl,
  getAlternateLinks,
  getOgLocale,
} from "@/lib/seo-config";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const metadata = messages.metadata as { title: string; description: string };

  const canonicalUrl = getCanonicalUrl("/", locale);
  const alternateLinks = getAlternateLinks("/");

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
          url: "/opengraph-image",
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
      images: ["/opengraph-image"],
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the provider
  const messages = await getMessages();

  // Extract FAQ items for structured data
  const faqMessages = messages.faq as {
    items: Record<string, { question: string; answer: string }>;
  };
  const faqItems = faqMessages?.items
    ? Object.values(faqMessages.items).map((item) => ({
        question: item.question,
        answer: item.answer,
      }))
    : [];

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        {/* Preload hero image for LCP optimization */}
        <link
          rel="preload"
          href="/images/hero.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body
        className={`${montserrat.variable} ${cormorant.variable} antialiased`}
      >
        <StructuredData locale={locale} faqItems={faqItems} />
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>{children}</ToastProvider>
        </NextIntlClientProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
