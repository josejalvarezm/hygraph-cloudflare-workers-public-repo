import { BlogArticle, HygraphQueryOptions } from '../models/BlogModels';

export interface IBlogRepository {
  getAllArticles(options?: HygraphQueryOptions): Promise<BlogArticle[]>;
  getArticleBySlug(slug: string): Promise<BlogArticle | null>;
  getRecentArticles(limit?: number): Promise<BlogArticle[]>;
}

export interface IHygraphClient {
  executeQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
}