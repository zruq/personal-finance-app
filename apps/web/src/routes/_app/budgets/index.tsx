import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/budgets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/budgets/"!</div>
}
