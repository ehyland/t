import { eq } from "drizzle-orm";
import { db } from "../db";
import { type MessageRecord, messageTable, sequenceTable } from "../schema";

export async function saveMessage(args: {
  content: string;
}): Promise<MessageRecord> {
  const partitionKey = "message";
  return db.transaction(async (tx) => {
    const sequence = await tx.query.sequenceTable.findFirst({
      where: (cols, { eq }) => eq(cols.partitionKey, partitionKey),
    });

    const lastUsedSequence = sequence?.lastUsedSequence ?? 0;
    const newSequence = lastUsedSequence + 1;

    const [record] = await tx
      .insert(messageTable)
      .values({ sequence: newSequence, content: args.content })
      .returning();

    // TODO: figure out how to make an atomic update, this is not it
    if (lastUsedSequence === 0) {
      await tx
        .insert(sequenceTable)
        .values({ lastUsedSequence: newSequence, partitionKey });
    } else {
      await tx
        .update(sequenceTable)
        .set({ lastUsedSequence: newSequence })
        .where(eq(sequenceTable.partitionKey, partitionKey));
    }

    return record;
  });
}
