import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export namespace DB {
  export type Message = InferSelectModel<typeof message>;
  export type ChannelSequence = InferSelectModel<typeof channelSequence>;
}

const baseFields = () => ({
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid()),
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// Messages table - stores all chat messages
export const message = sqliteTable(
  "message",
  {
    ...baseFields(),
    sequence: integer().notNull(),
    channel: text().notNull(),
    content: text().notNull(),
  },
  (table) => [
    unique("idx_unique_channel_sequence").on(table.channel, table.sequence),
  ],
);

// Channel sequence table - tracks the next available sequence number for each channel
export const channelSequence = sqliteTable("channel_sequences", {
  channel: text().primaryKey(),
  nextSequence: integer().notNull().default(1),
});
