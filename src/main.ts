import { createServer } from './server.js';
import { logger } from './infrastructure/logging/logger.js';

const server = await createServer();
await server.start();
logger.info({ uri: server.info.uri }, 'Gringotts API started');

const shutdown = async (): Promise<void> => {
  logger.info('Shutting down');
  await server.stop({ timeout: 10_000 });
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());

