import { theme } from '@personal-finance-app/db/schema';
import { internalProcedure, protectedProcedure, router } from '../trpc';

const themeRouter = router({
  seed: internalProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .insert(theme)
      .values([
        { name: 'green', color: '#277C78' },
        { name: 'yellow', color: '#F2CDAC' },
        { name: 'cyan', color: '#82C9D7' },
        { name: 'navy', color: '#626070' },
        { name: 'red', color: '#C94736' },
        { name: 'purple', color: '#826CB0' },
        { name: 'light purple', color: '#AF81BA' },
        { name: 'turquoise', color: '#597C7C' },
        { name: 'brown', color: '#93674F' },
        { name: 'magenta', color: '#934F6F' },
        { name: 'blue', color: '#3F82B2' },
        { name: 'blue', color: '#3F82B2' },
        { name: 'navy grey', color: '#97A0AC' },
        { name: 'army grey', color: '#7F9161' },
        { name: 'gold', color: '#CAB361' },
        { name: 'orange', color: '#BE6C49' },
      ])
      .onConflictDoUpdate({ target: theme.id, set: { color: theme.color } });
    return 'done';
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: theme.id, name: theme.name, color: theme.color })
      .from(theme);
  }),
});

export default themeRouter;
