import { fetchGithubUser, saveUserToDB } from './services/githubUserFetcher';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error('Please, send users GitHub name as an argument.');
    return;
  }

  const user = await fetchGithubUser(username);
  if (user) {
    await saveUserToDB({
      name: user.name,
      location: user.location,
      followers: user.followers,
      languages: user.languages,
      repositories: user.repositories,
    });
  }
}

main();
