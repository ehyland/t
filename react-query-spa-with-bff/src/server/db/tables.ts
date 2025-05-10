import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ulid } from 'ulid';

export namespace DB {
  export type Account = typeof account.$inferSelect;
  export type Password = typeof password.$inferSelect;
  export type OneTimeCode = typeof oneTimeCode.$inferSelect;
}

const baseFields = () => ({
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => ulid()),
  createdAt: int({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const account = sqliteTable('account', {
  ...baseFields(),
  email: text().notNull().unique(),
  emailVerified: int({ mode: 'boolean' }).notNull().default(false),
});

export const accountRelations = relations(account, ({ one }) => ({
  password: one(password),
}));

export const oneTimeCode = sqliteTable('oneTimeCode', {
  ...baseFields(),
  code: text().notNull(),
  used: int({ mode: 'boolean' }).notNull().default(false),
  purpose: text({ enum: ['email_verification'] }).notNull(),
  idAccount: text()
    .notNull()
    .unique()
    .references(() => account.id),
});

export const oneTimeCodeRelations = relations(oneTimeCode, ({ one }) => ({
  account: one(account, {
    fields: [oneTimeCode.idAccount],
    references: [account.id],
  }),
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
