import { z } from "zod";

export const idSchema = z.union([
  z.number().transform((n) => `${n}`),
  z.string(),
]);
