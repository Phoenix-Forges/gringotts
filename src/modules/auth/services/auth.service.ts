import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import type { LoginDto, RefreshDto, RegisterDto } from '../schemas/auth.schema.js';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult extends TokenPair {
  user: { id: string; email: string; name: string; role: string };
}

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(dto: RegisterDto, userAgent?: string, ipAddress?: string): Promise<AuthResult> {
    const existing = await this.repository.findUserByEmail(dto.email);
    if (existing) throw new AppError('CONFLICT', 'User already exists', 409);
    const passwordHash = await bcrypt.hash(dto.password, config.security.bcryptRounds);
    const user = await this.repository.createUser({ email: dto.email, name: dto.name, passwordHash });
    const tokens = await this.issueTokens(user.id, user.email, user.role, userAgent, ipAddress);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string): Promise<AuthResult> {
    const user = await this.repository.findUserByEmail(dto.email);
    if (!user) throw new AppError('AUTH_INVALID_CREDENTIALS', 'Invalid credentials', 401);
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new AppError('AUTH_INVALID_CREDENTIALS', 'Invalid credentials', 401);
    const tokens = await this.issueTokens(user.id, user.email, user.role, userAgent, ipAddress);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  async refresh(dto: RefreshDto, userAgent?: string, ipAddress?: string): Promise<TokenPair> {
    const decoded = jwt.verify(dto.refreshToken, config.jwt.refreshSecret) as jwt.JwtPayload;
    const sessionId = String(decoded['sid']);
    const userId = String(decoded.sub);
    const session = await this.repository.findSession(sessionId);
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new AppError('AUTH_INVALID_TOKEN', 'Invalid refresh token', 401);
    }
    const valid = await bcrypt.compare(dto.refreshToken, session.refreshHash);
    if (!valid) throw new AppError('AUTH_INVALID_TOKEN', 'Invalid refresh token', 401);
    const user = await this.repository.findUserById(userId);
    if (!user) throw new AppError('AUTH_INVALID_TOKEN', 'Invalid refresh token', 401);
    await this.repository.revokeSession(session.id);
    return this.issueTokens(user.id, user.email, user.role, userAgent, ipAddress);
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<TokenPair> {
    const session = await this.repository.createSession({
      userId,
      refreshHash: 'pending',
      ...(userAgent ? { userAgent } : {}),
      ...(ipAddress ? { ipAddress } : {}),
      expiresAt: new Date(Date.now() + config.jwt.refreshTtlSeconds * 1000)
    });
    const accessToken = jwt.sign({ sub: userId, email, role }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessTtlSeconds
    });
    const refreshToken = jwt.sign({ sub: userId, sid: session.id }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTtlSeconds
    });
    const refreshHash = await bcrypt.hash(refreshToken, config.security.bcryptRounds);
    await this.repository.updateSessionRefreshHash(session.id, refreshHash);
    return { accessToken, refreshToken };
  }
}
