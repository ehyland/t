import type { Config } from "drizzle-kit";
import { config } from "./src/server/config";
import { DATABASE_MIGRATIONS_FOLDER } from "./src/server/constants";

export default {
  schema: "./src/server/db/schema.ts",
  out: DATABASE_MIGRATIONS_FOLDER,
  dialect: "sqlite",
  dbCredentials: { url: config.DATABASE_FILE_PATH },
} satisfies Config;
