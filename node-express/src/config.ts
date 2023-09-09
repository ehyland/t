import z from "zod";
import dotenv from "dotenv";

const ENV = z
  .enum(["production", "development", "test"])
  .parse(process.env.ENV);

// load from env files
dotenv.config({ path: `resources/.env.${ENV}.local` });
dotenv.config({ path: `resources/.env.local` });
dotenv.config({ path: `resources/.env.${ENV}` });
dotenv.config({ path: `resources/.env.defaults` });

const fromEnv = z
  .object({
    PORT: z.coerce.number(),
  })
  .parse(process.env);

/**
 * App configuration
 */
export const config = {
  ...fromEnv,
  ENV,
  IS_TEST: ENV === "test",
};
