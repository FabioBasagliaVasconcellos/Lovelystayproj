import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findUsersByLanguage(language: string) {
  try {
    if (!language) {
      console.error('Please, send us a language.');
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        languages: {
          contains: language,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
        languages: true,
      },
    });

    if (users.length > 0) {
      console.log(`Users found with ${language}:`, users);
    } else {
      console.log(`No users found with ${language}.`);
    }
  } catch (error) {
    console.error('Error while searching users language:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  const locationArg = process.argv[2];
  findUsersByLanguage(locationArg);
}
