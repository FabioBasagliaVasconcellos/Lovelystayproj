import { fetchGithubUser, saveUserToDB } from './services/githubUserFetcher';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// prisma.user.create({
//   data: {
//     name: 'Fabio Vasconcellos',
//     location: 'Braga, Portugal',
//     followers: 2,
//     repositories: 'https://api.github.com/users/thiagovasconcellos/repos',
//     languages: 'Typescript',
//   },
// });

async function main() {
  const username = process.argv[2]; // Pega o username a partir do argumento na linha de comando
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

// Chama a função principal
main();
