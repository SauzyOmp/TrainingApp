import { Prisma } from '../../../prisma/client';

const errorTypeCodeMap = {
  CONFLICT: 'P2002',
  NOT_FOUND: 'P2025'
} as const;

export const isPrismaError = (err: unknown, type: keyof typeof errorTypeCodeMap) =>
  err instanceof Prisma.PrismaClientKnownRequestError &&
  err.code === errorTypeCodeMap[type];
