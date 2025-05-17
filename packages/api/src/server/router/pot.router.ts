import { desc, eq, sql, and } from '@personal-finance-app/db';
import { pot, theme, transaction } from '@personal-finance-app/db/schema';
import { protectedProcedure, router } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const potRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db
      .select({
        id: pot.id,
        name: pot.name,
        target: pot.target,
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
        WHERE ${theme.id} = ${pot.themeId}
        LIMIT 1
      )`,
        totalSaved: sql<number>`-1*COALESCE(SUM(${transaction.amount}), 0)::float`,
      })
      .from(pot)
      .innerJoin(theme, eq(pot.themeId, theme.id))
      .leftJoin(
        transaction,
        and(eq(transaction.potId, pot.id), eq(transaction.userId, userId)),
      )
      .where(eq(pot.userId, userId))
      .groupBy(pot.id)
      .orderBy(desc(pot.createdAt));
  }),
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.number().int().min(1).optional(),
        name: z.string(),
        target: z.number(),
        themeId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { target, name, themeId, id } = input;
      const result = await ctx.db
        .insert(pot)
        .values({
          id,
          target,
          name,
          themeId,
          userId: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: pot.id,
          set: { target, name, themeId },
          setWhere: eq(pot.userId, ctx.session.user.id),
        })
        .returning({
          id: pot.id,
          name: pot.name,
          target: pot.target,
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
        WHERE ${theme.id} = ${pot.themeId}
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
        .delete(pot)
        .where(and(eq(pot.id, input.id), eq(pot.userId, ctx.session.user.id)))
        .returning({
          id: pot.id,
          name: pot.name,
          target: pot.target,
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
        WHERE ${theme.id} = ${pot.themeId}
        LIMIT 1
      )`,
        });

      if (!result[0]) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return result[0];
    }),
  addTo: protectedProcedure
    .input(z.object({ potId: z.number(), amount: z.number() }))
    .mutation(async ({ ctx, input: { amount, potId } }) => {
      if (amount === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please enter a valid amount',
        });
      }
      const targetPot = await ctx.db.query.pot.findFirst({
        where: and(eq(pot.id, potId), eq(pot.userId, ctx.session.user.id)),
        columns: {
          name: true,
        },
      });
      if (!targetPot) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      if (amount > 0) {
        const data = await ctx.db
          .select({
            balance: sql<number>`COALESCE(SUM(${transaction.amount}), 0)::float`,
          })
          .from(transaction)
          .where(eq(transaction.userId, ctx.session.user.id));
        if (!data[0]) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
        const balance = data[0].balance;
        if (balance < amount) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Your balance is ${balance}, you can't save ${amount}`,
          });
        }
      }
      if (amount < 0) {
        const data = await ctx.db
          .select({
            totalSaved: sql<number>`COALESCE(SUM(${transaction.amount}), 0)::float`,
          })
          .from(transaction)
          .where(eq(transaction.potId, potId));
        if (!data[0]) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
        const { totalSaved } = data[0];
        if (Math.abs(totalSaved) < Math.abs(amount)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `The maximum amount you can withdraw from pot ${targetPot.name} is ${totalSaved}`,
          });
        }
      }
      await ctx.db.insert(transaction).values({
        potId,
        amount: -1 * amount,
        userId: ctx.session.user.id,
        date: new Date(),
        category: `${targetPot.name} (${amount > 0 ? 'Savings' : 'Withdraws'})`,
      });
    }),
});

export default potRouter;
