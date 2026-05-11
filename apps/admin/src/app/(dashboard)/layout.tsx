'use client'

import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminNavbar } from "@/components/layout/admin-navbar"
import { useAuthSession } from "@/hooks/api-hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isLoading } = useAuthSession()
  const router = useRouter()

  useEffect(() => {
    // Force redirect if stuck in loading/no-session state for more than 5 seconds
    const timeout = setTimeout(() => {
      if (!session) {
        console.log("Auth timeout reached. Clearing state and redirecting...")
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }, 5000)

    if (!isLoading && !session) {
      router.replace('/login')
    }

    return () => clearTimeout(timeout)
  }, [session, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p className="text-zinc-500 font-inter animate-pulse">Authenticating...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
