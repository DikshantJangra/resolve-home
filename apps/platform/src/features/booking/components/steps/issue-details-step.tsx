'use client'

import React from 'react'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button } from "@resolve/ui"
import { Textarea } from "@resolve/ui"
import { Label } from "@resolve/ui"
import { FileUpload } from "@resolve/ui"
import { useServices } from '@/hooks/api-hooks'
import { useState } from 'react'
import { HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi2'
import { cn } from "@resolve/ui"

export const IssueDetailsStep = () => {
  const { 
    issueDetails, 
    setIssueDetails, 
    photos, 
    addPhoto, 
    removePhoto, 
    setStep,
    categoryId,
    serviceId,
    setServiceId
  } = useBookingStore()

  const [isUploaderOpen, setIsUploaderOpen] = useState(false)
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
  
  const { data: services, isLoading: isLoadingServices } = useServices(categoryId || undefined)

  const handleUploadSuccess = (successfulFiles: any[]) => {
    successfulFiles.forEach(file => {
      const url = file.response.body.data.file.url
      addPhoto(url)
    })
  }

  const selectedService = services?.find((s: any) => s.id === serviceId)
  const isFormValid = issueDetails.trim().length >= 10 && photos.length > 0 && serviceId

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-10 space-y-8 overflow-y-auto no-scrollbar">
        {/* Service Selection */}
        <div className="space-y-1.5">
          <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
            Select Service <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <button
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              className="w-full h-12 px-4 bg-white border border-zinc-300 rounded-lg flex items-center justify-between hover:border-zinc-400 transition-colors"
            >
              <span className={cn("text-sm", selectedService ? "text-zinc-900" : "text-zinc-400")}>
                {selectedService ? selectedService.name : "Choose a specific service"}
              </span>
              <HiOutlineChevronDown className={cn("w-5 h-5 text-zinc-400 transition-transform", isServiceDropdownOpen && "rotate-180")} />
            </button>

            {isServiceDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
                {isLoadingServices ? (
                  <div className="px-4 py-2 text-sm text-zinc-500">Loading services...</div>
                ) : services && services.length > 0 ? (
                  services.map((service: any) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setServiceId(service.id)
                        setIsServiceDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span className={cn(service.id === serviceId ? "text-blue-700 font-medium" : "text-zinc-700")}>
                        {service.name}
                      </span>
                      {service.id === serviceId && <HiOutlineCheck className="w-4 h-4 text-blue-700" />}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-zinc-500">No specific services available for this category</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Issue Details */}
        <div className="space-y-1.5">
          <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
            Issue Details <span className="text-red-600">*</span>
          </Label>
          <Textarea
            value={issueDetails}
            onChange={(e) => setIssueDetails(e.target.value)}
            placeholder="Tell us exactly what happened, when it started..."
            className="h-32 resize-none border-zinc-300 rounded-lg p-4 text-sm font-normal text-zinc-600 focus:border-blue-700"
          />
        </div>

        {/* Upload Photos */}
        <div className="space-y-3">
          <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
            Attach/Upload photos <span className="text-red-600">*</span>
          </Label>
          
          <div className="grid grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={photo} className="w-full h-full object-cover" alt="Upload" />
                <button 
                  onClick={() => removePhoto(index)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiOutlineTrash className="text-white w-6 h-6" />
                </button>
              </div>
            ))}

            {photos.length < 3 && (
              <button 
                onClick={() => setIsUploaderOpen(true)}
                className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-all"
              >
                <HiOutlinePlus className="w-6 h-6 text-blue-700" />
                <span className="text-[10px] text-zinc-400 font-medium">Add Photo</span>
              </button>
            )}
          </div>
        </div>

        <FileUpload 
          isOpen={isUploaderOpen}
          onRequestClose={() => setIsUploaderOpen(false)}
          onSuccess={handleUploadSuccess}
          uploadType="image"
          multiple={true}
          maxFiles={3 - photos.length}
        />
      </div>

      <div className="p-5 mt-auto flex gap-4 border-t border-zinc-100 bg-white">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          className="flex-1 h-11 border-zinc-300 rounded-xl"
        >
          Back
        </Button>
        <Button
          disabled={!isFormValid}
          onClick={() => setStep(4)}
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl disabled:opacity-40 transition-all"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
