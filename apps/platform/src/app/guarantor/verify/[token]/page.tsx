'use client'

import React from 'react'
import { apiClient, ENDPOINTS } from '@resolve/api'
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineUser, HiOutlineMail, HiOutlineBriefcase } from 'react-icons/hi'

interface VerifyResult {
  success: boolean
  engineer?: {
    name?: string
    fullName?: string
    email?: string
    primarySpecialty?: string
    category?: string
  }
  guarantor?: {
    name?: string
    email?: string
  }
  message?: string
}

export default function GuarantorVerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = React.use(params)
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')
  const [result, setResult] = React.useState<VerifyResult | null>(null)
  const [errorMessage, setErrorMessage] = React.useState('')

  React.useEffect(() => {
    if (!token) return

    apiClient.get(ENDPOINTS.GUARANTOR.VERIFY(token))
      .then((res) => {
        setResult(res.data?.data || res.data || {})
        setStatus('success')
      })
      .catch((err: any) => {
        setErrorMessage(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Verification failed.')
        setStatus('error')
      })
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-medium">Verifying your identity...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <HiOutlineXCircle className="w-9 h-9 text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-neutral-700">Verification Failed</h1>
            <p className="text-zinc-500 text-sm">{errorMessage}</p>
          </div>
          <p className="text-xs text-zinc-400">
            If you believe this is an error, please contact the engineer who sent you this link.
          </p>
        </div>
      </div>
    )
  }

  const engineer = result?.engineer
  const engineerName = engineer?.fullName || engineer?.name
  const specialty = engineer?.primarySpecialty || engineer?.category

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <HiOutlineCheckCircle className="w-9 h-9 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-neutral-700">Verification Successful</h1>
          <p className="text-zinc-500 text-sm">
            {result?.message || 'You have successfully verified as a guarantor.'}
          </p>
        </div>

        {engineerName && (
          <div className="w-full bg-zinc-50 rounded-xl border border-zinc-100 p-5 space-y-3 text-left">
            <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Engineer Details</p>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <HiOutlineUser className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Full Name</p>
                <p className="text-sm font-semibold text-neutral-700">{engineerName}</p>
              </div>
            </div>

            {engineer?.email && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <HiOutlineMail className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Email</p>
                  <p className="text-sm font-semibold text-neutral-700">{engineer.email}</p>
                </div>
              </div>
            )}

            {specialty && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <HiOutlineBriefcase className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Specialty</p>
                  <p className="text-sm font-semibold text-neutral-700">{specialty}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-zinc-400 leading-relaxed">
          Your verification has been recorded. The engineer's application will now proceed to the next stage of review.
        </p>
      </div>
    </div>
  )
}
