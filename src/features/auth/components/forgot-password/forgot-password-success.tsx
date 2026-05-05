"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HiCheck } from "react-icons/hi2"
import { Button } from "@/components/ui/button"

export function ForgotPasswordSuccess() {
  const router = useRouter()

  return (
    <div className="flex w-full flex-col items-center justify-center gap-14 py-8">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Success Icon Container */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700/10">
            <HiCheck className="h-7 w-7 text-blue-700 stroke-[2px]" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold font-heading leading-8 text-neutral-700">
            Password Reset Successful
          </h2>
          <p className="text-base font-normal font-inter leading-6 text-zinc-600 max-w-[320px]">
            You have successfully reset your password, kindly proceed to login
          </p>
        </div>
      </div>

      <Button
        onClick={() => router.push("/login")}
        className="h-12 w-full max-w-[384px] rounded-xl bg-blue-700 text-sm font-medium text-white hover:bg-blue-800"
      >
        Login into your account
      </Button>
    </div>
  )
}
