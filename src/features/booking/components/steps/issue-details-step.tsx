'use client'

import React from 'react'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export const IssueDetailsStep = () => {
  const { 
    issueDetails, 
    setIssueDetails, 
    photos, 
    addPhoto, 
    removePhoto, 
    setStep 
  } = useBookingStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && photos.length < 3) {
      // Mocking upload by creating a local URL
      const file = files[0]
      const url = URL.createObjectURL(file)
      addPhoto(url)
    }
  }

  const isFormValid = issueDetails.length > 10 && photos.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-10 space-y-8">
        {/* Issue Details */}
        <div className="space-y-1.5">
          <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
            Issue Details <span className="text-red-600">*</span>
          </Label>
          <Textarea
            value={issueDetails}
            onChange={(e) => setIssueDetails(e.target.value)}
            placeholder="Tell us exactly what happened, when it started and any specific models or parts involved..."
            className="h-52 resize-none border-zinc-300 rounded-lg p-4 text-sm font-normal text-zinc-600 focus:border-blue-700"
          />
        </div>

        {/* Upload Photos */}
        <div className="space-y-3">
          <Label className="flex gap-0.5 text-zinc-600 text-sm font-medium">
            Attach/Upload photos <span className="text-red-600">*</span>
          </Label>
          
          <div className="space-y-4">
            {photos.map((photo, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="text-zinc-600 text-sm font-normal truncate max-w-[250px]">
                  IMG_PHOTO_{index + 1}.PNG
                </span>
                <button 
                  onClick={() => removePhoto(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            ))}

            {photos.length < 3 && (
              <div className="flex items-center gap-3">
                <label className="w-11 h-11 bg-slate-50 rounded-xl border border-indigo-400 flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <HiOutlinePlus className="w-5 h-5 text-blue-700" />
                </label>
                <div className="text-zinc-600 text-sm font-normal">
                  {photos.length === 0 
                    ? 'Upload Jpg, png 3mb max size (maximum of 3 pictures)' 
                    : 'Add more'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1 h-11 border-zinc-300 rounded-xl"
        >
          Back
        </Button>
        <Button
          disabled={!isFormValid}
          onClick={() => setStep(3)}
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl disabled:opacity-40"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
