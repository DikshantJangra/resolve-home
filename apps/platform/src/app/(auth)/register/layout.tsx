import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create an Account | Resolve Home",
  description: "Join Resolve Home today and book professional home services in seconds.",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
