import { Editor } from '@/components/dashboard/template-creation/template-creation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/template-creation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Editor />
}
