import { generateDummyUserData } from '../../../dummy/helpers/dummy-user';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';
import { createTask } from '../create-task/create-task';
import { title } from 'process';
import { connect } from 'http2';
import { TRPCError } from '@trpc/server';

describe('Delete task', () => {
  let requestingUser: User;
  let deleteTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['deleteTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: ['user'],
      }),
    });
    deleteTask = appRouter
      .createCaller({ userId: requestingUser.id })
      .tasks
      .deleteTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('Deletes the Task', async () => {
    const otherUser = await prisma.user.create({
      data: generateDummyUserData({
        roles: ['user'],
      }),
    });
    const requestingUserTask = await prisma.task.create({ 
      data: {
        title: faker.book.title(),
        description: faker.commerce.productDescription(),
        userId: requestingUser.id
      }
    })

    try{
      const requestingUserTask = await prisma.task.findUnique({
        where: { id: requestingUser.id }
      })
      expect(requestingUserTask).toBeDefined()
      if (requestingUserTask != null) {
        await deleteTask({ id: requestingUserTask.id })
      }
      expect(requestingUserTask).toBeNull()

    } finally {
      await prisma.task.delete({ where: { id: requestingUserTask.id }})
      await prisma.user.delete({ where: { id: otherUser.id }})
    }
  })

  it('Errors when bad man trys to delete my task', async () => {
    const otherUser = await prisma.user.create({
      data: generateDummyUserData({
        roles: ['user'],
      }),
    });
    const otherUserTask = await prisma.task.create({ 
      data: {
        title: faker.book.title(),
        description: faker.commerce.productDescription(),
        userId: otherUser.id
      }
    })

  let error;
  try {
    await deleteTask({ id: otherUserTask.id })
  } catch (e) {
    error = e;
  } finally {
    await prisma.task.delete({ where: { id: otherUserTask.id }})
    await prisma.user.delete({ where: { id: otherUser.id }})
    }

  expect(error).toHaveProperty('code', 'NOT_FOUND');
  expect(otherUserTask).toBeDefined()
});
});