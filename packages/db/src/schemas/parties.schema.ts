import * as t from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps, userId } from './columns.helper';

export const party = t.pgTable(
  'party',
  {
    id: t.bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
    name: t.varchar({ length: 256 }).notNull(),
    avatar: t.varchar({ length: 2083 }),
    userId,
    ...timestamps,
  },
  (party) => [t.unique().on(party.userId, party.name)],
);

export const CreatePartySchema = createInsertSchema(party)
  .omit({ createdAt: true, userId: true, updatedAt: true })
  .extend({
    name: z.string().max(256),
    avatar: z.string().url().max(2083),
  });
