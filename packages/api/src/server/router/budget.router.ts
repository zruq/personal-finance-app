import { desc, eq, sql, and } from '@personal-finance-app/db';
import {
  budget,
  theme,
  transaction,
  party,
} from '@personal-finance-app/db/schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const budgetRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const data = await ctx.db
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
        spent: sql<number>`-1*COALESCE(SUM(${transaction.amount}), 0)::float`,
        latestSpending: sql<
          Array<{
            id: number;
            amount: number;
            date: Date;
            party?: {
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
        LEFT JOIN ${party} ON ${transaction.partyId} = ${party.id}
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
    return data.map((budget) => ({
      ...budget,
      spent: budget.spent === -0 ? 0 : budget.spent,
    }));
  }),
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.number().int().min(1).optional(),
        name: z.string(),
        maximumSpend: z.number(),
        themeId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { maximumSpend, name, themeId, id } = input;
      const result = await ctx.db
        .insert(budget)
        .values({
          id,
          maximumSpend,
          name,
          themeId,
          userId: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: budget.id,
          set: { maximumSpend, name, themeId },
          setWhere: eq(budget.userId, ctx.session.user.id),
        })
        .returning({
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
        });
      if (!result[0]) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return result[0];
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number().int().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(budget)
        .where(
          and(eq(budget.id, input.id), eq(budget.userId, ctx.session.user.id)),
        )
        .returning({
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
        });
      if (!result[0]) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return result[0];
    }),
});

export default budgetRouter;
