"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useForgotPasswordStore } from "@/store/use-forgot-password-store"
import { cn } from "@/lib/utils"

export function ForgotPasswordOtp() {
  const { email, nextStep, prevStep } = useForgotPasswordStore()
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
  const [timer, setTimer] = React.useState(59)
  
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single character
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const isComplete = otp.every((digit) => digit !== "")

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-tight text-neutral-700">
          Verify your email
        </h1>
        <p className="text-base font-normal font-inter leading-6 text-zinc-600">
          We sent a 6-digit code to <span className="font-bold">{email || "tobiwasiu@gmail.com"}</span>. Enter it below to confirm your account.
        </p>
      </div>

      <div className="flex justify-between gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-12 w-12 rounded-xl border border-stone-300 bg-white text-center text-sm font-semibold text-neutral-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-5">
        <Button
          onClick={nextStep}
          disabled={!isComplete}
          className={cn(
            "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white transition-all hover:bg-blue-800",
            !isComplete && "opacity-40"
          )}
        >
          Verify & continue
        </Button>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-zinc-600 text-sm font-medium font-inter leading-5">
            Didn’t receive code? <span className="text-blue-700 font-bold">0:{timer < 10 ? `0${timer}` : timer}</span>
          </p>
          <button 
            type="button"
            onClick={prevStep}
            className="text-zinc-600 text-sm font-medium font-inter underline leading-5 hover:text-zinc-900 transition-colors"
          >
            Change email
          </button>
        </div>
      </div>

      <p className="text-center text-xs font-normal font-inter leading-4 text-zinc-600 mt-auto">
        By continuing you agree to our <span className="underline cursor-pointer">Terms & Privacy Policy</span>.
      </p>
    </div>
  )
}
