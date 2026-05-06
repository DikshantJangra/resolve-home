'use client'

import dynamic from 'next/dynamic'

const BookingWizard = dynamic(
  () => import('@/features/booking/components/booking-wizard').then((mod) => mod.BookingWizard),
  { ssr: false }
)

export default function BookServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <BookingWizard />
    </div>
  )
}
