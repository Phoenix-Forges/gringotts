import Boom from '@hapi/boom';
import type { Plugin } from '@hapi/hapi';
import { AppError } from '../shared/errors/app-error.js';
import { logger } from '../infrastructure/logging/logger.js';

export const errorHandlerPlugin: Plugin<void> = {
  name: 'error-handler',
  register(server) {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;
      if (!(response instanceof Error)) return h.continue;

      if (response instanceof AppError) {
        return h
          .response({ error: { code: response.code, message: response.message, details: response.details } })
          .code(response.statusCode);
      }

      if (Boom.isBoom(response)) {
        return h
          .response({ error: { code: response.output.payload.error, message: response.message } })
          .code(response.output.statusCode);
      }

      logger.error({ error: response, path: request.path }, 'Unhandled request error');
      return h.response({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }).code(500);
    });
  }
};

