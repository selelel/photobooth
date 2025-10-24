import DashboardPage from '@/components/dashboard/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/template-creation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardPage />
}
