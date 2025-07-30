import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { id } from 'zod/v4/locales';

const createTaskInput = z.object({
  title: z.string(),
  description: z.string()
})

const createTaskOutput = z.object({
  id: z.string()
})

export const createTask = authenticatedProcedure
  .input(createTaskInput)
  .output(createTaskOutput)
  .mutation(async (opts) => {
    // Your logic goes here
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  });
