import MarketingPage from '@/components/index/marketing-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <MarketingPage />
  )
}