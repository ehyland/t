import type { Config } from 'drizzle-kit';
import { config } from './src/server/config';

export default {
  schema: './src/server/db/tables.ts',
  out: config.DATABASE_MIGRATIONS_FOLDER,
  dialect: 'sqlite',
  dbCredentials: { url: config.DATABASE_FILE_PATH },
} satisfies Config;
