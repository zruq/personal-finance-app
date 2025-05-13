import { desc, eq, sql, and } from '@personal-finance-app/db';
import { protectedProcedure, router } from '../trpc';
import {
  budget,
  theme,
  transaction,
  party,
} from '@personal-finance-app/db/schema';

const budgetRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db
      .select({
        id: budget.id,
        name: budget.name,
        maximumSpend: budget.maximumSpend,
        theme: sql<{
          id: number;
          name: string;
          color: string;
        }>`
      (
        SELECT JSON_BUILD_OBJECT(
          'id', ${theme.id},
          'name', ${theme.name},
          'color', ${theme.color}
        )
        FROM ${theme}
        WHERE ${theme.id} = ${budget.themeId}
        LIMIT 1
      )`,
        spent: sql<number>`COALESCE(SUM(${transaction.amount}), 0)::float`,
        latestSpending: sql<
          Array<{
            id: number;
            amount: number;
            date: Date;
            party: {
              id: number;
              name: string;
              avatar: string | null;
            };
          }>
        >`
      (
        SELECT COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${transaction.id},
              'amount', ${transaction.amount},
              'date', ${transaction.createdAt},
              'party', JSON_BUILD_OBJECT(
                'id', ${party.id},
                'name', ${party.name},
                'avatar', ${party.avatar}
              )
            )
            ORDER BY ${transaction.createdAt} DESC
          ),
          '[]'::JSON
        )
        FROM ${transaction} 
        JOIN ${party} ON ${transaction.partyId} = ${party.id}
        WHERE ${transaction.budgetId} = ${budget.id}
        AND ${transaction.userId} = ${budget.userId}
        LIMIT 3
      )
    `,
      })
      .from(budget)
      .innerJoin(theme, eq(budget.themeId, theme.id))
      .leftJoin(
        transaction,
        and(
          eq(transaction.budgetId, budget.id),
          eq(transaction.userId, userId),
        ),
      )
      .where(eq(budget.userId, userId))
      .groupBy(budget.id)
      .orderBy(desc(budget.createdAt));
  }),
});

export default budgetRouter;
