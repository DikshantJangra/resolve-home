import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
