'use client'

import React, { Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { ForgotPasswordReset } from "@/features/auth/components/forgot-password/forgot-password-reset"
import { ForgotPasswordSuccess } from "@/features/auth/components/forgot-password/forgot-password-success"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [isSuccess, setIsSuccess] = React.useState(false)

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-700">Invalid Link</h1>
        <p className="text-zinc-600">This password reset link is invalid or has expired.</p>
        <button 
          onClick={() => router.push('/login')}
          className="text-blue-700 font-bold hover:underline"
        >
          Go back to login
        </button>
      </div>
    )
  }

  if (isSuccess) {
    return <ForgotPasswordSuccess />
  }

  return (
    <ForgotPasswordReset 
      externalToken={token} 
      onSuccess={() => setIsSuccess(true)} 
    />
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-4 font-inter">
      <div className="relative flex h-[864px] w-[1234px] overflow-hidden rounded-[20px] bg-white shadow-xl">
        <div className="relative hidden w-1/2 h-full lg:block">
          <Image
            src="/signup_work.svg"
            alt="Resolve Home Support"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-end p-16">
            <div className="flex flex-col gap-6">
              <div className="h-1.5 w-16 bg-blue-700/20 rounded-full" />
              <h2 className="text-5xl font-bold font-heading leading-tight tracking-tight text-neutral-800">
                Reset your <br /> 
                credentials safely.
              </h2>
              <p className="text-lg text-zinc-600 max-w-sm leading-relaxed">
                Ensure your account stays protected with a strong, unique password.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full h-full lg:w-1/2">
          <div className="flex w-full h-full items-center justify-center py-10 px-8">
            <div className="flex h-full w-full max-w-[500px] flex-col overflow-y-auto rounded-[20px] bg-white p-8 scrollbar-hide">
              <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordContent />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
