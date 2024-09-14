"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGithubUser = fetchGithubUser;
exports.saveUserToDB = saveUserToDB;
const axios_1 = __importDefault(require("axios"));
const pg_promise_1 = __importDefault(require("pg-promise"));
// Configurações do banco de dados
const pgp = (0, pg_promise_1.default)();
const db = pgp('postgresql://docker:docker@localhost:5432/lovelystay');
// Função para buscar usuário do GitHub
async function fetchGithubUser(username) {
    try {
        const repositories = [];
        const languages = [];
        const { data } = await axios_1.default.get(`https://api.github.com/users/${username}`);
        const { data: repositoriesData } = await axios_1.default.get(data.repos_url);
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
        }; // Retorna os dados do usuário
    }
    catch (error) {
        console.error('Error while searching GitHub User.', error);
    }
}
// Função para salvar dados no banco
async function saveUserToDB(user) {
    try {
        await db.none('INSERT INTO github_users(name, location, followers, repositories, languages) VALUES($1, $2, $3, $4, $5)', [
            user.name,
            user.location,
            user.followers,
            user.repositories,
            user.languages,
        ]);
        console.log('User data saved!');
    }
    catch (error) {
        console.error('Error saving data into database.', error);
    }
}
