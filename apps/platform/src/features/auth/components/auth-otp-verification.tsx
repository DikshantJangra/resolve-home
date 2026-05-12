"use client"

import * as React from "react"
import { Button } from "@resolve/ui"
import { cn } from "@resolve/ui"
import { toast } from "sonner"
import { apiClient, ENDPOINTS } from "@resolve/api"
import { useRouter } from "next/navigation"
// Removed unused imports: useSession, authClient

interface AuthOtpVerificationProps {
  email: string
  onVerifySuccess?: (token: string) => void
  onBack?: () => void
  context?: 'signup' | 'login' | 'forgot-password'
}

export function AuthOtpVerification({ 
  email, 
  onVerifySuccess, 
  onBack,
  context = 'signup' 
}: AuthOtpVerificationProps) {
  const router = useRouter()
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
  const [timer, setTimer] = React.useState(59)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isResending, setIsResending] = React.useState(false)
  
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleVerify = async () => {
    const code = otp.join("")
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    try {
      if (context === 'forgot-password') {
        onVerifySuccess?.(code)
      } else {
        const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { email, code })
        const result = response.data

        if (result && result.success) {
          toast.success("Email verified successfully!")
          if (onVerifySuccess) {
            onVerifySuccess(code)
          } else {
            router.push("/dashboard")
          }
        } else {
          toast.error(result?.error || "Verification failed")
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message || "Verification failed"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (timer > 0) return

    setIsResending(true)
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION_CODE)
      const result = response.data

      if (result && result.success) {
        toast.success("Verification code resent!")
        setTimer(59)
      } else {
        toast.error(result?.error || "Failed to resend code")
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to resend code"
      toast.error(message)
    } finally {
      setIsResending(false)
    }
  }

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return
    
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("")
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newOtp = [...otp]
      pastedData.forEach((char, i) => {
        if (i < 6) newOtp[i] = char
      })
      setOtp(newOtp)
      // Focus the last filled input or the first empty one
      const lastIndex = Math.min(pastedData.length, 5)
      inputRefs.current[lastIndex]?.focus()
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
          We sent a 6-digit code to <span className="font-bold">{email}</span>. Enter it below to confirm your account.
        </p>
      </div>

      <div className="flex justify-between gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="h-10 w-10 sm:h-12 sm:w-12 flex-1 min-w-0 max-w-[56px] rounded-xl border border-stone-300 bg-white text-center text-sm font-semibold text-neutral-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-5">
        <Button
          onClick={handleVerify}
          disabled={!isComplete || isLoading}
          className={cn(
            "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white transition-all hover:bg-blue-800",
            (!isComplete || isLoading) && "opacity-40"
          )}
        >
          {isLoading ? "Verifying..." : "Verify & continue"}
        </Button>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-zinc-600 text-sm font-medium font-inter leading-5">
            Didn’t receive code? {timer > 0 ? (
              <span className="text-blue-700 font-bold">0:{timer < 10 ? `0${timer}` : timer}</span>
            ) : (
              <button 
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-700 font-bold hover:underline"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            )}
          </p>
          {onBack && (
            <button 
              type="button"
              onClick={onBack}
              className="text-zinc-600 text-sm font-medium font-inter underline leading-5 hover:text-zinc-900 transition-colors"
            >
              Go back
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-xs font-normal font-inter leading-4 text-zinc-600 mt-auto">
        By continuing you agree to our <span className="underline cursor-pointer">Terms & Privacy Policy</span>.
      </p>
    </div>
  )
}
