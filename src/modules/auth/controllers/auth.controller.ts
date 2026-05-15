import type { Request } from '@hapi/hapi';
import { AuthService } from '../services/auth.service.js';
import type { LoginDto, RefreshDto, RegisterDto } from '../schemas/auth.schema.js';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  private userAgent(request: Request): string | undefined {
    const value = request.headers['user-agent'];
    return Array.isArray(value) ? value[0] : value;
  }

  register = (request: Request) =>
    this.service.register(request.payload as RegisterDto, this.userAgent(request), request.info.remoteAddress);

  login = (request: Request) =>
    this.service.login(request.payload as LoginDto, this.userAgent(request), request.info.remoteAddress);

  refresh = (request: Request) =>
    this.service.refresh(request.payload as RefreshDto, this.userAgent(request), request.info.remoteAddress);
}
