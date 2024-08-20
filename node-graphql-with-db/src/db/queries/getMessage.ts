import { db } from "../db";
import type { MessageRecord } from "../schema";

export async function getMessage(args: {
  id: string;
}): Promise<MessageRecord | undefined> {
  return db.query.messageTable.findFirst({
    where: (cols, { eq }) => eq(cols.id, args.id),
  });
}
