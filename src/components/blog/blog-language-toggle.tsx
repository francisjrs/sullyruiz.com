"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function BlogLanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  const otherLocale = locale === "en" ? "es" : "en";

  // Build the alternate path
  let altPath: string;
  if (locale === "en") {
    // Currently en, switch to /es/...
    altPath = `/es${pathname}`;
  } else {
    // Currently es, remove /es prefix
    altPath = pathname.replace(/^\/es/, "") || "/";
  }

  return (
    <Link
      href={altPath}
      className="text-xs font-medium px-2 py-1 rounded border border-[var(--blog-border)] text-[var(--blog-text-muted)] hover:text-[var(--blog-accent)] hover:border-[var(--blog-accent)] transition-colors"
    >
      {otherLocale === "en" ? "EN" : "ES"}
    </Link>
  );
}
