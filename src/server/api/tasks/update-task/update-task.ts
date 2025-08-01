import { z } from 'zod/v4';
import { prisma, TaskStatus } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { NodeWithI18n } from '@angular/compiler';
import { id } from 'zod/v4/locales';
import { isPrismaError } from '../../../utils/prisma';

const updateTaskInput = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.literal(Object.values(TaskStatus))
});

const updateTaskOutput = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  completedDate: z.date().nullable(),
  userId: z.string(),
  status: z.literal(Object.values(TaskStatus))
});

export const updateTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(updateTaskInput)
  .output(updateTaskOutput)
  .mutation(async (opts) => {

    const task = await prisma.task.findUnique({
      where: {
          id: opts.input.id,
          userId: opts.ctx.userId,
        }
    })

    if (!task) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    let newCompleteDate: null | Date = task.completedDate;

    if (opts.input.status != task.status) {
      if (opts.input.status === 'Complete') {
        newCompleteDate = new Date();
      }
      else {
        newCompleteDate = null;
      }
    }
    

    try {
      return await prisma.task.update({
        where: {
          id: task.id,
        },
        data: {
          title: opts.input.title,
          description: opts.input.description,
          status: opts.input.status,
          completedDate: newCompleteDate,
        },
      });
    } catch (error) {

      if (isPrismaError(error, 'NOT_FOUND')) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      throw error;
    }
  });
