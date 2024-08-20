import * as drizzleMigrator from "drizzle-orm/better-sqlite3/migrator";
import { DATABASE_MIGRATIONS_FOLDER } from "~/constants";
import { db } from "./db";

export function runMigration() {
  drizzleMigrator.migrate(db, {
    migrationsFolder: DATABASE_MIGRATIONS_FOLDER,
  });
}
