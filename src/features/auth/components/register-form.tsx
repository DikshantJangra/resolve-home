"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { FcGoogle } from "react-icons/fc"
import { HiEye, HiEyeOff } from "react-icons/hi"
import apiClient from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useRegister } from "../hooks/use-register"
import { registerSchema, type RegisterValues } from "../types"
import { useRegisterStore } from "@/store/use-register-store"

export function RegisterForm() {
  const router = useRouter()
  const { prevStep, role } = useRegisterStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const { mutate: register, isPending } = useRegister()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
    mode: "all",
  })

  function onSubmit(data: RegisterValues) {
    register(data)
  }

  const roleTitle = role === 'pro' ? "Work as a Professional" : "Hire a professional"
  const roleDescription = role === 'pro' 
    ? "Join our network of experts and start earning today." 
    : "Book any home service in under 60 seconds. Fill in your correct details below to get started."

  const password = form.watch("password")
  const requirements = [
    { label: "minimum 8 characters", met: (password?.length || 0) >= 8 },
    { label: "one number", met: /[0-9]/.test(password || "") },
    { label: "one uppercase character", met: /[A-Z]/.test(password || "") },
    { label: "one lowercase character", met: /[a-z]/.test(password || "") },
  ]

  const [defaultCountry, setDefaultCountry] = React.useState<any>("NG")

  React.useEffect(() => {
    import('js-cookie').then((Cookies) => {
      const country = Cookies.default.get("user_country")
      if (country) setDefaultCountry(country)
    })
  }, [])

  return (
    <div className="flex w-full flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-8 text-neutral-700">
          {roleTitle}
        </h1>
        <p className="text-base font-normal font-inter leading-6 text-zinc-600">
          {roleDescription}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          {/* Name Row */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <Label className="flex gap-0.5 text-sm font-medium text-zinc-600 font-inter">
                First Name <span className="text-red-600 font-bold">*</span>
              </Label>
              <Input
                {...form.register("firstName")}
                placeholder="Enter your first name"
                className={cn(
                  "h-12 border-zinc-300 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-300 focus-visible:ring-blue-700",
                  form.formState.errors.firstName && "border-red-500 ring-1 ring-red-500"
                )}
              />
              {form.formState.errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <Label className="flex gap-0.5 text-sm font-medium text-zinc-600 font-inter">
                Last Name <span className="text-red-600 font-bold">*</span>
              </Label>
              <Input
                {...form.register("lastName")}
                placeholder="Enter your last name"
                className={cn(
                  "h-12 border-zinc-300 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-300 focus-visible:ring-blue-700",
                  form.formState.errors.lastName && "border-red-500 ring-1 ring-red-500"
                )}
              />
              {form.formState.errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email/Phone Row */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <Label className="flex gap-0.5 text-sm font-medium text-zinc-600 font-inter">
                Email address <span className="text-red-600 font-bold">*</span>
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
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <Label className="flex gap-0.5 text-sm font-medium text-zinc-600 font-inter">
                Phone Number <span className="text-red-600 font-bold">*</span>
              </Label>
              <div className="phone-input-container">
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <PhoneInput
                      {...field}
                      value={value || ""}
                      onChange={(val) => onChange(val || "")}
                      key={defaultCountry}
                      international
                      defaultCountry={defaultCountry}
                      limitMaxLength
                      placeholder="Enter phone number"
                      className={cn(
                        "flex h-12 w-full border-zinc-300 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-300 focus-within:ring-1 focus-within:ring-blue-700 focus-within:border-blue-700 bg-white transition-all",
                        form.formState.errors.phone && "border-red-500 ring-1 ring-red-500"
                      )}
                    />
                  )}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-1.5">
              <Label className="flex gap-0.5 text-sm font-medium text-zinc-600 font-inter">
                Password <span className="text-red-600 font-bold">*</span>
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
            </div>

            {/* Requirements Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 pt-1">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn("size-1.5 rounded-full", req.met ? "bg-blue-600" : "bg-zinc-300")} />
                  <span className={cn(
                    "text-xs font-normal font-inter leading-4",
                    req.met ? "text-blue-700 font-medium" : "text-zinc-600"
                  )}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-5 pt-4">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className={cn(
              "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white transition-all hover:bg-blue-800",
              (isPending || !form.formState.isValid) && "opacity-40"
            )}
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-zinc-100" />
            <span className="text-zinc-300 text-xs font-normal font-inter leading-4">or</span>
            <div className="h-[1px] flex-1 bg-zinc-100" />
          </div>

          <div className="flex flex-col gap-6 items-center">
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                try {
                  const response = await apiClient.post(ENDPOINTS.AUTH.SIGN_IN_SOCIAL, {
                    provider: "google",
                    callbackURL: window.location.origin + "/dashboard",
                    disableRedirect: true
                  })

                  const { url } = response.data
                  if (url) {
                    window.location.href = url
                  }
                } catch (err) {
                  console.error("Social sign-in error:", err);
                }
              }}
              className="h-12 w-full rounded-xl border-zinc-600 border px-6 py-3 text-neutral-700 text-sm font-medium hover:bg-zinc-50"
            >
              <FcGoogle className="mr-3 size-5" />
              Sign up with Google
            </Button>

            <div className="text-center">
              <span className="text-zinc-600 text-sm font-medium font-inter leading-5">Already have an account?</span>
              <Link href="/login" className="text-blue-700 text-sm font-bold font-inter leading-5 ml-1 hover:underline decoration-2">
                Sign in
              </Link>
            </div>

            <button
              type="button"
              onClick={prevStep}
              className="text-zinc-600 text-sm font-medium font-inter underline underline-offset-4 decoration-zinc-300 leading-5 hover:text-zinc-900 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </form>

      <div className="mt-auto">
        <p className="text-zinc-600 text-xs font-normal font-inter leading-4 text-center">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> &{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
