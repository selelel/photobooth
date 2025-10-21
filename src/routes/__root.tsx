import { Toaster } from '@/components/ui/sonner'
import { useCamera } from '@/lib/useCamera'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => {
  const { requestPermission } = useCamera()
  
  useEffect(() => {
    requestPermission()
  }, [requestPermission])

  return (
  <>
    {/* <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <hr /> */}
    <Outlet />
    <Toaster />
    {/* <TanStackRouterDevtools /> */}
  </>
)}

export const Route = createRootRoute({ component: RootLayout })