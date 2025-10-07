import { db } from "../db";
import type { DB } from "../schema";

export async function getMessage(args: {
  id: string;
}): Promise<DB.Message | undefined> {
  return db.query.message.findFirst({
    where: (cols, { eq }) => eq(cols.id, args.id),
  });
}
