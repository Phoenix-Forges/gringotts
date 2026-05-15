import type { Request } from '@hapi/hapi';

export interface AuthCredentials {
  userId: string;
  role: string;
  email: string;
}

export function getAuth(request: Request): AuthCredentials {
  return request.auth.credentials as unknown as AuthCredentials;
}

