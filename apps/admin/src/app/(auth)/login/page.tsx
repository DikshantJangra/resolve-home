'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button, Input, Checkbox, Label, cn } from "@resolve/ui"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import Cookies from 'js-cookie'
import { useAuthSession } from "@/hooks/api-hooks"
import { Suspense } from 'react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { data: session } = useAuthSession()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Redirect if already logged in
  React.useEffect(() => {
    if (session?.user) {
      if (session.user.role === 'admin') {
        router.push(callbackUrl)
      } else {
        toast.error('Access denied. Admin privileges required.')
      }
    }
  }, [session, router, callbackUrl])

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
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (response.error) {
        toast.error(response.error.message || 'Invalid credentials')
        return
      }

      // Handle various response structures for better-auth and custom wrappers
      const responseData = response.data as any
      const authData = responseData?.data || responseData
      
      const token = authData?.token || 
                    authData?.session?.token || 
                    authData?.session?.sessionToken

      const user = authData?.user
      const role = user?.role

      // Security: Strictly enforce admin role for this application
      if (role && role !== 'admin') {
        toast.error('Access denied. You do not have admin privileges.')
        return
      }

      if (token && typeof token === 'string' && token !== 'undefined' && token !== 'null') {
        // Set in localStorage for apiClient
        localStorage.setItem('auth_token', token)
        
        // Set in cookies for middleware (expires in 7 days or less if rememberMe is false)
        const expires = data.rememberMe ? 7 : 1
        Cookies.set('auth_token', token, { expires, path: '/' })
        
        if (role) {
          localStorage.setItem('user_role', role)
          Cookies.set('user_role', role, { expires, path: '/' })
        }
      }

      toast.success('Welcome back, Admin')
      
      // Force a full reload to the dashboard to ensure all states (middleware, query cache) are fresh
      window.location.href = callbackUrl
    } catch (error) {
      console.error('Login error:', error)
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
          <img 
            src="/logo.svg" 
            alt="ResolvHome" 
            className="h-16 w-auto object-contain"
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
                  placeholder="e.g samwood@resolve.com"
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
