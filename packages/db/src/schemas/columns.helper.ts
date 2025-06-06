import * as t from 'drizzle-orm/pg-core';
import { user } from './auth';
import { theme as themeTable } from './themes.schema';

export const timestamps = {
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
};

export const userId = t
  .text()
  .references(() => user.id)
  .notNull();

export const themeId = t
  .integer()
  .references(() => themeTable.id)
  .notNull();
