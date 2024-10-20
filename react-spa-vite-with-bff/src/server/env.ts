import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export const env = z
  .object({
    ENV: z.enum(['prod', 'dev', 'test']).default('prod'),
    PORT: z.coerce.number().default(4000),
  })
  .parse(process.env);
