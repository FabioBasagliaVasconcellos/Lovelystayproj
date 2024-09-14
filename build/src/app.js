"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const githubUserFetcher_1 = require("./services/githubUserFetcher");
async function main() {
    const username = process.argv[2]; // Pega o username a partir do argumento na linha de comando
    if (!username) {
        console.error('Please, send users GitHub name as an argument.');
        return;
    }
    const user = await (0, githubUserFetcher_1.fetchGithubUser)(username);
    if (user) {
        await (0, githubUserFetcher_1.saveUserToDB)({
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
