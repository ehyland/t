import { Table, is, sql } from "drizzle-orm";
import { beforeEach } from "vitest";
import { db } from "~/db/db";
import { runMigration } from "~/db/migrator";
import * as schema from "~/db/schema";

export async function resetDB() {
  db.run(sql.raw("PRAGMA foreign_keys=OFF"));

  for (const table of Object.values(schema)) {
    if (is(table, Table)) {
      await db.delete(table);
    }
  }

  db.run(sql.raw("PRAGMA foreign_keys=ON"));
}

export function installDB() {
  beforeEach(async () => {
    await runMigration();
    await resetDB();
  });
}
