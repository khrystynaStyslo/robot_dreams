import { SetMetadata, applyDecorators } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';

export interface RateLimitOptions {
  ttl: number;
  limit: number;
}

export const RateLimit = (options: RateLimitOptions) => 
  applyDecorators(SetMetadata(RATE_LIMIT_KEY, options));