import type { User } from '@prisma/client';

export const toUserDto = (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role
});

