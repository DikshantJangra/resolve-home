"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { authClient } from "@/lib/auth-client"
import Cookies from "js-cookie"
import { Button, Input, Label, cn } from "@resolve/ui"
import { toast } from "sonner"
import { useAuthSession } from "@/hooks/api-hooks"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { data: session } = useAuthSession()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

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
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  async function onSubmit(data: LoginValues) {
    setIsLoading(true)
    try {
      const { data: authData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message || "Invalid credentials")
        return
      }

      const token = (authData as any)?.token
      const role = (authData as any)?.user?.role

      if (token) {
        localStorage.setItem('auth_token', token)
        Cookies.set('auth_token', token, { expires: 7, path: '/' })
        
        if (role) {
          localStorage.setItem('user_role', role)
          Cookies.set('user_role', role, { expires: 7, path: '/' })
        }
      }

      toast.success("Welcome to the Admin Panel")
      router.push(callbackUrl)
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[489px] p-8 bg-stone-50 rounded-[20px] flex flex-col gap-12 overflow-hidden shadow-sm">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">
            Admin Sign In
          </h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Enter secure credentials to access the Resolv platform command center and operational controls.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-inter leading-5">
                Email address
              </Label>
              <span className="text-red-600 text-sm font-medium font-inter leading-5">*</span>
            </div>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Enter your email"
              className={cn(
                "h-12 px-4 py-3 rounded-lg border-zinc-300 bg-white text-zinc-900 text-sm font-normal font-inter leading-5 placeholder:text-zinc-300 focus-visible:ring-blue-700",
                form.formState.errors.email && "border-red-500 ring-1 ring-red-500"
              )}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-inter leading-5">
                Password
              </Label>
              <span className="text-red-600 text-sm font-medium font-inter leading-5">*</span>
            </div>
            <div className="relative">
              <Input
                {...form.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter desired password"
                className={cn(
                  "h-12 px-4 py-3 rounded-lg border-zinc-300 bg-white text-zinc-900 text-sm font-normal font-inter leading-5 placeholder:text-zinc-300 focus-visible:ring-blue-700 pr-12",
                  form.formState.errors.password && "border-red-500 ring-1 ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="mt-7">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className={cn(
                "h-12 w-full bg-blue-700 hover:bg-blue-800 rounded-xl text-neutral-50 text-sm font-medium font-inter leading-5 transition-all",
                (isLoading || !form.formState.isValid) && "opacity-40"
              )}
            >
              {isLoading ? "Signing in..." : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
