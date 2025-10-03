import { db } from "../db";
import type { MessageRecord } from "../schema";

export async function getMessages(args: {
  fromSequenceNumber: number;
}): Promise<MessageRecord[]> {
  return db.query.messageTable.findMany({
    where: (cols, { gte }) => gte(cols.sequence, args.fromSequenceNumber),
  });
}
