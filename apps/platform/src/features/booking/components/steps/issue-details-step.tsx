'use client'

import React, { useState } from 'react'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import { HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi2'
import { useBookingStore } from '@/store/booking-store'
import { Textarea, Label, LoadingSpinner, cn } from "@resolve/ui"
import { useServices } from '@/hooks/api-hooks'
import { apiClient, ENDPOINTS } from "@resolve/api"
import { toast } from 'sonner'

export const IssueDetailsStep = () => {
  const {
    issueDetails,
    setIssueDetails,
    photos,
    addPhoto,
    removePhoto,
    setStep,
    categoryId,
    serviceIds,
    setServiceId,
  } = useBookingStore()

  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { data: services, isLoading: isLoadingServices } = useServices(categoryId || undefined)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (photos.length + files.length > 4) {
      toast.error("You can only upload up to 4 photos")
      return
    }

    setIsUploading(true)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await apiClient.post(ENDPOINTS.UPLOAD.BASE, formData, {
          params: { type: 'image' },
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const url = res.data?.data?.file?.url || res.data?.data?.url || res.data?.url

        if (url) {
          addPhoto(url)
        }
      }
      toast.success('Photos uploaded successfully')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Upload failed, please try again')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const selectedCount = serviceIds.length
  const isFormValid = issueDetails.trim().length >= 10 && photos.length > 0 && selectedCount > 0

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 px-5 pt-10 space-y-8 overflow-y-auto no-scrollbar">
        {/* Service Selection (single-select) */}
        <div className="space-y-1.5">
          <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium font-['Inter'] leading-5">
            Select Service <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <button
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              className="w-full h-12 px-4 bg-white border border-stone-300 rounded-lg flex items-center justify-between hover:border-zinc-400 transition-colors"
            >
              <span className={cn("text-sm", selectedCount > 0 ? "text-zinc-600" : "text-zinc-400")}>
                {selectedCount > 0
                  ? services?.find((s: any) => s.id === serviceIds[0])?.name || 'Service selected'
                  : "Choose a service"}
              </span>
              <HiOutlineChevronDown className={cn("w-5 h-5 text-zinc-400 transition-transform", isServiceDropdownOpen && "rotate-180")} />
            </button>

            {isServiceDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
                {isLoadingServices ? (
                  <div className="px-4 py-2 text-sm text-zinc-500">Loading services...</div>
                ) : services && services.length > 0 ? (
                  services.map((service: any) => {
                    const isSelected = serviceIds[0] === service.id
                    return (
                      <button
                        key={service.id}
                        onClick={() => { setServiceId(service.id); setIsServiceDropdownOpen(false) }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className={cn(isSelected ? "text-blue-700 font-medium" : "text-zinc-700")}>
                          {service.name}
                        </span>
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          isSelected ? "border-blue-700" : "border-zinc-300"
                        )}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-blue-700" />}
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="px-4 py-2 text-sm text-zinc-500">No specific services available for this category</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Issue Details */}
        <div className="space-y-1.5 h-52 flex flex-col">
          <div className="inline-flex justify-start items-start gap-0.5">
            <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">
              Issue Details
            </Label>
            <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
          </div>
          <Textarea
            value={issueDetails}
            onChange={(e) => setIssueDetails(e.target.value)}
            placeholder="Tell us exactly what happened, when it started..."
            className="flex-1 resize-none border-stone-300 rounded-lg p-4 text-sm font-normal text-zinc-600 focus:border-blue-700 placeholder:text-zinc-300"
          />
        </div>

        {/* Upload Photos Section */}
        <div className="space-y-5">
          <div className="flex flex-col gap-3">
            <div className="inline-flex justify-start items-start gap-0.5">
              <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">
                Attach/Upload photos
              </Label>
              <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 group">
                  <img
                    src={photo}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-600 hover:bg-white hover:scale-110 transition-all shadow-sm"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || photos.length >= 4}
              className="inline-flex justify-start items-center gap-1 group disabled:opacity-50"
            >
              {isUploading ? (
                <LoadingSpinner className="w-5 h-5 text-blue-700" />
              ) : (
                <HiOutlinePlus className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-blue-700 text-sm font-normal font-['Inter'] leading-5 hover:underline">
                {photos.length === 0 ? "Add photo" : "Add more"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto bg-white border-t border-zinc-100">
        <button
          disabled={!isFormValid || isUploading}
          onClick={() => setStep(4)}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-between items-center transition-all ${
            !isFormValid || isUploading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
          }`}
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Continue</div>
        </button>
      </div>
    </div>
  )
}
