import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "data.db");
const db = new Database(dbPath, { verbose: console.log });

const createTableQuery = `
CREATE TABLE IF NOT EXISTS book ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL, 
    author TEXT NOT NULL, 
    description TEXT 
);`;

db.exec(createTableQuery);
export default db;
