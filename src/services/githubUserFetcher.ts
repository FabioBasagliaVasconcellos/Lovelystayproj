import axios from 'axios';
import pgPromise from 'pg-promise';
import { v4 as uuidv4 } from 'uuid';

const pgp = pgPromise();
const db = pgp('postgresql://docker:docker@localhost:5432/lovelystay');

type UserRepositories = {
  name: string;
  url: string;
  description: string;
  language: string[];
};

type UserCreateDto = {
  id?: string;
  name: string;
  location: string;
  followers: number;
  repositories: UserRepositories[];
  languages: string[];
};

async function fetchGithubUser(username: string) {
  try {
    const repositories: UserRepositories[] = [];
    const languages: string[] = [];
    const { data } = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const { data: repositoriesData } = await axios.get(data.repos_url);

    if (repositoriesData) {
      for (const repository of repositoriesData) {
        repositories.push({
          name: repository.full_name,
          url: repository.html_url,
          description: repository.description,
          language: repository.language,
        });

        if (repository.language && !languages.includes(repository.language)) {
          languages.push(repository.language);
        }
      }
    }

    return {
      name: data.name,
      location: data.location,
      followers: data.followers,
      repositories,
      languages,
    };
  } catch (error) {
    console.error('Error while searching GitHub User.', error);
  }
}

async function saveUserToDB(user: UserCreateDto) {
  try {
    user.id = uuidv4();
    await db.none(
      'INSERT INTO users(id, name, location, followers, repositories, languages) VALUES($1, $2, $3, $4, $5, $6)',
      [
        user.id,
        user.name,
        user.location,
        user.followers,
        user.repositories,
        user.languages,
      ]
    );
    console.log('User data saved!');
  } catch (error) {
    console.error('Error saving data into database.', error);
  }
}

export { fetchGithubUser, saveUserToDB };
