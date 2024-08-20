import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { config } from "~/config";
import * as schema from "./schema";

const betterSqlite = new Database(config.DATABASE_FILE_PATH);
export const db = drizzle(betterSqlite, { logger: false, schema: schema });
