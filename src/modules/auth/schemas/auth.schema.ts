import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(10)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshDto = z.infer<typeof refreshSchema>;

