export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: {
    url: string;
    alt?: string;
  };
  author?: {
    name: string;
    avatar?: {
      url: string;
    };
  };
}

export interface BlogListResponse {
  articles: BlogArticle[];
}

export interface BlogDetailResponse {
  article: BlogArticle;
}

export interface HygraphResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export interface HygraphQueryOptions {
  orderBy?: string;
  first?: number;
  skip?: number;
}

export interface HygraphQueryVariables {
  [key: string]: unknown;
}