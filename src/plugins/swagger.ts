import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import type { Plugin } from '@hapi/hapi';

export const swaggerPlugin: Plugin<void> = {
  name: 'swagger',
  async register(server) {
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: { title: 'Gringotts API', version: '1.0.0' },
          grouping: 'tags',
          documentationPath: '/documentation'
        }
      }
    ]);
  }
};

