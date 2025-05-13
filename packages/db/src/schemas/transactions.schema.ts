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
    id: t.bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
    amount: t.numeric({ mode: 'number' }).notNull(),
    type: transactionType().notNull().default('other'),
    partyId: t
      .bigint({ mode: 'number' })
      .references(() => party.id)
      .notNull(),
    budgetId: t.integer().references(() => budget.id),
    potId: t.integer().references(() => pot.id),
    userId,
    ...timestamps,
  },
  (party) => [
    t.index().on(party.userId),
    t.check(
      'type_check',
      sql`(type = 'budget' AND budget_id is not null AND pot_id is null) OR (type = 'pot' AND pot_id is not null AND budget_id is null) OR (type NOT IN ('budget', 'pot') AND budget_id is null AND pot_id is null)`,
    ),
  ],
);

export const CreateTransactionSchema = createInsertSchema(transaction)
  .omit({ createdAt: true, userId: true, updatedAt: true })
  .extend({});
