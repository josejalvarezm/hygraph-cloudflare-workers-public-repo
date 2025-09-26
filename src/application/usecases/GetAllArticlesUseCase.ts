import { IBlogRepository } from '@domain/interfaces/IBlogRepository';
import { BlogArticle, HygraphQueryOptions } from '@domain/models/BlogModels';
import { ILogger } from '@domain/interfaces/IServices';

export class GetAllArticlesUseCase {
  constructor(
    private readonly blogRepository: IBlogRepository,
    private readonly logger: ILogger
  ) {}

  async execute(orderBy?: string, limit?: number, skip?: number): Promise<BlogArticle[]> {
    try {
      const options: HygraphQueryOptions = {};
      if (orderBy) {
        options.orderBy = orderBy;
      }
      if (limit) {
        options.first = limit;
      }
      if (skip) {
        options.skip = skip;
      }
      
      const articles = await this.blogRepository.getAllArticles(options);

      // No success logging to minimize costs - Cloudflare Workers are cost-optimized
      return articles;
    } catch (error) {
      // Only log actual errors
      this.logger.error('GetAllArticlesUseCase failed', error as Error, { orderBy, limit, skip });
      throw error;
    }
  }
}