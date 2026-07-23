import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/blog': {
      en: '/blog',
      vi: '/blog'
    },
    '/contact': {
      en: '/contact',
      vi: '/lien-he'
    },
    '/projects': {
      en: '/projects',
      vi: '/du-an'
    },
    '/about': { 
      en: '/about',
      vi: '/about'
    },
    '/pathnames': {
      en: '/pathnames',
      vi: '/duong-dan'
    },
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const {Link, getPathname, redirect, usePathname, useRouter} =
  createNavigation(routing);