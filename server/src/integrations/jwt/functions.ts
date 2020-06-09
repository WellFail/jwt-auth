import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

export const createToken = (user: User): string => {
  return jwt.sign({
    userId: user.id,
    iss: 'https://auth.example.com/basic',
  }, process.env.JWT_SECRET!, {
    algorithm: 'HS256',
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' },
  );
};
