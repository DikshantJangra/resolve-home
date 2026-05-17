'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useVerifyDeposit } from '@/hooks/api-hooks'
import { LoadingSpinner } from '@resolve/ui'

function VerifyDepositContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get('reference') || searchParams.get('trxref') || ''

  const { data, isLoading, isError } = useVerifyDeposit(reference)

  React.useEffect(() => {
    if (!reference) {
      router.replace('/wallet')
      return
    }
    if (data || isError) {
      // Pass result to wallet page via query param so it can show toast
      const status = data?.success ? 'success' : 'failed'
      router.replace(`/wallet?reference=${reference}&status=${status}`)
    }
  }, [data, isError, reference, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <LoadingSpinner className="w-10 h-10 text-blue-700" />
      <p className="text-zinc-600 text-sm font-medium">Verifying your payment...</p>
      <p className="text-zinc-400 text-xs">Please wait, do not close this page.</p>
    </div>
  )
}

export default function VerifyDepositPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner className="w-10 h-10 text-blue-700" />
      </div>
    }>
      <VerifyDepositContent />
    </Suspense>
  )
}
