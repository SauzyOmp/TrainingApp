import { generateDummyUserData } from '../../../dummy/helpers/dummy-user';
import { appRouter } from '../../api.routes';
import { describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';
import { TaskStatus } from '../../../../../prisma/generated/enums';

describe('Update task', () => {
  let requestingUser: User;
  let updateTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['updateTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: ['user'],
      }),
    });
    updateTask = appRouter
      .createCaller({ userId: requestingUser.id })
      .tasks
      .updateTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it ('Updates the different fields', async () => {
    const task = await prisma.task.create({
      data: {
        title: faker.book.title(),
        userId: requestingUser.id
      }
    })

    try {
      const updatedTaskData = await updateTask({
        id: task.id,
        title: 'New Test Title',
        description: 'New Test Description',
        status: task.status
      })
      expect(updatedTaskData).toHaveProperty('title', 'New Test Title')
      expect(updatedTaskData).toHaveProperty('description', 'New Test Description')

    } finally {
      prisma.task.delete({
        where: {
          id: requestingUser.id
        }
      })
    }
  })

  it ('Updates the CompletedDate field when Status is changed to Completed', async () => {
    const task = await prisma.task.create({
      data: {
        title: faker.book.title(),
        userId: requestingUser.id
      }
    })

    try {
      const updatedTaskData = await updateTask({
        id: task.id,
        title: 'New Test Title',
        description: 'New Test Description',
        status: TaskStatus.Complete
      })
      expect(updatedTaskData.completedDate).not.toBeNull()

    } finally {
      prisma.task.delete({
        where: {
          id: requestingUser.id
        }
      })
    }
  })

  it ('Updates the CompletedDate field to null when status is changed from Completed', async() => {
    const task = await prisma.task.create({
      data: {
        title: faker.book.title(),
        userId: requestingUser.id,
        status: TaskStatus.Complete,
        completedDate: new Date()
      }
    })

    try {
      const updatedTaskData = await updateTask({
        id: task.id,
        title: 'New Test Title',
        description: 'New Test Description',
        status: TaskStatus.InProgress
      })
      
      expect(updatedTaskData.completedDate).equals(null)

    } finally {
      prisma.task.delete({
        where: {
          id: requestingUser.id
        }
      })
    }
  })

  it ('Handles prisma Error', async () => {
    let error;
    try {
      await updateTask({
        id: 'lolThisIsntaRealID',
        title: 'New Test Title',
        description: 'New Test Description',
        status: TaskStatus.InProgress
      })

    } catch (e) {
      error = e
      console.error(e)

    } finally {
      prisma.task.delete({
        where: {
          id: requestingUser.id
        }
      })
    }
    expect(error).toHaveProperty('code', 'NOT_FOUND')
  })

  it ('Checks ownership', async () => {
    const otherUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: ['user'],
      }),
    })

    const task = await prisma.task.create({
      data: {
        title: faker.book.title(),
        userId: otherUser.id
      }
    })

    let error;
    try {
      await updateTask({
        id: task.id,
        title: 'New Test Title',
        description: 'New Test Description',
        status: TaskStatus.InProgress
      })
      
    } catch (e) {
      error = e
      console.error(e)

    } finally {
      prisma.task.delete({
        where: {
          id: requestingUser.id
        }
      })
    }
    expect(error).toHaveProperty('code', 'NOT_FOUND')
  })
});