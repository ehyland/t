import { sql } from "drizzle-orm";
import { db, t } from "../db";

export async function saveMessage(opts: { channel: string; content: string }) {
  return db.transaction(async (tx) => {
    const [{ nextSequence }] = await tx
      .insert(t.channelSequence)
      .values({ channel: opts.channel, nextSequence: 1 })
      .onConflictDoUpdate({
        target: t.channelSequence.channel,
        set: { nextSequence: sql`${t.channelSequence.nextSequence} + 1` },
      })
      .returning({ nextSequence: t.channelSequence.nextSequence });

    const [message] = await tx
      .insert(t.message)
      .values({
        channel: opts.channel,
        content: opts.content,
        sequence: nextSequence,
      })
      .returning();

    return message;
  });
}
