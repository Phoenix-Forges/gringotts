import HapiPino from 'hapi-pino';
import type { Plugin } from '@hapi/hapi';
import { config } from '../config/env.js';

export const requestLoggerPlugin: Plugin<void> = {
  name: 'request-logger',
  async register(server) {
    await server.register({
      plugin: HapiPino,
      options: {
        logPayload: false,
        redact: ['req.headers.authorization'],
        level: config.logging.level
      }
    });
  }
};

