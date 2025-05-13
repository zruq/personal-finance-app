import { pgTable } from 'drizzle-orm/pg-core';

export const theme = pgTable('theme', (t) => ({
  id: t.integer().generatedAlwaysAsIdentity().primaryKey(),
  name: t.varchar({ length: 256 }).notNull(),
  color: t.varchar({ length: 16 }).notNull(),
}));
