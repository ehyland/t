import dotenv from "dotenv";
import { z } from "zod";

const ENV = z.enum(["production", "dev", "test"]).parse(process.env.ENV);

dotenv.config({
  path: `resources/.env.${ENV}`,
});

dotenv.config({
  path: "resources/.env.default",
});

const configFromEnvironment = z
  .object({
    PORT: z.coerce.number(),
    DATABASE_FILE_PATH: z.string(),
  })
  .parse(process.env);

export const config = { ENV, ...configFromEnvironment };
