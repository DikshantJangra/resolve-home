'use client'

import React, { useState, useEffect } from 'react'
import { useCategories, useServices, useUpdateEngineerProfile } from '@/hooks/api-hooks'
import { Button, Label, LoadingSpinner } from "@resolve/ui"
import { cn } from "@resolve/ui"
import { toast } from 'sonner'
import { HiOutlineCheckCircle, HiOutlineBriefcase } from 'react-icons/hi'

interface MyServicesTabProps {
  engineerProfile: any
}

export const MyServicesTab = ({ engineerProfile }: MyServicesTabProps) => {
  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  
  const { data: services = [], isLoading: loadingServices } = useServices(selectedCategory)
  const { mutate: updateProfile, isPending } = useUpdateEngineerProfile()

  // Pre-populate state from existing profile
  useEffect(() => {
    if (engineerProfile) {
      setSelectedCategory(engineerProfile.category || '')
      setSelectedServices(engineerProfile.assignedServices || [])
    }
  }, [engineerProfile])

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

    // Assemble the complete profile data as a payload base, replacing updated category and assignedServices
    const payload = {
      primarySpecialty: engineerProfile?.primarySpecialty || 'Professional Technician',
      category: selectedCategory,
      assignedServices: selectedServices,
      yearsOfExperience: engineerProfile?.yearsOfExperience || '1',
      idType: engineerProfile?.idType || 'BVN',
      idNumber: engineerProfile?.idNumber || '',
      idDocument: engineerProfile?.idDocument || '',
      bankDetails: {
        accountName: engineerProfile?.bankDetails?.accountName || '',
        bankName: engineerProfile?.bankDetails?.bankName || '',
        bankCode: engineerProfile?.bankDetails?.bankCode || '',
        accountNumber: engineerProfile?.bankDetails?.accountNumber || '',
      },
      location: {
        country: engineerProfile?.location?.country || 'Nigeria',
        state: engineerProfile?.location?.state || '',
        city: engineerProfile?.location?.city || '',
        streetAddress: engineerProfile?.location?.streetAddress || '',
        nearestLandmark: engineerProfile?.location?.nearestLandmark || '',
      },
      guarantorName: engineerProfile?.guarantor?.name || engineerProfile?.guarantorName || '',
      guarantorEmail: engineerProfile?.guarantor?.email || engineerProfile?.guarantorEmail || '',
      guarantorPhone: engineerProfile?.guarantor?.phone || engineerProfile?.guarantorPhone || '',
      guarantorRelationship: engineerProfile?.guarantor?.relationship || engineerProfile?.guarantorRelationship || '',
      guarantorWorkPlace: engineerProfile?.guarantor?.workPlace || engineerProfile?.guarantorWorkPlace || '',
    }

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Services updated successfully!")
      },
      onError: (err: any) => {
        console.error('[MyServicesTab] Save failed:', err)
        toast.error("Failed to update services. Please try again.")
      }
    })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-1 border-b border-zinc-100 pb-4">
        <h3 className="text-neutral-700 text-lg font-bold flex items-center gap-2">
          <HiOutlineBriefcase className="w-5 h-5 text-blue-700" />
          My Provided Services
        </h3>
        <p className="text-zinc-500 text-xs sm:text-sm">
          Select your primary trade category and specify all sub-services you offer. Customers will search and match with you based on these selections.
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
              setSelectedServices([]) // Clear sub-services when category changes to prevent cross-category mismatch
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
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full transition-all">
                {selectedServices.length} selected
              </span>
            )}
          </div>
          
          {loadingServices ? (
            <div className="flex items-center gap-2 text-zinc-500 text-sm py-8 animate-pulse justify-center border border-zinc-200 border-dashed rounded-xl bg-zinc-50/50">
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
                const isSelected = selectedServices.includes(service.id);
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
                      {isSelected && <svg className="w-3.5 h-3.5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-semibold text-zinc-800">{service.name}</p>
                      {service.description && (
                        <p className="text-[10px] text-zinc-500 line-clamp-1">{service.description}</p>
                      )}
                    </div>
                  </button>
                );
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
