"use client"

import * as React from "react"
import Image from "next/image"
import { ForgotPasswordEmail } from "@/features/auth/components/forgot-password/forgot-password-email"

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-0 sm:p-4 font-inter">
      <div className="relative flex w-full max-w-[1234px] min-h-screen sm:min-h-0 sm:h-auto lg:h-[864px] overflow-hidden sm:rounded-[20px] bg-white sm:shadow-xl">

        {/* Left Side: Image/Banner */}
        <div className="relative hidden w-1/2 h-full lg:block">
          <Image
            src="/signup_work.svg"
            alt="ResolvHome Support"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-16">
            <div className="flex flex-col gap-6">
              <div className="h-1.5 w-16 bg-blue-700/20 rounded-full" />
              <h2 className="text-5xl font-bold font-heading leading-tight tracking-tight text-neutral-800">
                Secure your <br />
                account access.
              </h2>
              <p className="text-lg text-zinc-600 max-w-sm leading-relaxed">
                Follow the steps to safely reset your password and get back to managing your home services.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Flow Container */}
        <div className="flex w-full h-full lg:w-1/2">
          <div className="flex w-full h-full items-center justify-center py-8 px-4 sm:py-10 sm:px-8">
            <div className="flex h-full w-full max-w-[500px] flex-col overflow-y-auto rounded-[20px] bg-white p-4 sm:p-6 lg:p-8 scrollbar-hide">
              <ForgotPasswordEmail />
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
