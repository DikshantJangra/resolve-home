'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button, Input, Checkbox, Label, cn } from "@resolve/ui"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HiEye, HiEyeOff } from 'react-icons/hi'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const { data: authData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message || 'Invalid credentials')
        return
      }

      const token = (authData as any)?.token
      if (token) {
        localStorage.setItem('auth_token', token)
      }

      toast.success('Welcome back, Admin')
      router.push('/')
      router.refresh()
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

        <div className="w-full p-8 md:p-10 bg-white rounded-[20px] flex flex-col gap-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
          <div className="flex flex-col gap-2">
            <h1 className="text-neutral-700 text-2xl font-bold font-heading leading-8 text-center">
              Admin Sign In
            </h1>
            <p className="text-zinc-600 text-base font-normal leading-6 text-center">
              Enter secure credentials to access the Resolv platform command center.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
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

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-zinc-600 text-sm font-medium">Password</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-blue-700 text-xs font-semibold hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    {...register('password')}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "h-12 bg-white border-zinc-300 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-300 focus-visible:ring-blue-700 pr-11",
                      errors.password && "border-red-500 ring-1 ring-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="rememberMe" {...register('rememberMe')} />
                <Label htmlFor="rememberMe" className="text-zinc-600 text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-700/10 flex items-center justify-center py-0"
              >
                <span className="leading-none">{isLoading ? 'Signing in...' : 'Sign In'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
