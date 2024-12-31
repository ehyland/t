import * as drizzleMigrator from "drizzle-orm/libsql/migrator";
import { DATABASE_MIGRATIONS_FOLDER } from "~/constants";
import { db } from "./db";

export async function runMigration() {
  await drizzleMigrator.migrate(db, {
    migrationsFolder: DATABASE_MIGRATIONS_FOLDER,
  });
}
