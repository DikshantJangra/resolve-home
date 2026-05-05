"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForgotPasswordStore } from "@/store/use-forgot-password-store"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type EmailValues = z.infer<typeof emailSchema>

export function ForgotPasswordEmail() {
  const { setEmail, nextStep } = useForgotPasswordStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
  })

  const onSubmit = (data: EmailValues) => {
    setEmail(data.email)
    // Here you would typically trigger the API call to send OTP
    nextStep()
  }

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-tight text-neutral-700">
          Reset your password
        </h1>
        <p className="text-base font-normal font-inter leading-6 text-zinc-600">
          Enter your email below and we'll send you an OTP, ensure that you entered the correct email address.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-600 text-sm font-medium font-inter leading-5">
            Email address <span className="text-red-600">*</span>
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="opeyemi@gmail.com"
            className="h-12 border-stone-300 focus-visible:ring-blue-600"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white hover:bg-blue-800"
        >
          Verify & continue
        </Button>
      </form>

      <p className="text-center text-xs font-normal font-inter leading-4 text-zinc-600 mt-auto">
        By continuing you agree to our <span className="underline cursor-pointer">Terms & Privacy Policy</span>.
      </p>
    </div>
  )
}
