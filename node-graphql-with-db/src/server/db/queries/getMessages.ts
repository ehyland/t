import { db } from "../db";
import type { DB } from "../schema";

export async function getMessages(args: {
  fromSequenceNumber: number;
  channel: string;
}): Promise<DB.Message[]> {
  return db.query.message.findMany({
    where: (cols, { gte }) => gte(cols.sequence, args.fromSequenceNumber),
  });
}
