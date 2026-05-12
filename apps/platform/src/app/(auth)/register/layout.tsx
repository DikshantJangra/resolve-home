import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create an Account | ResolvHome",
  description: "Join ResolvHome today and book professional home services in seconds.",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
