import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

const baseFields = () => ({
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid()),
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type MessageRecord = InferSelectModel<typeof messageTable>;
export type NewMessageRecord = InferInsertModel<typeof messageTable>;
export const messageTable = sqliteTable("message", {
  ...baseFields(),
  content: text().notNull(),
  sequence: integer().notNull(),
});

export type SequenceRecord = InferSelectModel<typeof sequenceTable>;
export type NewSequenceRecord = InferInsertModel<typeof sequenceTable>;
export const sequenceTable = sqliteTable("sequence", {
  ...baseFields(),
  partitionKey: text().notNull(),
  lastUsedSequence: integer().notNull(),
});
