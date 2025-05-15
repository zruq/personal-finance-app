import { authClient } from '@/clients/authClient';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Sidebar } from './-components/sidebar';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.user) {
      throw redirect({ to: '/login' });
    }
  },
});

function AppLayout() {
  return (
    <main className="flex h-dvh w-dvw flex-col overflow-x-hidden xl:flex-row-reverse">
      <div className="h-full flex-1 overflow-y-auto px-4 py-6">
        <Outlet />
      </div>
      <Sidebar />
    </main>
  );
}
