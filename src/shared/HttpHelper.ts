export interface HttpResponse {
  status: number;
  body: string;
  headers: Record<string, string>;
}

export class HttpHelper {
  static allowedOrigins = [
    'https://your-blog-domain.com'
  ];

  static getCorsOrigin(request: Request): string | null {
    const origin = request.headers.get('Origin');
    if (origin && HttpHelper.allowedOrigins.includes(origin)) {
      return origin;
    }
    return null;
  }

  static createJsonResponse(data: unknown, status: number = 200, request?: Request): Response {
    const origin = request ? HttpHelper.getCorsOrigin(request) : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (origin) {
      headers['Access-Control-Allow-Origin'] = origin;
    }
    return new Response(JSON.stringify(data), {
      status,
      headers
    });
  }

  static createErrorResponse(message: string, status: number = 500, request?: Request): Response {
    return HttpHelper.createJsonResponse({ error: message }, status, request);
  }

  static createNotFoundResponse(message?: string, request?: Request): Response {
    return HttpHelper.createErrorResponse(message || 'Resource not found', 404, request);
  }

  static createBadRequestResponse(message?: string, request?: Request): Response {
    return HttpHelper.createErrorResponse(message || 'Bad request', 400, request);
  }

  static handleCors(request: Request): Response | null {
    if (request.method === 'OPTIONS') {
      const origin = HttpHelper.getCorsOrigin(request);
      const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };
      if (origin) {
        headers['Access-Control-Allow-Origin'] = origin;
      }
      return new Response(null, {
        status: 204,
        headers
      });
    }
    return null;
  }
}