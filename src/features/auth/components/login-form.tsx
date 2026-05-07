"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FcGoogle } from "react-icons/fc"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { IoArrowBack } from "react-icons/io5"
import { ENDPOINTS } from "@/lib/api/endpoints"
import apiClient from "@/lib/api/client"
import { authClient } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginValues) {
    setIsLoading(true)
    try {
      const { data: authData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      }, {
        onSuccess: () => {
          toast.success("Welcome back!")
          router.push("/dashboard")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Invalid credentials")
        }
      })

      if (error) {
        // Error handled in onError callback
        return
      }

      // Save token and role if returned
      // Note: Better Auth usually handles session via cookies automatically when using its client
      const token = (authData as any)?.token
      const role = (authData as any)?.user?.role

      if (token) {
        localStorage.setItem('auth_token', token)
        if (role) localStorage.setItem('user_role', role)
      }
    } catch (error: any) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: typeof window !== 'undefined' ? window.location.origin + "/dashboard" : "/dashboard",
      })
    } catch (error) {
      console.error("Google sign-in error:", error)
    }
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
