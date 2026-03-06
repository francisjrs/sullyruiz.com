export type BlogCategory =
  | "area-guide"
  | "market-report"
  | "buyer-guide"
  | "seller-guide"
  | "financing"
  | "lifestyle"
  | "investment";

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  cities: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface BlogPostMeta extends BlogPostFrontmatter {
  slug: string;
  locales: string[];
  readingTime: number;
}

export interface PostsIndex {
  version: number;
  lastUpdated: string;
  posts: BlogPostMeta[];
}

export interface PublishPayload {
  slug: string;
  locale: string;
  title: string;
  description: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  cities: string[];
  author?: string;
  coverImage?: string;
  coverImageAlt?: string;
  featured?: boolean;
  draft?: boolean;
}
