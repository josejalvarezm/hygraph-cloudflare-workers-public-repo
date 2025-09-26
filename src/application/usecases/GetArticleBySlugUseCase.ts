import { IBlogRepository } from '@domain/interfaces/IBlogRepository';
import { BlogArticle } from '@domain/models/BlogModels';
import { ILogger } from '@domain/interfaces/IServices';

export class GetArticleBySlugUseCase {
  constructor(
    private readonly blogRepository: IBlogRepository,
    private readonly logger: ILogger
  ) {}

  async execute(slug: string): Promise<BlogArticle> {
    if (!slug || slug.trim() === '') {
      const error = new Error('Slug parameter is required and cannot be empty');
      // Only log errors - optimized for Cloudflare Workers
      this.logger.error('GetArticleBySlugUseCase validation failed', error);
      throw error;
    }

    try {
      const article = await this.blogRepository.getArticleBySlug(slug);

      if (!article) {
        const error = new Error(`Article with slug '${slug}' not found`);
        // Only log warnings for not found - no success logging
        this.logger.warn('Article not found', { slug });
        throw error;
      }

      // No success logging to minimize costs
      return article;
    } catch (error) {
      // Only log actual errors
      this.logger.error('GetArticleBySlugUseCase failed', error as Error, { slug });
      throw error;
    }
  }
}