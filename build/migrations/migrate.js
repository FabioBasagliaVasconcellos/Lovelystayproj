"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const fs_1 = require("fs");
const path_1 = require("path");
async function runMigration() {
    const migrationPath = (0, path_1.join)(__dirname, 'migrations', '001_create_table_users.sql');
    const migrationSQL = (0, fs_1.readFileSync)(migrationPath, 'utf8');
    try {
        await db_1.default.none(migrationSQL);
        console.log('Migration ran successfully.');
    }
    catch (error) {
        console.error('Error running migration:', error);
    }
    finally {
        db_1.default.$pool.end(); // Fechar conexão com o banco
    }
}
runMigration();
