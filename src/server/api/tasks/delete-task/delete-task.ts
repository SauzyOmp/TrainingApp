import { z } from 'zod/v4';
import { Prisma, prisma } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { id } from 'zod/v4/locales';

const deleteTaskInput = z.object({
  id: z.string()
})

const deleteTaskOutput = z.void();

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks']})
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async (opts) => {
    try {
      await prisma.task.delete({
          where: {
            userId : opts.ctx.userId,
            id : opts.input.id
        }
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        console.error(e)
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      throw e;
    }
  });
