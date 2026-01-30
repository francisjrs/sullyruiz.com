// SEO Configuration for sullyruiz.com

export const siteConfig = {
  baseUrl: "https://sullyruiz.com",
  siteName: "Sully Ruiz Real Estate",
  defaultLocale: "en" as const,
  locales: ["en", "es"] as const,
} as const;

export const businessInfo = {
  name: "Sully Ruiz",
  legalName: "Sully Ruiz Real Estate",
  phone: "(512) 412-2352",
  phoneRaw: "+15124122352",
  email: "realtor@sullyruiz.com",
  brokerage: "Keller Williams Austin NW",
  licenseNumber: "0742907",
  address: {
    street: "9606 N Mopac Expy, Ste 950",
    city: "Austin",
    state: "TX",
    zip: "78759",
    country: "US",
  },
  serviceAreas: [
    "Austin",
    "Round Rock",
    "Cedar Park",
    "Georgetown",
    "Pflugerville",
    "Hutto",
  ],
  languages: ["en", "es"],
  rating: {
    value: 5.0,
    count: 150,
  },
} as const;

export const socialLinks = {
  facebook: "https://www.facebook.com/sullyruizrealtor",
  instagram: "https://www.instagram.com/sullyruizrealtor",
  linkedin: "https://www.linkedin.com/in/sullyruiz",
} as const;

/**
 * Get the canonical URL for a given path and locale
 */
export function getCanonicalUrl(
  path: string = "",
  locale: string = "en"
): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // English (default) has no prefix, Spanish uses /es
  const localePath = locale === "en" ? "" : `/${locale}`;
  return `${siteConfig.baseUrl}${localePath}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Get alternate language links for hreflang tags
 */
export function getAlternateLinks(path: string = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const pathSuffix = cleanPath === "/" ? "" : cleanPath;

  return {
    en: `${siteConfig.baseUrl}${pathSuffix}`,
    es: `${siteConfig.baseUrl}/es${pathSuffix}`,
    "x-default": `${siteConfig.baseUrl}${pathSuffix}`,
  };
}

/**
 * Get locale code for Open Graph (e.g., en_US, es_MX)
 */
export function getOgLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    en: "en_US",
    es: "es_MX",
  };
  return localeMap[locale] || "en_US";
}

/**
 * Public pages for sitemap generation
 */
export const publicPages = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/screening", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/data-deletion", priority: 0.3, changeFrequency: "yearly" as const },
] as const;
