import z from "zod";

const env = z
  .object({
    ENV: z.enum(["prod", "dev", "test"]),
    PORT: z.coerce.number(),
  })
  .parse(process.env);

export const config = {
  ...env,
  IS_TEST: env.ENV === "test",
};
