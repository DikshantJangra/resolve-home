'use client'

import React from 'react'
import { HiOutlineBadgeCheck } from 'react-icons/hi'

export const VerificationRequired = ({ onVerify }: { onVerify: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-[505px] inline-flex flex-col justify-start items-center gap-20">
        <div className="self-stretch flex flex-col justify-center items-center gap-8">
          <div className="w-14 h-14 relative flex items-center justify-center">
             <div className="w-14 h-14 bg-white border-2 border-zinc-200 rounded-xl flex items-center justify-center relative">
                <div className="w-12 h-12 border-4 border-zinc-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-3 border-4 border-zinc-600" />
                </div>
                <HiOutlineBadgeCheck className="absolute -right-2 -bottom-2 w-6 h-6 text-blue-700 bg-white rounded-full" />
              </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center justify-start text-neutral-700 text-3xl font-bold font-['Plus_Jakarta_Sans'] leading-9">Your account has not been verified, verify your account to continue</div>
            <div className="self-stretch text-center justify-start text-zinc-600 text-base font-normal font-['Inter'] leading-6">Once you are verified you will be available on the job market place and stat getting orders</div>
          </div>
        </div>
        <button 
          onClick={onVerify}
          className="self-stretch h-11 px-6 py-3 bg-blue-700 rounded-xl inline-flex justify-center items-center cursor-pointer hover:bg-blue-800 transition-colors"
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Verify your account</div>
        </button>
      </div>
    </div>
  )
}
