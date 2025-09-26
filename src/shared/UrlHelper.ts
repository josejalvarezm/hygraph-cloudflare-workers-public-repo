export class UrlHelper {
  static extractSlugFromPath(pathname: string): string | null {
    // Extract slug from paths like /articles/{slug}
    const match = pathname.match(/^\/articles\/(.+)$/);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
  }

  static isArticlesEndpoint(pathname: string): boolean {
    return pathname === '/articles';
  }

  static isArticleBySlugEndpoint(pathname: string): boolean {
    return /^\/articles\/.+$/.test(pathname);
  }

  static isRecentEndpoint(pathname: string): boolean {
    return pathname === '/recent';
  }

  static parseQueryParams(url: URL): Record<string, string> {
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }
}