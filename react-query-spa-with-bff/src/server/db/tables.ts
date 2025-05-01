import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ulid } from 'ulid';

export namespace DB {
  export type Account = typeof account.$inferSelect;
  export type Password = typeof password.$inferSelect;
}

const baseFields = () => ({
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid()),
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
});

// TODO: Add email verification
export const account = sqliteTable('account', {
  ...baseFields(),
  email: text().notNull().unique(),
});

export const accountRelations = relations(account, ({ one }) => ({
  password: one(password),
}));

export const password = sqliteTable('password', {
  ...baseFields(),
  salt: text().notNull(),
  hash: text().notNull(),
  idAccount: text()
    .notNull()
    .unique()
    .references(() => account.id),
});

export const passwordRelations = relations(password, ({ one }) => ({
  account: one(account, {
    fields: [password.idAccount],
    references: [account.id],
  }),
}));
