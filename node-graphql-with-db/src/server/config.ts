import { z } from "zod";

const ENV = z.enum(["production", "dev", "test"]).parse(process.env.ENV);

const s = {
  string: (value: string) => z.string().default(value),
  flag: (value: boolean) =>
    z
      .union([
        z.literal("0"),
        z.literal("1"),
        z.literal(true),
        z.literal(false),
      ])
      .default(value)
      .transform((value) => value === true || value === "1"),
};

export const DEFAULT_INTROSPECTION_ACCESS_KEY =
  "f2e50bb30d0da87facc5cbe809bf53b1";

const envDefaults: Record<typeof ENV, Partial<typeof envConfig>> = {
  test: {
    DATABASE_FILE_PATH: "file::memory:?cache=shared",
  },
  dev: {
    PORT: 4000,
    DATABASE_FILE_PATH: "file:local.db",
  },
  production: {
    ENABLE_GRAPHIQL: false,
    GRAPHQL_INTROSPECTION_ACCESS_KEY: DEFAULT_INTROSPECTION_ACCESS_KEY,
  },
};

const envConfig = z
  .object({
    PORT: z.coerce.number(),
    DATABASE_FILE_PATH: s.string("file:local.db"),
    ENABLE_GRAPHIQL: s.flag(true),
    GRAPHQL_INTROSPECTION_ACCESS_KEY: s.string(""),
  })
  .parse({ ...envDefaults[ENV], ...process.env });

export const config = { ENV, ...envConfig };
