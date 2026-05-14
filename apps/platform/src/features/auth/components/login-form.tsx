"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FcGoogle } from "react-icons/fc"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { IoArrowBack } from "react-icons/io5"
import { ENDPOINTS } from "@resolve/api"
import { apiClient } from "@resolve/api"
import { authClient } from "@/lib/auth-client"
import Cookies from "js-cookie"
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { Label } from "@resolve/ui"
import { cn } from "@resolve/ui"
import { toast } from "sonner"
import { useAuthSession } from "@/hooks/api-hooks"
import { AuthOtpVerification } from "./auth-otp-verification"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const { data: session } = useAuthSession()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showVerification, setShowVerification] = React.useState(false)
  const [loginEmail, setLoginEmail] = React.useState("")

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Redirect if already logged in
  React.useEffect(() => {
    if (session?.user) {
      const planId = searchParams.get("plan")
      if (planId) {
        router.push(`/subscriptions?plan=${planId}`)
      } else {
        router.push(callbackUrl)
      }
    }
  }, [session, router, callbackUrl])

  async function onSubmit(data: LoginValues) {
    setIsLoading(true)
    setLoginEmail(data.email)
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.SIGN_IN_EMAIL, {
        email: data.email,
        password: data.password,
      })

      // Extract the full signed session cookie from the Set-Cookie response header
      const setCookieHeader = response.headers['set-cookie']
      let fullSessionCookie: string | null = null
      if (Array.isArray(setCookieHeader)) {
        const match = setCookieHeader.find(c => c.includes('better-auth.session_token'))
        if (match) fullSessionCookie = match.split(';')[0].split('=').slice(1).join('=')
      }

      const body = response.data
      const token = body?.token || body?.data?.token
      const role = body?.user?.role || body?.data?.user?.role

      if (!token) {
        toast.error("Login failed. Please try again.")
        return
      }

      const sessionValue = fullSessionCookie || token
      localStorage.setItem('auth_token', sessionValue)
      Cookies.set('auth_token', sessionValue, { expires: 7, path: '/' })

      if (role) {
        localStorage.setItem('user_role', role)
        Cookies.set('user_role', role, { expires: 7, path: '/' })
      }

      toast.success("Welcome back!")
      router.push(callbackUrl)
    } catch (error: any) {
      const status = error?.response?.status
      const message = error?.response?.data?.error || error?.response?.data?.message

      if (status === 403 || message?.toLowerCase().includes('verify')) {
        // Save the token if provided in the error response to allow verification
        const token = error?.response?.data?.data?.token || error?.response?.data?.token
        if (token) {
          localStorage.setItem("auth_token", token)
        }
        
        setLoginEmail(form.getValues("email"))
        setShowVerification(true)
        toast.error(message || "Please verify your email first.")
      } else {
        toast.error(message || "Invalid credentials")
      }
    } finally {
      setIsLoading(false)
    }
  }


  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        disableRedirect: true,
      })

      if (error) {
        toast.error(error.message || "Failed to initiate Google sign-in")
        return
      }

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  if (showVerification) {
    return (
      <AuthOtpVerification 
        email={loginEmail}
        context="login"
        onVerifySuccess={() => {
          setShowVerification(false)
          toast.success("Email verified! You can now sign in.")
        }}
        onBack={() => setShowVerification(false)}
      />
    )
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-tight text-neutral-700">
          Welcome back
        </h1>
        <p className="w-full max-w-[384px] text-base font-normal font-inter leading-6 text-zinc-600">
          Sign in to manage your bookings and pick up right where you had left
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-600 font-inter">
              Email address
            </Label>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Enter your email"
              className={cn(
                "h-12 border-zinc-300 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-300 focus-visible:ring-blue-700",
                form.formState.errors.email && "border-red-500 ring-1 ring-red-500"
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-600 font-inter">
              Password
            </Label>
            <div className="relative">
              <Input
                {...form.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter desired password"
                className={cn(
                  "h-12 border-zinc-300 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-300 focus-visible:ring-blue-700 pr-11",
                  form.formState.errors.password && "border-red-500 ring-1 ring-red-500"
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
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-zinc-600 text-xs font-normal font-inter leading-4 hover:text-zinc-900 transition-colors"
              >
                Forget Password?
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white transition-all hover:bg-blue-800",
              isLoading && "opacity-40"
            )}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>


          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-zinc-100" />
            <span className="text-zinc-300 text-xs font-normal font-inter">or</span>
            <div className="h-[1px] flex-1 bg-zinc-100" />
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignIn}
            className="h-12 w-full rounded-xl border-zinc-600 border px-6 py-3 text-neutral-700 text-sm font-medium hover:bg-zinc-50 transition-all flex items-center justify-center gap-2.5"
          >
            <FcGoogle className="size-5" />
            <span>Sign in with Google</span>
          </Button>

          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <span className="text-zinc-600 text-sm font-medium font-inter">Don’t have an account?</span>
              <Link href="/register" className="text-blue-700 text-sm font-bold font-inter ml-1 hover:underline">
                Sign up
              </Link>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-zinc-600 text-sm font-medium font-inter underline underline-offset-4 decoration-zinc-300 leading-5 hover:text-zinc-900 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
