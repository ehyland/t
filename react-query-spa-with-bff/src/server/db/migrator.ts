import * as drizzleMigrator from 'drizzle-orm/libsql/migrator';
import { config } from '~/s/config';
import { db } from './db';

export async function runMigration() {
  await drizzleMigrator.migrate(db, {
    migrationsFolder: config.DATABASE_MIGRATIONS_FOLDER,
  });
}
