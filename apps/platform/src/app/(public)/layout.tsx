import { Navbar } from "@/features/landing/components/navbar";
import { Footer } from "@/features/landing/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-grow pt-[72px]">{children}</main>
      <Footer />
    </div>
  )
}
