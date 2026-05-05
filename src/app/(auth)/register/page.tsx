"use client"

import * as React from "react"
import Image from "next/image"
import { RegisterForm } from "@/features/auth/components/register-form"
import { RoleSelection } from "@/features/auth/components/role-selection"
import { useRegisterStore } from "@/store/use-register-store"

export default function RegisterPage() {
  const { step } = useRegisterStore()

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-4 font-inter">
      {/* Main Container */}
      <div className="relative flex h-[864px] w-[1234px] overflow-hidden rounded-[20px] bg-white shadow-xl">
        
        {/* Left Side: Image/Banner */}
        <div className="relative hidden w-1/2 h-full lg:block">
          <Image
            src="/signup_work.svg"
            alt="Professional home services"
            fill
            className="object-cover"
            priority
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-16">
            <div className="flex flex-col gap-6">
              <div className="h-1.5 w-16 bg-blue-700 rounded-full" />
              <h2 className="text-5xl font-bold font-heading leading-tight tracking-tight text-white">
                Quality home <br /> 
                care, simplified.
              </h2>
              <p className="text-lg text-zinc-300 max-w-sm leading-relaxed">
                Connect with verified experts for all your home maintenance and repair needs in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="flex w-full h-full lg:w-1/2">
          {/* Internal Padding Wrapper matching Figma py-16 px-8 */}
          <div className="flex w-full h-full items-center justify-center py-10 px-8">
            {/* White Form Card matching Figma bg-white rounded-[20px] */}
            <div className="flex h-full w-full max-w-[500px] flex-col overflow-y-auto rounded-[20px] bg-white p-8 scrollbar-hide">
              {step === 1 ? <RoleSelection /> : <RegisterForm />}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
