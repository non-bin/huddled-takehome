// import { Database } from "bun:sqlite"; // You can use this if you prefer Bun
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbDir = path.resolve('./database');
const dbFile = path.join(dbDir, 'main.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbFile);


export const handle = async ({ event, resolve }) => {
  event.locals.db = db;
  return resolve(event);
};
