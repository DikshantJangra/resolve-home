"use client"

import * as React from "react"
import Image from "next/image"
import { useForgotPasswordStore } from "@/store/use-forgot-password-store"
import { ForgotPasswordEmail } from "@/features/auth/components/forgot-password/forgot-password-email"
import { ForgotPasswordOtp } from "@/features/auth/components/forgot-password/forgot-password-otp"
import { ForgotPasswordReset } from "@/features/auth/components/forgot-password/forgot-password-reset"
import { ForgotPasswordSuccess } from "@/features/auth/components/forgot-password/forgot-password-success"

export default function ForgotPasswordPage() {
  const { step } = useForgotPasswordStore()

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ForgotPasswordEmail />
      case 2:
        return <ForgotPasswordOtp />
      case 3:
        return <ForgotPasswordReset />
      case 4:
        return <ForgotPasswordSuccess />
      default:
        return <ForgotPasswordEmail />
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-4 font-inter">
      {/* Main Container */}
      <div className="relative flex h-[864px] w-[1234px] overflow-hidden rounded-[20px] bg-white shadow-xl">
        
        {/* Left Side: Image/Banner (Consistent with login/register) */}
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
          <div className="flex w-full h-full items-center justify-center py-10 px-8">
            <div className="flex h-full w-full max-w-[500px] flex-col overflow-y-auto rounded-[20px] bg-white p-8 scrollbar-hide">
              {renderStep()}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
