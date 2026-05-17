'use client'

import React, { useState, useEffect } from 'react'
import { useUserProfile, useCategories, useServices, useUpdateEngineerServices } from '@/hooks/api-hooks'
import { Button, Label, LoadingSpinner } from "@resolve/ui"
import { cn } from "@resolve/ui"
import { toast } from 'sonner'
import { HiOutlineCheckCircle, HiOutlineBriefcase, HiOutlineExclamationCircle } from 'react-icons/hi'

export const MyServicesTab = () => {
  // Fetch profile directly inside the tab — don't rely on stale parent prop
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const engineerProfile = profile?.engineerProfile ?? null

  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  const { data: services = [], isLoading: loadingServices } = useServices(selectedCategory)
  const { mutate: updateServices, isPending } = useUpdateEngineerServices()

  // Pre-populate once engineer profile loads
  useEffect(() => {
    if (engineerProfile && !initialized) {
      const categoryId = engineerProfile.category || engineerProfile.categoryId || ''
      const servicesArray = Array.isArray(engineerProfile.assignedServices)
        ? engineerProfile.assignedServices
        : (engineerProfile.assignedServices ? [engineerProfile.assignedServices] : [])

      console.log('[MyServicesTab] Engineer profile loaded:', engineerProfile)
      console.log('[MyServicesTab] categoryId:', categoryId, '| services:', servicesArray)

      setSelectedCategory(categoryId)
      setSelectedServices(servicesArray)
      setInitialized(true)
    }
  }, [engineerProfile, initialized])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleSave = () => {
    if (!selectedCategory) {
      toast.error('Please select a primary category')
      return
    }
    if (selectedServices.length === 0) {
      toast.error('Please select at least one specific service')
      return
    }
    updateServices(
      { category: selectedCategory, assignedServices: selectedServices },
      {
        onSuccess: () => toast.success('Services updated successfully!'),
        onError: (err: any) => {
          console.error('[MyServicesTab] Save failed:', err)
          toast.error(err?.response?.data?.error || 'Failed to update services. Please try again.')
        }
      }
    )
  }

  // Loading state
  if (profileLoading) {
    return (
      <div className="space-y-4 max-w-3xl animate-pulse">
        <div className="h-6 w-48 bg-zinc-200 rounded" />
        <div className="h-12 w-full bg-zinc-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-zinc-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  // No engineer profile found
  if (!engineerProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
          <HiOutlineExclamationCircle className="w-7 h-7 text-amber-500" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-800">Setup wizard not completed</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            You don't have an engineer profile yet. Complete the Pro Partner setup wizard first, then come back here to manage your services.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-1 border-b border-zinc-100 pb-4">
        <h3 className="text-neutral-700 text-lg font-bold flex items-center gap-2">
          <HiOutlineBriefcase className="w-5 h-5 text-blue-700" />
          My Provided Services
        </h3>
        <p className="text-zinc-500 text-xs sm:text-sm">
          Select your primary trade category and the specific sub-services you offer. Customers match with you based on these selections.
        </p>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-zinc-700">Primary Category <span className="text-red-500">*</span></Label>
        {loadingCategories ? (
          <div className="h-12 w-full bg-zinc-50 border border-zinc-200 rounded-lg animate-pulse" />
        ) : (
          <select
            className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none bg-white transition-all cursor-pointer hover:border-zinc-400"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedServices([])
            }}
          >
            <option value="">Select your primary category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Services Checklist */}
      {selectedCategory && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-baseline">
            <Label className="text-zinc-700 font-semibold text-sm">Offered Services <span className="text-red-500">*</span></Label>
            {selectedServices.length > 0 && (
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                {selectedServices.length} selected
              </span>
            )}
          </div>

          {loadingServices ? (
            <div className="flex items-center gap-2 text-zinc-500 text-sm py-8 justify-center border border-zinc-200 border-dashed rounded-xl bg-zinc-50/50">
              <LoadingSpinner className="w-5 h-5 text-blue-700" />
              <span>Loading services...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="text-sm text-zinc-400 italic py-6 text-center border border-zinc-200 border-dashed rounded-xl bg-zinc-50/50">
              No specific services registered under this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 max-h-72 overflow-y-auto border border-zinc-200 rounded-xl bg-zinc-50/30">
              {services.map((service: any) => {
                const isSelected = selectedServices.includes(service.id)
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceToggle(service.id)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 select-none hover:translate-y-[-1px]",
                      isSelected
                        ? "bg-blue-50/60 border-blue-500 shadow-sm"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                      isSelected ? "bg-blue-700 border-blue-700 text-white" : "border-zinc-300"
                    )}>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-semibold text-zinc-800">{service.name}</p>
                      {service.description && (
                        <p className="text-[10px] text-zinc-500 line-clamp-1">{service.description}</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="pt-4 border-t border-zinc-100 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending || !selectedCategory || selectedServices.length === 0}
          className="h-12 px-8 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          {isPending ? (
            <>
              <LoadingSpinner className="w-4 h-4 text-white" />
              <span>Saving changes...</span>
            </>
          ) : (
            <>
              <HiOutlineCheckCircle className="w-5 h-5" />
              <span>Save Services</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
