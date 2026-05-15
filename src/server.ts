import Hapi from '@hapi/hapi';
import { config } from './config/env.js';
import { prisma } from './infrastructure/database/prisma.js';
import { redis } from './infrastructure/cache/cache.js';
import { authPlugin } from './plugins/auth.js';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import { requestLoggerPlugin } from './plugins/request-logger.js';
import { securityPlugin } from './plugins/security.js';
import { swaggerPlugin } from './plugins/swagger.js';
import { registerRoutes } from './routes.js';

export async function createServer(): Promise<Hapi.Server> {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
    routes: {
      cors: { origin: config.security.corsOrigins },
      validate: { failAction: async (_request, _h, error) => { throw error; } }
    }
  });

  await server.register([requestLoggerPlugin, securityPlugin, errorHandlerPlugin, authPlugin, swaggerPlugin]);

  server.route({
    method: 'GET',
    path: '/health',
    options: { tags: ['api', 'health'], auth: false },
    handler: () => ({ status: 'ok', service: 'gringotts' })
  });

  server.route({
    method: 'GET',
    path: '/ready',
    options: { tags: ['api', 'health'], auth: false },
    handler: async () => {
      await prisma.$queryRaw`SELECT 1`;
      await redis.ping();
      return { status: 'ready' };
    }
  });

  await registerRoutes(server);
  return server;
}

