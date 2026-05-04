export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar could go here */}
      <main className="flex-grow">{children}</main>
      {/* Footer could go here */}
    </div>
  )
}
