import pino from 'pino';
import { config } from '../../config/env.js';

export const logger = pino(
  config.env === 'development'
    ? {
        level: config.logging.level,
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, singleLine: true }
        }
      }
    : { level: config.logging.level },
);
