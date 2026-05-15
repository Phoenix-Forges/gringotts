import type { Plugin } from '@hapi/hapi';
import { config } from '../config/env.js';
import { sanitizeObject } from '../shared/middleware/request-sanitizer.js';

const buckets = new Map<string, { count: number; resetAt: number }>();

export const securityPlugin: Plugin<void> = {
  name: 'security',
  register(server) {
    server.ext('onRequest', (request, h) => {
      const ip = request.info.remoteAddress;
      const now = Date.now();
      const bucket = buckets.get(ip) ?? { count: 0, resetAt: now + 60_000 };
      if (bucket.resetAt < now) {
        bucket.count = 0;
        bucket.resetAt = now + 60_000;
      }
      bucket.count += 1;
      buckets.set(ip, bucket);
      if (bucket.count > config.security.rateLimitPerMinute) {
        return h.response({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } }).code(429).takeover();
      }
      return h.continue;
    });

    server.ext('onPreHandler', (request, h) => {
      if (request.payload && typeof request.payload === 'object') {
        (request as { payload: unknown }).payload = sanitizeObject(request.payload);
      }
      return h.continue;
    });

    server.ext('onPreResponse', (request, h) => {
      const response = request.response;
      if ('header' in response) {
        response.header('x-content-type-options', 'nosniff');
        response.header('x-frame-options', 'DENY');
        response.header('referrer-policy', 'no-referrer');
        response.header('permissions-policy', 'geolocation=(), microphone=(), camera=()');
      }
      return h.continue;
    });
  }
};
