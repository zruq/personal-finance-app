import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { budget } from './budgets.schema';
import { timestamps, userId } from './columns.helper';
import { party } from './parties.schema';
import { pot } from './pots.schema';

export const transactionType = t.pgEnum('transaction_type', [
  'budget',
  'pot',
  'other',
]);

export const transaction = t.pgTable(
  'transaction',
  {
    id: t
      .bigint({ mode: 'number' })
      .generatedByDefaultAsIdentity()
      .primaryKey(),
    category: t.varchar({ length: 128 }).notNull(),
    description: t.varchar(),
    date: t.timestamp().notNull(),
    amount: t.numeric({ mode: 'number' }).notNull(),
    type: transactionType()
      .notNull()
      .generatedAlwaysAs(
        () => sql` CASE 
    WHEN budget_id IS NOT NULL THEN 'budget'::transaction_type
    WHEN pot_id IS NOT NULL THEN 'pot'::transaction_type
    ELSE 'other'::transaction_type
  END`,
      ),
    partyId: t.bigint({ mode: 'number' }).references(() => party.id),
    budgetId: t.integer().references(() => budget.id, { onDelete: 'set null' }),
    potId: t.integer().references(() => pot.id, { onDelete: 'cascade' }),
    userId,
    ...timestamps,
  },
  (party) => [
    t.index().on(party.userId),
    t.check(
      'type_check',
      sql`(budget_id IS NOT NULL AND pot_id IS NULL) OR
  (pot_id IS NOT NULL AND budget_id IS NULL) OR
  (budget_id IS NULL AND pot_id IS NULL)`,
    ),
  ],
);

export const CreateTransactionSchema = createInsertSchema(transaction)
  .omit({ createdAt: true, userId: true, updatedAt: true })
  .extend({});
