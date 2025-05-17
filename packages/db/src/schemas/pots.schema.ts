import * as t from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps, themeId, userId } from './columns.helper';

export const pot = t.pgTable(
  'pot',
  {
    id: t
      .bigint({ mode: 'number' })
      .generatedByDefaultAsIdentity()
      .primaryKey(),
    name: t.varchar({ length: 256 }).notNull(),
    target: t.numeric({ mode: 'number' }).notNull(),
    userId,
    themeId,
    ...timestamps,
  },
  (pot) => [t.unique().on(pot.userId, pot.name)],
);
