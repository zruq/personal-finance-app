import { Spinner } from '@personal-finance-app/ui/components/spinner';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { Sidebar } from './-components/sidebar';
import { authClient } from '@/clients/authClient';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-red-500">
        <Spinner />
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/" />;
  }
  return (
    <main className="flex h-dvh w-dvw flex-col overflow-x-hidden xl:flex-row-reverse">
      <div className="h-full flex-1 overflow-y-auto px-4 py-6">
        <Outlet />
      </div>
      <Sidebar />
    </main>
  );
}
