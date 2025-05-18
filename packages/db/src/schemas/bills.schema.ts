import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { user } from './auth';
import { billInstance } from './bill-instances.schema';
import { budget } from './budgets.schema';
import { timestamps, userId } from './columns.helper';
import { party } from './parties.schema';
import { pot } from './pots.schema';

export const bill = t.pgTable(
  'bill',
  {
    id: t
      .bigint({ mode: 'number' })
      .generatedByDefaultAsIdentity()
      .primaryKey(),
    partyId: t.bigint({ mode: 'number' }).references(() => party.id),
    name: t.varchar({ length: 256 }).notNull(),
    amount: t.numeric({ mode: 'number' }).notNull(),
    startDate: t.timestamp().notNull(),
    endDate: t.timestamp(),
    daysBetween: t.smallint().notNull(),
    isActive: t.boolean().notNull().default(true),
    userId,
    ...timestamps,
  },
  (party) => [t.index().on(party.userId)],
);

export const billRelations = relations(bill, ({ one, many }) => ({
  owner: one(user, { fields: [bill.userId], references: [user.id] }),
  party: one(party, {
    fields: [bill.partyId],
    references: [party.id],
  }),
  instances: many(billInstance),
}));
