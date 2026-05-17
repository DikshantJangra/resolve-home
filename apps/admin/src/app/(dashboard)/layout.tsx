'use client'

import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminNavbar } from "@/components/layout/admin-navbar"
import { useAuthSession } from "@/hooks/api-hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { LoadingSpinner } from "@resolve/ui"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isLoading, isError } = useAuthSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // If we've finished loading and there's no session, or if an error occurred (e.g., 401)
    if (!isLoading) {
      const handleLogout = () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_role')
        
        // Clean all possible cookies
        const cookiesToClear = ['auth_token', 'user_role', 'better-auth.session-token', '__Secure-better-auth.session-token']
        cookiesToClear.forEach(name => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        })
        
        window.location.href = '/login'
      }

      if (!session || isError) {
        // Check for any token that looks valid
        const rawToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        const hasToken = rawToken && rawToken !== 'undefined' && rawToken !== 'null' && rawToken.length > 10

        if (!hasToken) {
          console.log("[Dashboard] No session and no token found. Redirecting to login.")
          handleLogout()
          return
        }

        // If we HAVE a token but the session is missing after loading, the token is likely invalid/stale
        console.warn("[Dashboard] Session invalid or expired despite token existence. Clearing and redirecting.")
        handleLogout()
      } else if (session?.user && session.user.role !== 'admin') {
        // Security check: If they ARE logged in but are not an admin
        console.error("[Dashboard] Access denied: User is not an admin.", session.user.role)
        toast.error('Access denied. Admin privileges required.')
        handleLogout()
      } else {
        console.log("[Dashboard] Session verified for admin:", session?.user?.email)
      }
    }
  }, [session, isLoading, isError])

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-200 p-6 gap-6 animate-pulse shrink-0">
          <div className="h-10 w-36 bg-zinc-200 rounded-lg" />
          <div className="space-y-5 py-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 bg-zinc-200 rounded" />
                <div className="h-4 w-28 bg-zinc-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Area Skeleton */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Navbar Skeleton */}
          <div className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6 shrink-0 animate-pulse">
            <div className="h-6 w-32 bg-zinc-200 rounded" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-zinc-200 rounded-full" />
              <div className="h-4 w-20 bg-zinc-200 rounded" />
            </div>
          </div>
          {/* Main Viewport Skeleton */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 animate-pulse">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-zinc-200 rounded" />
              <div className="h-4 w-64 bg-zinc-200 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white border border-zinc-200 rounded-xl" />)}
            </div>
            <div className="h-96 bg-white border border-zinc-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting to avoid flickering "Authenticating..."
  if (!session || isError) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar - desktop sticky, mobile fixed */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-stone-50/30">
          {children}
        </main>
      </div>
    </div>
  )
}
