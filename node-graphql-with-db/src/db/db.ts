import { drizzle } from "drizzle-orm/libsql";
import { config } from "~/config";
import * as schema from "./schema";

export const drizzleDb = drizzle(config.DATABASE_FILE_PATH, { schema });
export const db = Object.assign(drizzleDb, { schema });
