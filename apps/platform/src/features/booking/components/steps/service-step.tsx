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
  const { setServiceType, setStep, setCategoryId, categoryId } = useBookingStore()
  const { data: categories, isLoading } = useCategories()

  const categoryConfigs: Record<string, any> = {
    'Plumbing': {
      gradient: 'from-purple-300 to-purple-300',
      iconColor: 'text-purple-600',
      description: 'Hire a professional to handle your leaks, blockages and any other plumbing request'
    },
    'Electrical': {
      gradient: 'from-orange-100 to-orange-300',
      iconColor: 'text-orange-600',
      description: 'Fix your wiring, socket, cable faults and other electrical electronics repair you might need'
    },
    'AC and Cooling': {
      gradient: 'from-lime-400 to-lime-500',
      iconColor: 'text-yellow-300',
      description: 'Get your installation done, routine maintenance/checks and other HVAC services you need'
    },
  }

  const handleSelect = (category: any) => {
    setCategoryId(category.id)
    setServiceType(category.name)
  }

  if (isLoading) {
    return (
      <div className="flex-1 px-5 pt-10 grid grid-cols-2 gap-5">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-64 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-0">
      <div className="flex-1 px-5 pt-10 overflow-y-auto">
        <div className="flex flex-wrap gap-5 justify-center">
          {categories?.map((cat: any) => {
            const config = categoryConfigs[cat.name] || categoryConfigs['Plumbing']
            const isSelected = categoryId === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat)}
                className={`w-72 h-64 p-5 rounded-xl transition-all flex flex-col justify-center items-center gap-5 overflow-hidden ${
                  isSelected
                    ? 'bg-slate-50 outline outline-[1.50px] outline-offset-[-1.50px] outline-blue-700'
                    : 'bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300'
                }`}
              >
                <div className={`w-11 h-11 px-2.5 rounded-xl flex justify-center items-center bg-gradient-to-b ${config.gradient}`}>
                  <div className={`w-5 h-5 rounded-full border-2 ${config.iconColor} border-current`} />
                </div>
                <div className="self-stretch flex flex-col justify-start items-center gap-3 text-center">
                  <div className="self-stretch text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                    {cat.name}
                  </div>
                  <div className="self-stretch text-zinc-600 text-sm font-normal font-['Inter'] leading-5">
                    {config.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 mt-auto">
        <button
          disabled={!categoryId}
          onClick={() => setStep(2)}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-between items-center transition-all ${
            !categoryId ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
          }`}
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Continue</div>
        </button>
      </div>
    </div>
  )
}
