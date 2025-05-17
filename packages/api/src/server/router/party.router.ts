import { party, theme } from '@personal-finance-app/db/schema';
import { internalProcedure, protectedProcedure, router } from '../trpc';
import { eq } from '@personal-finance-app/db';

const partyRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: party.id, name: party.name, avatar: party.avatar })
      .from(party)
      .where(eq(party.userId, ctx.session.user.id));
  }),
});

export default partyRouter;
