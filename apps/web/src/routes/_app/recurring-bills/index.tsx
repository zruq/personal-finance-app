import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/recurring-bills/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/recurring-bills/"!</div>
}
