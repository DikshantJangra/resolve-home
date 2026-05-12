'use client'

import React, { useState, useEffect } from 'react'
import { HiOutlineLocationMarker, HiChevronDown, HiOutlineHome } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button, Input, Label } from "@resolve/ui"
import { useUserProfile, useUpdateBioAddress } from '@/hooks/api-hooks'

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
      const addr = profile.user.homeAddress;
      setFormData({
        state: addr.state || '',
        city: addr.city || '',
        streetAddress: addr.street || '',
        landmark: '',
      })
    }
  }

  const handleUseGPS = () => {
    setFormData({
      state: 'Lagos',
      city: 'Ikeja',
      streetAddress: '15 Mobolaji bank, Anthony way',
      landmark: 'Near ikeja mall',
    })
  }

  const [saveAsHome, setSaveAsHome] = useState(false)
  const updateBioAddress = useUpdateBioAddress()

  const isFormValid = formData.state.trim() && formData.city.trim() && formData.streetAddress.trim() && formData.landmark.trim()

  const handleContinue = async () => {
    if (saveAsHome) {
      try {
        await updateBioAddress.mutateAsync({
          homeAddress: {
            street: formData.streetAddress,
            city: formData.city,
            state: formData.state,
          }
        })
      } catch (error) {
        console.error('Failed to save home address:', error)
      }
    }
    setLocation(formData)
    setStep(5)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 px-5 pt-10 space-y-8 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleUseGPS}
            className="self-stretch inline-flex justify-center items-center gap-2 py-2 text-blue-700 text-sm font-medium underline hover:text-blue-800 transition-colors"
          >
            <div className="w-5 h-5 relative flex items-center justify-center">
               <HiOutlineLocationMarker className="w-5 h-5" />
            </div>
            Use my current GPS location
          </button>

          {profile?.user?.homeAddress && (
            <button
              onClick={handleUseHomeAddress}
              className="self-stretch inline-flex justify-center items-center gap-2 py-2 text-blue-700 text-sm font-medium underline hover:text-blue-800 transition-colors"
            >
              <HiOutlineHome className="w-5 h-5" />
              Use my home address
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* State */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch inline-flex justify-start items-start gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">State</Label>
              <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
            </div>
            <div className="self-stretch relative">
              <Input
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Select State"
                className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5"
              />
              <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* City */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch inline-flex justify-start items-start gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">City</Label>
              <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
            </div>
            <div className="self-stretch relative">
              <Input
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Select City"
                className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5"
              />
              <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Street Address */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch inline-flex justify-start items-start gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Street Address</Label>
              <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
            </div>
            <Input
              value={formData.streetAddress}
              onChange={(e) => handleChange('streetAddress', e.target.value)}
              placeholder="Enter Street Address"
              className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5"
            />
          </div>

          {/* Landmark */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch inline-flex justify-start items-start gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Nearest Landmark/Area</Label>
              <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
            </div>
            <Input
              value={formData.landmark}
              onChange={(e) => handleChange('landmark', e.target.value)}
              placeholder="e.g Near ikeja mall"
              className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5"
            />
          </div>

          {/* Date */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch inline-flex justify-start items-start gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Date</Label>
              <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
            </div>
            <Input
              type="date"
              onChange={(e) => useBookingStore.getState().setScheduledDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="saveAsHome"
              checked={saveAsHome}
              onChange={(e) => setSaveAsHome(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-blue-700 focus:ring-blue-700"
            />
            <label htmlFor="saveAsHome" className="text-zinc-600 text-sm font-medium cursor-pointer">
              Save as my primary home address
            </label>
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto bg-white border-t border-zinc-100">
        <button
          disabled={!isFormValid}
          onClick={handleContinue}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-between items-center transition-all ${
            !isFormValid ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
          }`}
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Continue</div>
        </button>
      </div>
    </div>
  )
}

