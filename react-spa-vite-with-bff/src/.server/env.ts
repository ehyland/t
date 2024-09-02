import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export const env = z
  .object({
    PORT: z.coerce.number().default(4000),
  })
  .parse(process.env);
