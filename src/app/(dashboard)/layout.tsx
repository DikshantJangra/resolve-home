export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar could go here */}
      <div className="flex-1 flex flex-col">
        {/* Header could go here */}
        <main className="p-6 flex-grow">{children}</main>
      </div>
    </div>
  )
}
