export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-50">
      {/* Admin Sidebar could go here */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header could go here */}
        <main className="p-6 flex-grow">{children}</main>
      </div>
    </div>
  )
}
