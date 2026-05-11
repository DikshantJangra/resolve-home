'use client'

import React from 'react'
import { useBookingStore } from '@/store/booking-store'
import { Button } from "@resolve/ui"
import { LuDroplets } from 'react-icons/lu'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { TbAirConditioning } from 'react-icons/tb'
import { useCategories } from '@/hooks/api-hooks'
import { Skeleton } from "@resolve/ui"

export const ServiceStep = () => {
  const { serviceType, setServiceType, setStep, setCategoryId, categoryId } = useBookingStore()
  const { data: categories, isLoading } = useCategories()

  // Map backend categories to our design icons/gradients
  const categoryConfigs: Record<string, any> = {
    'Plumbing': {
      icon: LuDroplets,
      gradient: 'from-purple-300 to-purple-300',
      iconColor: 'text-purple-600',
    },
    'Electrical': {
      icon: HiOutlineLightningBolt,
      gradient: 'from-orange-200 to-orange-200',
      iconColor: 'text-orange-600',
    },
    'AC and Cooling': {
      icon: TbAirConditioning,
      gradient: 'from-blue-200 to-blue-200',
      iconColor: 'text-blue-600',
    },
  }

  const handleSelect = (category: any) => {
    setCategoryId(category.id)
    setServiceType(category.name)
  }

  if (isLoading) {
    return (
      <div className="flex-1 px-5 pt-10 grid grid-cols-2 gap-5">
        {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-[256px] rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 px-5 pt-10 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-2 gap-5">
          {categories?.map((cat: any) => {
            const config = categoryConfigs[cat.name] || categoryConfigs['Plumbing']
            const Icon = config.icon
            const isSelected = categoryId === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat)}
                className={`w-full h-auto min-h-[256px] p-5 rounded-xl border transition-all flex flex-col justify-center items-center gap-5 overflow-hidden text-center ${
                  isSelected
                    ? 'bg-slate-50 border-blue-700 ring-1 ring-blue-700'
                    : 'bg-white border-zinc-300 hover:border-zinc-400'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex justify-center items-center bg-gradient-to-b ${config.gradient}`}>
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-neutral-700 text-base font-semibold leading-6">
                    {cat.name}
                  </h3>
                  <p className="text-zinc-600 text-xs font-normal leading-4 line-clamp-3">
                    {cat.description || `Hire a professional to handle your ${cat.name.toLowerCase()} request`}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 mt-auto border-t border-zinc-100">
        <Button
          disabled={!categoryId}
          onClick={() => setStep(2)}
          className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 text-sm font-medium rounded-xl disabled:opacity-40 transition-all"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
