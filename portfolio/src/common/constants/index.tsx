import { ContentType } from "../providers/provider";

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://kawka.me';

export const BLOG_PATH = '/blog';
export const BLOG_PATH_WITH_CATEGORY = (category: ContentType) =>
  `${BLOG_PATH}?content=${category}`;

export const GOOGLE_CODE_IN_ARTICLE_PATH = `${BLOG_PATH}/winning-google-code-in-2018`;

export const SOCIALS = {
  telegram: {
    url: '',
    handle: '',
  },
  mail: {
    url: '',
    handle: '',
  },
  linkedin: {
    url: '',
    handle: '',
  },
  github: {
    url: '',
    handle: '',
  },
  twitter: {
    url: '',
    handle: '',
  },
  youtube: {
    url: '',
    handle: '',
  },
  stackoverflow: {
    url: '',
    handle: '',
  },
  reddit: {
    url: '',
    handle: '@letelete0000',
  },
};

export const PORTFOLIO_GITHUB_REPOSITORY_URL =
  '';
