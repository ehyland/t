import dotenv from 'dotenv';
import { z } from 'zod';

const ENV = z.enum(['prod', 'dev', 'test']).parse(process.env.ENV);

dotenv.config({ path: 'resources/.env.local' });
dotenv.config({ path: `resources/.env.${ENV}` });
dotenv.config({ path: 'resources/.env' });

const env = z
  .object({
    PORT: z.coerce.number().default(4000),
    DATABASE_FILE_PATH: z.string(),
  })
  .parse(process.env);

export const config = {
  ...env,
  ENV,
  DATABASE_MIGRATIONS_FOLDER: 'migrations',
};
