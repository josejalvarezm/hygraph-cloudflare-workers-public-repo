import { IBlogRepository, IHygraphClient } from '@domain/interfaces/IBlogRepository';
import { BlogArticle, HygraphQueryOptions } from '@domain/models/BlogModels';
import { ILogger } from '@domain/interfaces/IServices';

export class BlogRepository implements IBlogRepository {
  constructor(
    private readonly hygraphClient: IHygraphClient,
    private readonly logger: ILogger
  ) {}

  async getAllArticles(options?: HygraphQueryOptions): Promise<BlogArticle[]> {
    const query = `
      query GetAllArticles($orderBy: PostOrderByInput, $first: Int, $skip: Int) {
        posts(orderBy: $orderBy, first: $first, skip: $skip) {
          id
          title
          excerpt
          slug
          publishedAt
          updatedAt
          keywords
          coverImage {
            url
            width
            height
            altText
          }
            author {
              id
              name
              picture {
                url
              }
            }
        }
      }
    `;

    const variables = {
      orderBy: options?.orderBy || 'publishedAt_DESC',
      first: options?.first,
      skip: options?.skip
    };

    try {
      const response = await this.hygraphClient.executeQuery<{ posts: BlogArticle[] }>(query, variables);
      // No info logging to minimize costs - Cloudflare Workers optimized
      return response.posts || [];
    } catch (error) {
      this.logger.error('Failed to get all articles', error as Error);
      throw error;
    }
  }

  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    const query = `
      query GetArticleBySlug($slug: String!) {
        post(where: { slug: $slug }) {
          id
          title
          content
          excerpt
          slug
          publishedAt
          updatedAt
          keywords
            author {
              id
              name
              picture {
                url
              }
            }
        }
      }
    `;

    try {
      const response = await this.hygraphClient.executeQuery<{ post: BlogArticle }>(query, { slug });
      
      if (!response.post) {
        this.logger.warn(`Article with slug '${slug}' not found`);
        return null;
      }

      // No success logging to minimize costs
      return response.post;
    } catch (error) {
      this.logger.error(`Failed to get article by slug: ${slug}`, error as Error);
      throw error;
    }
  }

  async getRecentArticles(limit: number = 5): Promise<BlogArticle[]> {
    const query = `
      query GetRecentArticles($limit: Int!) {
        posts(orderBy: publishedAt_DESC, first: $limit) {
          id
          title
          excerpt
          slug
          publishedAt
          keywords
            author {
              id
              name
              picture {
                url
              }
            }
        }
      }
    `;

    try {
      const response = await this.hygraphClient.executeQuery<{ posts: BlogArticle[] }>(query, { limit });
      // No success logging to minimize costs
      return response.posts || [];
    } catch (error) {
      this.logger.error('Failed to get recent articles', error as Error);
      throw error;
    }
  }
}