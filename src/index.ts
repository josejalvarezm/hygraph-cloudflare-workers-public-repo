import { Env } from './types';
import { ConfigurationService } from '@infrastructure/services/ConfigurationService';
import { Logger } from '@infrastructure/services/Logger';
import { HygraphClient } from '@infrastructure/services/HygraphClient';
import { BlogRepository } from '@infrastructure/repositories/BlogRepository';
import { GetAllArticlesUseCase } from '@application/usecases/GetAllArticlesUseCase';
import { GetArticleBySlugUseCase } from '@application/usecases/GetArticleBySlugUseCase';
import { GetRecentArticlesUseCase } from '@application/usecases/GetRecentArticlesUseCase';
import { HttpHelper } from '@shared/HttpHelper';
import { UrlHelper } from '@shared/UrlHelper';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    const corsResponse = HttpHelper.handleCors(request);
    if (corsResponse) {
      return corsResponse;
    }

    // Only handle GET requests
    if (request.method !== 'GET') {
      return HttpHelper.createErrorResponse('Method not allowed', 405);
    }

    try {
      // Initialize dependencies
      const configService = new ConfigurationService(env);
      const logger = new Logger();
      const hygraphClient = new HygraphClient(configService, logger);
      const blogRepository = new BlogRepository(hygraphClient, logger);

      // Initialize use cases
      const getAllArticlesUseCase = new GetAllArticlesUseCase(blogRepository, logger);
      const getArticleBySlugUseCase = new GetArticleBySlugUseCase(blogRepository, logger);
      const getRecentArticlesUseCase = new GetRecentArticlesUseCase(blogRepository, logger);

      const url = new URL(request.url);
      const pathname = url.pathname;

      // Route handling
      if (UrlHelper.isRecentEndpoint(pathname)) {
        const params = UrlHelper.parseQueryParams(url);
        const limit = params.limit ? parseInt(params.limit, 10) : 5;
        
        const articles = await getRecentArticlesUseCase.execute(limit);
  return HttpHelper.createJsonResponse({ articles }, 200, request);
      }

      if (UrlHelper.isArticleBySlugEndpoint(pathname)) {
        const slug = UrlHelper.extractSlugFromPath(pathname);
        
        if (!slug) {
          return HttpHelper.createBadRequestResponse('Invalid article slug');
        }

        const article = await getArticleBySlugUseCase.execute(slug);
  return HttpHelper.createJsonResponse({ article }, 200, request);
      }

      if (UrlHelper.isArticlesEndpoint(pathname)) {
        const params = UrlHelper.parseQueryParams(url);
        const orderBy = params.orderBy;
        const limit = params.limit ? parseInt(params.limit, 10) : undefined;
        const skip = params.skip ? parseInt(params.skip, 10) : undefined;

        const articles = await getAllArticlesUseCase.execute(orderBy, limit, skip);
  return HttpHelper.createJsonResponse({ articles }, 200, request);
      }

      // Root endpoint - API info
      if (pathname === '/') {
        return HttpHelper.createJsonResponse({
          message: 'Hygraph Blog API - Cloudflare Workers',
          endpoints: {
            'GET /articles': 'Get all articles (supports orderBy, limit, skip query params)',
            'GET /articles/{slug}': 'Get article by slug',
            'GET /recent': 'Get recent articles (supports limit query param)'
          },
          version: '1.0.0'
        }, 200, request);
      }

  return HttpHelper.createNotFoundResponse('Endpoint not found', request);
    } catch (error) {
      console.error('Unhandled error:', error);
      
      if (error instanceof Error) {
  return HttpHelper.createErrorResponse(error.message, 500, request);
      }
      
  return HttpHelper.createErrorResponse('Internal server error', 500, request);
    }
  },
};