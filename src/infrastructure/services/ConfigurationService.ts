import { IConfigurationService } from '@domain/interfaces/IServices';
import { Env } from '../../types';

export class ConfigurationService implements IConfigurationService {
  constructor(private readonly env: Env) {}

  getHygraphApiUrl(): string {
    const url = this.env.HYGRAPH_ENDPOINT;
    if (!url) {
      throw new Error('HYGRAPH_ENDPOINT environment variable is not set');
    }
    return url;
  }

  getHygraphToken(): string {
    const token = this.env.HYGRAPH_TOKEN;
    if (!token) {
      throw new Error('HYGRAPH_TOKEN environment variable is not set');
    }
    return token;
  }

  getEnvironment(): string {
    return this.env.ENVIRONMENT || 'production';
  }
}