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
  bill,
  billInstance,
} from '@personal-finance-app/db/schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const billRouter = router({
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        partyId: z.number().optional(),
        name: z.string().trim().min(1).max(256),
        amount: z.number({ coerce: true }).positive(),
        startDate: z.date(),
        endDate: z.date().optional(),
        daysBetween: z.number().int().positive(),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          amount,
          id,
          daysBetween,
          name,
          partyId,
          startDate,
          endDate,
          isActive,
        },
      }) => {
        const userId = ctx.session.user.id;
        const data = await ctx.db
          .insert(bill)
          .values({
            id,
            name,
            partyId,
            startDate,
            endDate,
            daysBetween,
            amount,
            userId,
            isActive,
          })
          .onConflictDoUpdate({
            target: [bill.id],
            setWhere: eq(bill.userId, userId),
            set: {
              name,
              partyId,
              endDate,
              daysBetween,
              amount,
              isActive,
            },
          })
          .returning({
            id: bill.id,
            name: bill.name,
            startDate: bill.startDate,
            endDate: bill.endDate,
            daysBetween: bill.daysBetween,
            isActive: bill.isActive,
            party: sql<{
              id: number;
              name: string;
              avatar: string | null;
            }>`
      (
        SELECT JSON_BUILD_OBJECT(
          'id', ${party.id},
          'name', ${party.name},
          'avatar', ${party.avatar}
        )
        FROM ${party}
        WHERE ${party.id} = ${bill.partyId}
        LIMIT 1
      )`,
          });
        if (!data[0]) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Bill not found ',
          });
        }
        const ONE_DAY = 24 * 60 * 60 * 1_000;
        let instancesStartDate = startDate;
        if (id) {
          const lastBillInstance = await ctx.db.query.billInstance.findFirst({
            where: eq(billInstance.billId, id),
            orderBy: (billInstance, { desc }) => [desc(billInstance.date)],
            columns: {
              date: true,
            },
          });
          if (lastBillInstance) {
            instancesStartDate = new Date(
              lastBillInstance.date.getTime() + daysBetween * ONE_DAY,
            );
          }
        }
        const instancesEndDate = new Date();
        const newInstances: Array<{
          billId: number;
          date: Date;
          userId: string;
        }> = [];
        let currentDate = instancesStartDate;
        while (currentDate <= instancesEndDate) {
          newInstances.push({
            billId: data[0].id,
            date: currentDate,
            userId,
          });
          currentDate = new Date(currentDate.getTime() + daysBetween * ONE_DAY);
        }
        if (newInstances.length > 0) {
          await ctx.db.insert(billInstance).values(newInstances);
        }
        return data;
      },
    ),
  summary: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const data = await ctx.db
      .select({
        paid: {
          sum: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.billInstanceId} IS NOT NULL THEN ${bill.amount} ELSE 0 END), 0)::float`,
          count: sql<number>`COUNT(CASE WHEN ${transaction.billInstanceId} IS NOT NULL THEN 1 END)::int`,
        },
        unpaid: {
          sum: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.billInstanceId} IS NULL THEN ${bill.amount} ELSE 0 END), 0)::float`,
          count: sql<number>`COUNT(CASE WHEN ${transaction.billInstanceId} IS NULL THEN 1 END)::int`,
        },
        duesoon: {
          sum: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.billInstanceId} IS NULL AND ${billInstance.date} < ${sql.raw('CURRENT_DATE')} THEN ${bill.amount} ELSE 0 END), 0)::float`,
          count: sql<number>`COUNT(CASE WHEN ${transaction.billInstanceId} IS NULL AND ${billInstance.date} < ${sql.raw('CURRENT_DATE')}  THEN 1 END)::int`,
        },
      })
      .from(transaction)
      .rightJoin(billInstance, eq(transaction.billInstanceId, billInstance.id))
      .rightJoin(bill, eq(billInstance.billId, bill.id))
      .where(eq(billInstance.userId, userId));
    return {
      paid: {
        sum: data[0]?.paid?.sum ?? 0,
        count: data[0]?.paid?.count ?? 0,
      },
      unpaid: {
        sum: data[0]?.unpaid?.sum ?? 0,
        count: data[0]?.unpaid?.count ?? 0,
      },
      duesoon: {
        sum: data[0]?.duesoon?.sum ?? 0,
        count: data[0]?.duesoon?.count ?? 0,
      },
    };
  }),
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db
      .selectDistinctOn([bill.id], {
        name: bill.name,
        amount: bill.amount,
        isActive: bill.isActive,
        date: billInstance.date,
        daysBetween: bill.daysBetween,
        instancesCount: sql<number>`(count(${billInstance.id}) over (partition by ${bill.id}))::float`,
        paidInstancesCount: sql<number>`(count(${transaction.id}) over (partition by ${bill.id}))::float`,
        party: {
          id: party.id,
          name: party.name,
          avatar: party.avatar,
        },
      })
      .from(bill)
      .leftJoin(party, eq(bill.partyId, party.id))
      .innerJoin(billInstance, eq(billInstance.billId, bill.id))
      .leftJoin(transaction, eq(transaction.billInstanceId, billInstance.id))
      .where(eq(bill.userId, userId))
      .orderBy(bill.id, desc(billInstance.id));
  }),
});

export default billRouter;
