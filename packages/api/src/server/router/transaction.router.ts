import {
  desc,
  eq,
  sql,
  and,
  SQL,
  asc,
  or,
  ilike,
  isNull,
} from '@personal-finance-app/db';
import {
  budget,
  theme,
  transaction,
  party,
} from '@personal-finance-app/db/schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const sortByValues = [
  'latest',
  'oldest',
  'atoz',
  'ztoa',
  'highest',
  'lowest',
] as const;

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
  many: protectedProcedure
    .input(
      z.object({
        page: z.number({ coerce: true }).int().min(1).default(1),
        sortBy: z.enum(sortByValues).default('latest'),
        category: z.string().optional(),
        search: z.string().optional(),
        pageSize: z.number().int().min(1).max(100).default(10),
      }),
    )
    .query(
      async ({ ctx, input: { page, sortBy, category, search, pageSize } }) => {
        const userId = ctx.session.user.id;
        const orderBy = (() => {
          switch (sortBy) {
            case 'latest':
              return desc(transaction.date);
            case 'oldest':
              return asc(transaction.date);
            case 'atoz':
              return asc(transaction.category);
            case 'ztoa':
              return desc(transaction.category);
            case 'highest':
              return sql`abs(${transaction.amount}) desc`;
            case 'lowest':
              return sql`abs(${transaction.amount}) asc`;
          }
        })();

        const result = await ctx.db
          .select({
            id: transaction.id,
            category: transaction.category,
            amount: transaction.amount,
            date: transaction.date,
            party: {
              id: party.id,
              name: party.name,
              avatar: party.avatar,
            },
            totalCount: sql<number>`count(*) over()`,
          })
          .from(transaction)
          .leftJoin(party, eq(transaction.partyId, party.id))
          .where(
            and(
              eq(transaction.userId, userId),
              search
                ? or(
                    ilike(transaction.category, `%${search}%`),
                    ilike(party.name, `%${search}%`),
                  )
                : sql`true`,
              category ? eq(transaction.category, category) : sql`true`,
            ),
          )
          .limit(pageSize)
          .offset(pageSize * (page - 1))
          .orderBy(orderBy);
        const totalCount = result[0]?.totalCount ?? 0;
        const transactions = result.map(({ totalCount, ...rest }) => rest);
        return {
          transactions,
          meta: {
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: page,
            pageSize,
          },
        };
      },
    ),
  categories: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db
      .selectDistinct({
        name: transaction.category,
      })
      .from(transaction)
      .where(eq(transaction.userId, userId));
  }),
  balance: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const data = await ctx.db
      .select({
        balance: sql<number>`sum(amount)::float`,
        income: sql<number>`sum(case when amount > 0 then amount else 0 end)::float`,
        expenses: sql<number>`sum(case when amount < 0 then amount else 0 end)::float`,
      })
      .from(transaction)
      .where(eq(transaction.userId, userId));
    return {
      balance: data?.[0]?.balance ?? 0,
      income: data?.[0]?.income ?? 0,
      expenses: -1 * (data?.[0]?.expenses ?? -0),
    };
  }),
});

export default transactionRouter;
