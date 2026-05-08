'use client'

import React from 'react'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'
import { LuDroplets } from 'react-icons/lu'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { TbAirConditioning } from 'react-icons/tb'

export const ServiceStep = () => {
  const { serviceType, setServiceType, setStep } = useBookingStore()

  const services = [
    {
      id: 'Plumbing',
      title: 'Plumbing',
      description: 'Hire a professional to handle your leaks, blockages and any other plumbing request',
      icon: LuDroplets,
      gradient: 'from-purple-300 to-purple-300',
      iconColor: 'text-purple-600',
    },
    {
      id: 'Electrical',
      title: 'Electrical',
      description: 'Fix your wiring, socket, cable faults and other electrical electronics repair you might need',
      icon: HiOutlineLightningBolt,
      gradient: 'from-orange-200 to-orange-200',
      iconColor: 'text-orange-600',
    },
    {
      id: 'AC and Cooling',
      title: 'AC and Cooling',
      description: 'Get your installation done, routine maintenance/checks and other HVAC services you need',
      icon: TbAirConditioning,
      gradient: 'from-blue-200 to-blue-200',
      iconColor: 'text-blue-600',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 px-5 pt-10 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-2 gap-5">
          {services.map((service) => {
            const Icon = service.icon
            const isSelected = serviceType === service.id

            return (
              <button
                key={service.id}
                onClick={() => setServiceType(service.id)}
                className={`w-full h-auto min-h-[256px] p-5 rounded-xl border transition-all flex flex-col justify-center items-center gap-5 overflow-hidden text-center ${
                  isSelected
                    ? 'bg-slate-50 border-blue-700 ring-1 ring-blue-700'
                    : 'bg-white border-zinc-300 hover:border-zinc-400'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex justify-center items-center bg-gradient-to-b ${service.gradient}`}>
                  <Icon className={`w-6 h-6 ${service.iconColor}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-neutral-700 text-base font-semibold leading-6">
                    {service.title}
                  </h3>
                  <p className="text-zinc-600 text-xs font-normal leading-4 line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 mt-auto border-t border-zinc-100">
        <Button
          disabled={!serviceType}
          onClick={() => setStep(2)}
          className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 text-sm font-medium rounded-xl disabled:opacity-40 transition-all"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
