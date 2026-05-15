import { Redis } from 'ioredis';
import { config } from '../../config/env.js';

export interface CacheStore {
  getJson<T>(key: string): Promise<T | null>;
  setJson<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
}

export const redis = new Redis(config.redisUrl, { maxRetriesPerRequest: null });

export class RedisCacheStore implements CacheStore {
  async getJson<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value === null ? null : (JSON.parse(value) as T);
  }

  async setJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }
}

export const cache = new RedisCacheStore();
