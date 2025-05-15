import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/pots/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/pots/"!</div>
}
