'use client'

import React, { useState, useEffect } from 'react'
import { HiOutlineLocationMarker, HiChevronDown, HiOutlineHome } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button, Input, Label } from "@resolve/ui"
import { useUserProfile } from '@/hooks/api-hooks'

export const LocationStep = () => {
  const { location, setLocation, setStep } = useBookingStore()
  const { data: profile } = useUserProfile()
  
  const [formData, setFormData] = useState({
    state: location?.state || '',
    city: location?.city || '',
    streetAddress: location?.streetAddress || '',
    landmark: location?.landmark || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUseHomeAddress = () => {
    if (profile?.user?.homeAddress) {
      setFormData({
        state: (profile?.user as any)?.state || '',
        city: (profile?.user as any)?.city || '',
        streetAddress: profile?.user?.homeAddress,
        landmark: (profile?.user as any)?.landmark || '',
      })
    }
  }

  const handleUseGPS = () => {
    // Mocking GPS location
    setFormData({
      state: 'Lagos',
      city: 'Ikeja',
      streetAddress: '15 Mobolaji bank, Anthony way',
      landmark: 'Near ikeja mall',
    })
  }

  const isFormValid = formData.state.trim() && formData.city.trim() && formData.streetAddress.trim() && formData.landmark.trim()

  const handleContinue = () => {
    setLocation(formData)
    setStep(5)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-6 space-y-6 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleUseGPS}
            className="w-full flex justify-center items-center gap-2 py-2 text-blue-700 text-sm font-medium underline hover:text-blue-800 transition-colors"
          >
            <HiOutlineLocationMarker className="w-5 h-5" />
            Use my current GPS location
          </button>

          {profile?.user?.homeAddress && (
            <button
              onClick={handleUseHomeAddress}
              className="w-full flex justify-center items-center gap-2 py-2 text-blue-700 text-sm font-medium underline hover:text-blue-800 transition-colors"
            >
              <HiOutlineHome className="w-5 h-5" />
              Use my home address
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
              State <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <Input
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Select State"
                className="h-12 border-zinc-300 rounded-lg px-4 focus:border-blue-700"
              />
              <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
              City <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <Input
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Select City"
                className="h-12 border-zinc-300 rounded-lg px-4 focus:border-blue-700"
              />
              <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
              Street Address <span className="text-red-600">*</span>
            </Label>
            <Input
              value={formData.streetAddress}
              onChange={(e) => handleChange('streetAddress', e.target.value)}
              placeholder="Enter Street Address"
              className="h-12 border-zinc-300 rounded-lg px-4 focus:border-blue-700"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
              Nearest Landmark/Area <span className="text-red-600">*</span>
            </Label>
            <Input
              value={formData.landmark}
              onChange={(e) => handleChange('landmark', e.target.value)}
              placeholder="e.g Near ikeja mall"
              className="h-12 border-zinc-300 rounded-lg px-4 focus:border-blue-700"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
              Date <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <Input
                type="date"
                onChange={(e) => useBookingStore.getState().setScheduledDate(e.target.value)}
                placeholder="Select date"
                className="h-12 border-zinc-300 rounded-lg px-4 focus:border-blue-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep(3)}
          className="flex-1 h-11 border-zinc-300 rounded-xl"
        >
          Back
        </Button>
        <Button
          disabled={!isFormValid}
          onClick={handleContinue}
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl disabled:opacity-40"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

