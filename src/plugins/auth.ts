import HapiJwt from '@hapi/jwt';
import type { Plugin } from '@hapi/hapi';
import { config } from '../config/env.js';

export const authPlugin: Plugin<void> = {
  name: 'auth',
  async register(server) {
    await server.register(HapiJwt);
    server.auth.strategy('jwt', 'jwt', {
      keys: config.jwt.accessSecret,
      verify: { aud: false, iss: false, sub: false, nbf: true, exp: true },
      validate: (artifacts) => ({
        isValid: Boolean(artifacts.decoded.payload.sub),
        credentials: {
          userId: String(artifacts.decoded.payload.sub),
          role: String(artifacts.decoded.payload.role),
          email: String(artifacts.decoded.payload.email)
        }
      })
    });
  }
};

