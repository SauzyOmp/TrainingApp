import { generateDummyUserData } from '../../../dummy/helpers/dummy-user';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';
import { title } from 'process';

describe('Create task', () => {
  let requestingUser: User;
  let createTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['createTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: [],
      }),
    });
    createTask = appRouter
      .createCaller({ userId: requestingUser.id })
      .tasks
      .createTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('Creates the task', async () => {
    const title = faker.book.title()
    const description = faker.commerce.productDescription()
    const { id: taskId } = await createTask({ title, description })

    try {
      const foundTask = await prisma.task.findUnique({
        where: { id: taskId }
      })
      expect(foundTask).toBeDefined()
      expect(foundTask).toHaveProperty('title', title)
      expect(foundTask).toHaveProperty('description', description)

    } finally {
      await prisma.task.delete({ where: { id: taskId }})
    }
  })
});