import { IHygraphClient } from '@domain/interfaces/IBlogRepository';
import { ILogger, IConfigurationService } from '@domain/interfaces/IServices';
import { HygraphResponse } from '@domain/models/BlogModels';

export class HygraphClient implements IHygraphClient {
  constructor(
    private readonly configService: IConfigurationService,
    private readonly logger: ILogger
  ) {}

  async executeQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    try {
      // Minimal debug logging to optimize costs
      if (this.configService.getEnvironment() === 'development') {
        this.logger.debug('Executing GraphQL query', { query, variables });
      }

      const body = JSON.stringify({
        query,
        variables
      });

      const response = await fetch(this.configService.getHygraphApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.configService.getHygraphToken()}`
        },
        body
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
        this.logger.error('HTTP request failed', error, { 
          status: response.status, 
          statusText: response.statusText 
        });
        throw error;
      }

      const data: HygraphResponse<T> = await response.json();

      if (data.errors && data.errors.length > 0) {
        const error = data.errors[0];
        if (error) {
          this.logger.error('GraphQL query returned errors', new Error(error.message), {
            query,
            variables,
            errors: data.errors
          });
          throw new Error(`GraphQL Error: ${error.message}`);
        }
      }

      // No success logging to minimize costs
      return data.data;
    } catch (error) {
      this.logger.error('Failed to execute GraphQL query', error as Error, { query, variables });
      throw error;
    }
  }
}