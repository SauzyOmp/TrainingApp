import { generateDummyUserData } from '../../../dummy/helpers/dummy-user';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';

describe('Get tasks by user', () => {
  let requestingUser: User;
  let getTasksByUser: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['getTasksByUser'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: ['user'],
      }),
    });
    getTasksByUser = appRouter
      .createCaller({ userId: requestingUser.id })
      .tasks
      .getTasksByUser;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('gets the tasks', async () => {
  const page = 3;
  const total = 5
  const tasks = await prisma.task.createManyAndReturn({
    data: [
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id }
    ]
  });
  try {
    const retrievedTasks = await getTasksByUser({ pageSize: page, pageOffset: 0 });

    expect(retrievedTasks).toHaveProperty('totalCount', total);
    expect(retrievedTasks.data.length).toBe(page);
  } finally {
    await prisma.task.deleteMany({ 
      where: { 
        id: { 
          in: tasks.map(task => task.id)
        }
      } 
    });
  }
  });

  it('errors on bad pagination', async () => {
  const total = 5;
  const page = 3;
  const tasks = await prisma.task.createManyAndReturn({
    data: [
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id },
      { title: faker.book.title(), userId: requestingUser.id }
    ]
  });

  let error;
  try {
    await getTasksByUser({ pageSize: page, pageOffset: total });
  } catch (err) {
    error = err;
  } finally {
    await prisma.task.deleteMany({ 
      where: { id: { in: tasks.map(task => task.id) } } 
    });
  }

  expect(error).toHaveProperty('code', 'BAD_REQUEST');
});

it('returns empty if empty database', async () => {
  const result = await getTasksByUser({ pageSize: 10, pageOffset: 0 });

  expect(result).toHaveProperty('totalCount', 0);
  expect(result.data).length(0);
});
});