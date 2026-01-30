import { businessInfo, siteConfig, socialLinks } from "@/lib/seo-config";

interface FAQItem {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  locale: string;
  faqItems?: FAQItem[];
}

export function StructuredData({ locale, faqItems }: StructuredDataProps) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RealEstateAgent"],
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: businessInfo.name,
    legalName: businessInfo.legalName,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/images/logo.png`,
    image: `${siteConfig.baseUrl}/images/sully-ruiz.jpg`,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.street,
      addressLocality: businessInfo.address.city,
      addressRegion: businessInfo.address.state,
      postalCode: businessInfo.address.zip,
      addressCountry: businessInfo.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.3933,
      longitude: -97.7225,
    },
    areaServed: businessInfo.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
      containedInPlace: {
        "@type": "State",
        name: "Texas",
      },
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: businessInfo.rating.value,
      reviewCount: businessInfo.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "16:00",
      },
    ],
    sameAs: [
      socialLinks.facebook,
      socialLinks.instagram,
      socialLinks.linkedin,
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.baseUrl}/#person`,
    name: businessInfo.name,
    jobTitle: "Real Estate Agent",
    url: siteConfig.baseUrl,
    image: `${siteConfig.baseUrl}/images/sully-ruiz.jpg`,
    email: businessInfo.email,
    telephone: businessInfo.phone,
    worksFor: {
      "@type": "RealEstateAgent",
      name: businessInfo.brokerage,
      address: {
        "@type": "PostalAddress",
        streetAddress: businessInfo.address.street,
        addressLocality: businessInfo.address.city,
        addressRegion: businessInfo.address.state,
        postalCode: businessInfo.address.zip,
      },
    },
    knowsLanguage: [
      {
        "@type": "Language",
        name: "English",
        alternateName: "en",
      },
      {
        "@type": "Language",
        name: "Spanish",
        alternateName: "es",
      },
    ],
    sameAs: [
      socialLinks.facebook,
      socialLinks.instagram,
      socialLinks.linkedin,
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    url: siteConfig.baseUrl,
    name: siteConfig.siteName,
    description:
      locale === "es"
        ? "Encuentra tu hogar ideal en Texas o vende tu propiedad al mejor precio. Servicios de bienes raíces con atención personalizada."
        : "Find your dream home in Texas or sell your property for top dollar. Expert real estate services with personalized attention.",
    publisher: {
      "@id": `${siteConfig.baseUrl}/#person`,
    },
    inLanguage: locale === "es" ? "es-MX" : "en-US",
  };

  const faqSchema =
    faqItems && faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}
