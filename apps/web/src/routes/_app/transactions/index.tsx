import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/transactions/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/transactions/"!</div>;
}
