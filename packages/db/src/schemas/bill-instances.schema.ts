import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { user } from './auth';
import { bill } from './bills.schema';
import { budget } from './budgets.schema';
import { timestamps, userId } from './columns.helper';
import { party } from './parties.schema';
import { pot } from './pots.schema';
import { transaction } from './transactions.schema';

export const billInstance = t.pgTable(
  'bill_instance',
  {
    id: t
      .bigint({ mode: 'number' })
      .generatedByDefaultAsIdentity()
      .primaryKey(),
    billId: t
      .bigint({ mode: 'number' })
      .references(() => bill.id)
      .notNull(),
    date: t.timestamp().notNull(),
    userId,
    ...timestamps,
  },
  (party) => [t.index().on(party.userId)],
);

export const billInstanceRelations = relations(billInstance, ({ one }) => ({
  owner: one(user, { fields: [billInstance.userId], references: [user.id] }),
  bill: one(bill, {
    fields: [billInstance.billId],
    references: [bill.id],
  }),
  transaction: one(transaction),
}));
