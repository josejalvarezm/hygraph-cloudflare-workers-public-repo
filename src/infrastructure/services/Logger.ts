import { ILogger } from '@domain/interfaces/IServices';

export class Logger implements ILogger {
  info(message: string, meta?: unknown): void {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  warn(message: string, meta?: unknown): void {
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  error(message: string, error?: Error, meta?: unknown): void {
    console.error(`[ERROR] ${message}`, error?.message || '', meta ? JSON.stringify(meta) : '');
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  debug(message: string, meta?: unknown): void {
    console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta) : '');
  }
}