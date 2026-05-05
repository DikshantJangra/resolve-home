'use client'

import React, { useState } from 'react'
import { HiOutlineDotsHorizontal, HiOutlinePlus, HiOutlineSearch, HiOutlineBriefcase, HiOutlineLocationMarker } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { MessageActions } from './message-actions'
import { QuotationModal } from './quotation-modal'

export const ChatWindow = () => {
  const [showActions, setShowActions] = useState(false)
  const [showQuotationModal, setShowQuotationModal] = useState(false)

  return (
    <div className="flex-1 h-full flex flex-col bg-neutral-50 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden relative">
      {/* Header */}
      <div className="h-20 p-5 bg-stone-50 border-b border-zinc-300 flex items-start gap-2 relative z-10">
        <div className="flex-1 flex items-start gap-2">
          <div className="w-12 h-12 rounded-full border border-indigo-50 overflow-hidden relative shrink-0">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel" 
              alt="Engr. Samuel Okeke"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-neutral-700">Engr. Samuel Okeke</h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                <span className="text-xs text-zinc-600 leading-4">5 minutes ago</span>
              </div>
            </div>
            <div className="text-sm font-normal text-zinc-600 line-clamp-1">
              Discussing: <span className="text-blue-700">Plumbing Expert</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowActions(!showActions)}
            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <HiOutlineDotsHorizontal className="w-5 h-5" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 z-20">
              <MessageActions 
                onMakeQuotation={() => {
                  setShowQuotationModal(true)
                  setShowActions(false)
                }}
                onFlagMessage={() => {
                  // Handle flag
                  setShowActions(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-8">
        {/* Escrow Banner */}
        <div className="flex items-center gap-2.5 px-4">
          <div className="w-48 h-0.5 bg-zinc-300" />
          <p className="w-60 text-center text-zinc-600 text-[10px] font-normal leading-4">
            Chat and fund payments directly here. your money is held in escrow until you approve job 
          </p>
          <div className="w-48 h-0.5 bg-zinc-300" />
        </div>

        {/* Job Offer Card */}
        <div className="w-96 p-5 bg-white rounded-tl-xl rounded-tr-xl rounded-br-xl flex flex-col gap-5 overflow-hidden shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-6 bg-stone-50 rounded-lg flex items-center justify-center">
                  <HiOutlineBriefcase className="w-4 h-4 text-zinc-600" />
                </div>
                <span className="text-zinc-600 text-base font-semibold leading-6 line-clamp-1">Job offer request</span>
              </div>
              <span className="text-zinc-600 text-xs font-normal leading-4">12:12pm</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl flex flex-col gap-[3px] overflow-hidden">
              <h5 className="text-zinc-600 text-[10px] font-semibold leading-4 uppercase tracking-wider">DESCRIPTION</h5>
              <p className="text-zinc-600 text-sm font-normal leading-5">
                It started with a loud noise around 3 PM, which prompted me to investigate. I noticed that the kitchen faucet was leaking, and water was pooling on the floor.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <HiOutlineLocationMarker className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-600 text-sm font-medium leading-5">3.2 km away · Lagos Island</span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 rounded-xl outline outline-1 outline-blue-700 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-colors">
              Accept Job
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-700 rounded-xl text-neutral-50 text-sm font-medium hover:bg-blue-800 transition-colors">
              View Details
            </button>
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex justify-end">
          <div className="w-96 p-5 bg-white rounded-tl-xl rounded-tr-xl rounded-bl-xl flex flex-col gap-2 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-zinc-600 text-xs font-normal leading-4">12:12pm</span>
            </div>
            <p className="text-zinc-600 text-sm font-normal leading-5 line-clamp-2">
              Hello! I've seen your request for a Electrician. I'll accept this and head over shortly. also i will share you the quotation for your approval
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full h-20 p-5 bg-white border-t border-stone-50 flex items-center gap-2">
        <button className="p-2 bg-stone-50 rounded-lg text-zinc-600 hover:bg-stone-100 transition-colors">
          <HiOutlinePlus className="w-5 h-5" />
        </button>
        <div className="flex-1 h-9 px-5 bg-stone-50 rounded-xl flex items-center overflow-hidden">
          <input 
            type="text" 
            placeholder="Type a message here"
            className="w-full bg-transparent text-zinc-800 text-xs font-normal outline-none placeholder:text-zinc-400"
          />
        </div>
        <button className="p-2 bg-slate-50 rounded-lg text-blue-700 hover:bg-slate-100 transition-colors">
          <HiOutlineSearch className="w-5 h-5" />
        </button>
      </div>

      {/* Modals */}
      <QuotationModal 
        isOpen={showQuotationModal} 
        onClose={() => setShowQuotationModal(false)} 
      />
    </div>
  )
}
