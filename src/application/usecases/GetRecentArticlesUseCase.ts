import { IBlogRepository } from '@domain/interfaces/IBlogRepository';
import { BlogArticle } from '@domain/models/BlogModels';
import { ILogger } from '@domain/interfaces/IServices';

export class GetRecentArticlesUseCase {
  constructor(
    private readonly blogRepository: IBlogRepository,
    private readonly logger: ILogger
  ) {}

  async execute(limit: number = 5): Promise<BlogArticle[]> {
    if (limit <= 0 || limit > 50) {
      const error = new Error('Limit must be between 1 and 50');
      this.logger.error('GetRecentArticlesUseCase validation failed', error);
      throw error;
    }

    try {
      const articles = await this.blogRepository.getRecentArticles(limit);

      // No success logging to minimize costs - Cloudflare Workers optimized
      return articles;
    } catch (error) {
      this.logger.error('GetRecentArticlesUseCase failed', error as Error, { limit });
      throw error;
    }
  }
}