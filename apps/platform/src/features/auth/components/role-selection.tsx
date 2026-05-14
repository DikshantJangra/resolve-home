"use client"

import { useRouter } from "next/navigation"
import { HiOutlineUsers, HiOutlineBriefcase } from "react-icons/hi2"
import { Button } from "@resolve/ui"
import { cn } from "@resolve/ui"
import { useRegisterStore, type RegisterRole } from "@/store/use-register-store"

export function RoleSelection() {
  const router = useRouter()
  const { role, setRole, nextStep } = useRegisterStore()

  const roles: { id: RegisterRole; title: string; description: string; icon: any }[] = [
    {
      id: "user",
      title: "Homeowner",
      description: "Find and book verified plumbers, electricians, and HVAC experts near you",
      icon: HiOutlineUsers,
    },
    {
      id: "worker",
      title: "Pro Partner",
      description: "Discover exciting job opportunities in your local area and take your business to new heights.",
      icon: HiOutlineBriefcase,
    },
  ]

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold font-heading leading-tight text-neutral-700">
          Let’s get you started?
        </h1>
        <p className="text-base font-normal font-inter leading-6 text-zinc-600">
          Choose your role so we can tailor your experience.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {roles.map((item) => {
          const Icon = item.icon
          const isSelected = role === item.id
          return (
            <button
              key={item.id}
              onClick={() => setRole(item.id)}
              className={cn(
                "flex w-full items-center gap-5 overflow-hidden rounded-2xl p-5 text-left transition-all",
                "outline outline-1 outline-offset-[-1px]",
                isSelected
                  ? "bg-blue-50/50 outline-blue-600 ring-1 ring-blue-600"
                  : "bg-white outline-zinc-300 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-zinc-600"
              )}>
                <Icon size={20} />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <h3 className={cn(
                  "text-base font-semibold font-inter leading-6",
                  isSelected ? "text-blue-700" : "text-neutral-700"
                )}>
                  {item.title}
                </h3>
                <p className="text-sm font-normal font-inter leading-5 text-zinc-600">
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-5">
        <Button
          onClick={nextStep}
          disabled={!role}
          className={cn(
            "h-12 w-full rounded-xl bg-blue-700 text-sm font-medium text-white transition-all hover:bg-blue-800",
            !role && "opacity-40"
          )}
        >
          Continue
        </Button>
        
        <button
          type="button"
          onClick={() => router.back()}
          className="text-center text-zinc-600 text-sm font-medium font-inter underline underline-offset-4 decoration-zinc-300 leading-5 hover:text-zinc-900 transition-colors"
        >
          Go back
        </button>

        <p className="text-center text-xs font-normal font-inter leading-4 text-zinc-600">
          By continuing you agree to our <span className="underline cursor-pointer">Terms & Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
