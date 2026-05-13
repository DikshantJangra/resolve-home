'use client'

import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminNavbar } from "@/components/layout/admin-navbar"
import { useAuthSession } from "@/hooks/api-hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
      </div>
    )
  }

  // Show nothing while redirecting to avoid flickering "Authenticating..."
  if (!session || isError) {
    return null
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
