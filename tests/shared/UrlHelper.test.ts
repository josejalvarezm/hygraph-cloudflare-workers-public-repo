import { UrlHelper } from '../../src/shared/UrlHelper';

describe('UrlHelper', () => {
  describe('extractSlugFromPath', () => {
    it('should extract slug from valid article path', () => {
      const slug = UrlHelper.extractSlugFromPath('/articles/my-blog-post');
      expect(slug).toBe('my-blog-post');
    });

    it('should return null for invalid path', () => {
      const slug = UrlHelper.extractSlugFromPath('/invalid-path');
      expect(slug).toBeNull();
    });

    it('should handle URL encoding', () => {
      const slug = UrlHelper.extractSlugFromPath('/articles/hello%20world');
      expect(slug).toBe('hello world');
    });
  });

  describe('endpoint detection', () => {
    it('should detect articles endpoint', () => {
      expect(UrlHelper.isArticlesEndpoint('/articles')).toBe(true);
      expect(UrlHelper.isArticlesEndpoint('/articles/')).toBe(false);
    });

    it('should detect article by slug endpoint', () => {
      expect(UrlHelper.isArticleBySlugEndpoint('/articles/test')).toBe(true);
      expect(UrlHelper.isArticleBySlugEndpoint('/articles')).toBe(false);
    });

    it('should detect recent endpoint', () => {
      expect(UrlHelper.isRecentEndpoint('/recent')).toBe(true);
      expect(UrlHelper.isRecentEndpoint('/recent/')).toBe(false);
    });
  });

  describe('parseQueryParams', () => {
    it('should parse query parameters', () => {
      const url = new URL('https://example.com?limit=5&orderBy=date');
      const params = UrlHelper.parseQueryParams(url);
      
      expect(params).toEqual({
        limit: '5',
        orderBy: 'date'
      });
    });

    it('should return empty object for no params', () => {
      const url = new URL('https://example.com');
      const params = UrlHelper.parseQueryParams(url);
      
      expect(params).toEqual({});
    });
  });
});