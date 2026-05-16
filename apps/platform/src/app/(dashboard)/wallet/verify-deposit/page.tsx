'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useVerifyDeposit } from '@/hooks/api-hooks'
import { Suspense } from 'react'

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
      <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-600 text-sm font-medium">Verifying your payment...</p>
      <p className="text-zinc-400 text-xs">Please wait, do not close this page.</p>
    </div>
  )
}

export default function VerifyDepositPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyDepositContent />
    </Suspense>
  )
}
