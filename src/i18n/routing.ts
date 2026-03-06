import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/privacy': '/privacy',
    '/terms': '/terms',
    '/data-deletion': '/data-deletion',
    '/screening': '/screening',
    '/consult': {
      en: '/consult',
      es: '/consulta'
    },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/blog/category/[category]': '/blog/category/[category]',
    '/blog/tag/[tag]': '/blog/tag/[tag]'
  }
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
