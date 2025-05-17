import * as t from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps, userId, themeId } from './columns.helper';
import { relations } from 'drizzle-orm';
import { user } from './auth';
import { theme } from './themes.schema';
import { transaction } from './transactions.schema';

export const budget = t.pgTable(
  'budget',
  {
    id: t
      .bigint({ mode: 'number' })
      .generatedByDefaultAsIdentity()
      .primaryKey(),
    name: t.varchar({ length: 256 }).notNull(),
    maximumSpend: t.numeric({ mode: 'number' }).notNull(),
    userId,
    themeId,
    ...timestamps,
  },
  (budget) => [t.unique().on(budget.userId, budget.name)],
);

export const budgetRelations = relations(budget, ({ one, many }) => ({
  owner: one(user, { fields: [budget.userId], references: [user.id] }),
  theme: one(theme, { fields: [budget.themeId], references: [theme.id] }),
  transactions: many(transaction),
}));
