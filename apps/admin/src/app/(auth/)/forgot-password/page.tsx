'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button, Input, Label, cn } from "@resolve/ui"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HiOutlineArrowLeft } from 'react-icons/hi'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      const { error } = await authClient.forgetPassword({
        email: data.email,
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
      })

      if (error) {
        toast.error(error.message || 'Failed to send reset link')
        return
      }

      setIsSubmitted(true)
      toast.success('Password reset link sent to your email')
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-stone-50 py-12 px-4 font-inter">
      <div className="w-full max-w-[489px] flex flex-col gap-8 items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <Image 
            src="/resolve_home.svg" 
            alt="Resolv Home" 
            width={120} 
            height={40} 
            className="h-10 w-auto"
            priority
          />
        </div>

        {isSubmitted ? (
          <div className="w-full p-8 md:p-10 bg-white rounded-[20px] flex flex-col gap-8 shadow-sm border border-zinc-100 items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-neutral-700 text-2xl font-bold font-heading">Check your email</h1>
              <p className="text-zinc-600 text-base font-normal leading-relaxed">
                We've sent a password reset link to your email address. Please follow the instructions to regain access.
              </p>
            </div>
            <Link href="/login" className="w-full">
              <Button className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-700/10 flex items-center justify-center">
                <span className="leading-none">Return to Login</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="w-full p-8 md:p-10 bg-white rounded-[20px] flex flex-col gap-10 shadow-sm border border-zinc-100">
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-zinc-500 hover:text-blue-700 transition-colors text-sm font-medium w-fit"
              >
                <HiOutlineArrowLeft size={18} />
                <span>Go back</span>
              </button>
              
              <div className="flex flex-col gap-2 text-center lg:text-left">
                <h1 className="text-neutral-700 text-2xl font-bold font-heading leading-8">
                  Forgot Password
                </h1>
                <p className="text-zinc-600 text-base font-normal leading-6">
                  Don't worry, enter your admin email and we'll send you a link to reset your password.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              <div className="flex flex-col gap-1.5">
                <Label className="text-zinc-600 text-sm font-medium">Email Address</Label>
                <Input 
                  {...register('email')}
                  type="email"
                  placeholder="e.g samwood@resolv.com"
                  className={cn(
                    "h-12 bg-white border-zinc-300 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-300 focus-visible:ring-blue-700",
                    errors.email && "border-red-500 ring-1 ring-red-500"
                  )}
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-700/10 flex items-center justify-center py-0"
              >
                <span className="leading-none">{isLoading ? 'Sending link...' : 'Send Reset Link'}</span>
              </Button>

              <div className="text-center">
                <span className="text-zinc-600 text-sm font-medium">Remembered your password?</span>
                <Link href="/login" className="text-blue-700 text-sm font-bold ml-1 hover:underline transition-all">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
