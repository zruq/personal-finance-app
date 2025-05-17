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

const transactionRouter = router({
  upsert: protectedProcedure
    .input(
      z
        .object({
          id: z.number().optional(),
          amount: z.number(),
          date: z.date(),
          category: z.string(),
          budgetId: z.number().optional(),
          description: z.string().optional(),
          partyId: z.number().optional(),
        })
        .refine(
          ({ budgetId, amount }) => budgetId === undefined || amount < 0,
          {
            message: 'The amount of a transaction with budget must be negative',
          },
        ),
    )
    .mutation(
      async ({
        ctx,
        input: { id, amount, category, date, partyId, description, budgetId },
      }) => {
        const result = await ctx.db
          .insert(transaction)
          .values({
            id,
            amount,
            category,
            date,
            userId: ctx.session.user.id,
            budgetId,
            description,
            partyId,
          })
          .onConflictDoUpdate({
            set: {
              amount,
              category,
              date,
              budgetId,
              description,
              partyId,
            },
            target: transaction.id,
            setWhere: eq(transaction.userId, ctx.session.user.id),
          })
          .returning({ id: transaction.id });
        if (!result[0]) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
        return result[0];
      },
    ),
});

export default transactionRouter;
