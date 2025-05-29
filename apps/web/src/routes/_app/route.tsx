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
      <div className="w-screen h-screen flex items-center justify-center bg-grey-900">
        <img src="/logo.svg" className="w-40" />
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex h-dvh w-dvw flex-col overflow-x-hidden xl:flex-row-reverse">
      <div className="h-full flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
        <main className="max-w-[Math.min(1140px,100dvw)] overflow-x-hidden mx-auto">
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  );
}
