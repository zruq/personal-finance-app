import * as t from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps, userId, themeId } from './columns.helper';

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

export const CreateBudgetSchema = createInsertSchema(budget)
  .omit({ createdAt: true, userId: true, updatedAt: true })
  .extend({
    name: z.string().max(256),
    maximumSpend: z.number().min(0),
  });
