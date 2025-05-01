import { Table, is, sql } from 'drizzle-orm';
import { beforeEach } from 'vitest';
import { db } from '~/s/db/db';
import { runMigration } from '~/s/db/migrator';
import * as tables from '~/s/db/tables';

export async function resetDB() {
  await db.run(sql.raw('PRAGMA foreign_keys=OFF'));

  for (const table of Object.values(tables)) {
    if (is(table, Table)) {
      await db.delete(table);
    }
  }

  await db.run(sql.raw('PRAGMA foreign_keys=ON'));
}

export function installDB() {
  beforeEach(async () => {
    await runMigration();
    await resetDB();
  });
}
