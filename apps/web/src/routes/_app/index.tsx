import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-1 ">
      <div className="text-preset-4">hello world</div>
    </div>
  );
}
