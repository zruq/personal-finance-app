import { authClient } from '@/clients/authClient';
import { Card } from '@personal-finance-app/ui/components/card';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_unauthenticated')({
  component: UnauthenticatedLayout,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data?.user) {
      throw redirect({ to: '/' });
    }
  },
});

function UnauthenticatedLayout() {
  return (
    <main className="grid h-dvh grid-rows-[auto_1fr] xl:flex xl:p-5">
      <div className="bg-grey-900 rounded-b-2 py-8 xl:hidden">
        <img
          src="/logo.svg"
          alt="finance"
          className="mx-auto h-[21.76px] w-[121.45px]"
        />
      </div>
      <div className="bg-grey-900 rounded-xl relative hidden w-[560px] overflow-hidden xl:block">
        <img
          src="/logo.svg"
          alt="finance"
          className="absolute top-10 left-10 h-[21.76px] w-[121.45px]"
        />
        <img
          src="/auth-illustration.svg"
          alt="Cartoon figure managing their money and finances"
          className="h-[75%] w-full object-fill"
        />
        <div className="absolute bottom-10 left-11">
          <h2 className="text-preset-1 pb-6 text-white">
            Keep track of your money <br /> and save for your future
          </h2>
          <p className="text-preset-4 text-white">
            Personal finance app puts you in control of your spending. Track
            <br />
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 xl:flex-1">
        <Card className="sm:w-[560px] md:p-8">
          <Outlet />
        </Card>
      </div>
    </main>
  );
}
