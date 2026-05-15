'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { apiClient, ENDPOINTS } from "@resolve/api"
import { useUserProfile } from '@/hooks/api-hooks'
import { AuthOtpVerification } from '@/features/auth/components/auth-otp-verification'
import { Skeleton } from "@resolve/ui"

export default function VerifyEmailPage() {
  const { data: userProfile, isPending } = useUserProfile()
  const router = useRouter()
  const [resendTriggered, setResendTriggered] = useState(false)

  // Auto-resend verification code on mount
  useEffect(() => {
    if (!isPending && userProfile?.user?.email && !resendTriggered) {
      const resendCode = async () => {
        try {
          await apiClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION_CODE)
          toast.success("Verification code sent to your email.")
          setResendTriggered(true)
        } catch (error) {
          toast.error("Failed to resend verification code.")
        }
      }
      resendCode()
    }
  }, [isPending, userProfile, resendTriggered])

  if (isPending || !userProfile?.user) {
    return <div className="flex h-screen items-center justify-center"><Skeleton className="h-64 w-96 rounded-2xl" /></div>
  }

  // If already verified, go to dashboard
  if (userProfile.user.emailVerified) {
    router.push('/dashboard')
    return null
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-4 font-inter">
      <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-xl p-8">
        <AuthOtpVerification 
          email={userProfile.user.email}
          context="signup"
          onVerifySuccess={() => {
            toast.success("Email verified successfully!")
            router.push("/dashboard")
          }}
        />
      </div>
    </main>
  )
}
