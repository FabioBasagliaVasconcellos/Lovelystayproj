import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findUsersByLocation(location: string) {
  try {
    if (!location) {
      console.error('Please send us a location.');
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        location: {
          contains: location,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
        location: true,
      },
    });

    if (users.length > 0) {
      console.log(`Users found in ${location}:`, users);
    } else {
      console.log(`No users found in ${location}.`);
    }
  } catch (error) {
    console.error('Error while searching users for location:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  const locationArg = process.argv[2];
  findUsersByLocation(locationArg);
}
