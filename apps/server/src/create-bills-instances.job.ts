import { eq, and, gt, or, sql, isNull, desc } from '@personal-finance-app/db';
import { bill, billInstance } from '@personal-finance-app/db/schema';
import * as cron from 'node-cron';
import { db } from '.';

cron.schedule('0 0 * * *', async () => {
  const lastBillInstanceDateSubQuery = db
    .selectDistinctOn([billInstance.billId], {
      billId: billInstance.billId,
      date: billInstance.date,
    })
    .from(billInstance)
    .orderBy(desc(billInstance.billId), desc(billInstance.date))
    .as('last_bill_instance_date');
  const bills = await db
    .select({
      billId: bill.id,
      userId: bill.userId,
    })
    .from(bill)
    .leftJoin(
      lastBillInstanceDateSubQuery,
      eq(bill.id, lastBillInstanceDateSubQuery.billId),
    )
    .where(
      and(
        eq(bill.isActive, true),
        or(isNull(bill.endDate), gt(bill.endDate, new Date())),
        sql`(now()::date - ${bill.startDate}::date) % ${bill.daysBetween} = 0`,
        sql`${lastBillInstanceDateSubQuery.date} is null or ${lastBillInstanceDateSubQuery.date}::date != now()::date`,
      ),
    );
  if (bills.length > 0) {
    await db
      .insert(billInstance)
      .values(bills.map((bill) => ({ ...bill, date: new Date() })));
  }
});
