import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findUsers() {
  try {
    const users = await prisma.user.findMany();

    console.log('Users found:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findUsers();
