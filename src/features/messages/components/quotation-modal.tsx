'use client'

import React, { useState } from 'react'
import { HiOutlineX, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MaterialItem {
  id: string
  name: string
  price: string
  quantity: string
}

export const QuotationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [items, setItems] = useState<MaterialItem[]>([
    { id: '1', name: '', price: '', quantity: '1' }
  ])

  if (!isOpen) return null

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', price: '', quantity: '1' }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[639px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 pt-8 pb-5 border-b border-zinc-200 flex justify-between items-start shrink-0">
          <div className="space-y-1">
            <h2 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
              Create Job Quotation
            </h2>
            <p className="text-zinc-600 text-base font-normal font-['Inter'] leading-6">
              Break down costs for labor and materials.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
          >
            <HiOutlineX className="w-6 h-6" />
            <span className="text-base font-medium">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Labor Fee */}
          <div className="space-y-2">
            <label className="flex items-center gap-0.5 text-zinc-600 text-sm font-medium">
              Labor fee (₦) <span className="text-red-600">*</span>
            </label>
            <input 
              type="text"
              placeholder="Enter the amount you will charge for the job"
              className="w-full h-12 px-4 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm placeholder:text-zinc-300"
            />
          </div>

          {/* Materials Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-0.5 text-zinc-600 text-sm font-medium">
                Materials <span className="text-red-600">*</span>
              </label>
              <button 
                onClick={addItem}
                className="text-blue-700 text-sm font-medium hover:underline flex items-center gap-1"
              >
                <HiOutlinePlus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <input 
                    type="text"
                    placeholder="item name (e.g Copper Pipe)"
                    className="flex-[3] h-12 px-4 rounded-xl border border-zinc-300 text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input 
                    type="text"
                    placeholder="₦0.00"
                    className="flex-1 h-12 px-4 rounded-xl border border-zinc-300 text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input 
                    type="text"
                    placeholder="1"
                    className="w-20 h-12 px-4 rounded-xl border border-zinc-300 text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center"
                  />
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-zinc-100 flex justify-between items-center shrink-0">
          <div className="space-y-0.5">
            <div className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans']">
              ₦329,999
            </div>
            <div className="text-zinc-600 text-sm font-normal">
              Total Estimated Amount
            </div>
          </div>
          <Button 
            className="h-12 px-8 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium"
            onClick={() => {
              // Handle send
              onClose()
            }}
          >
            Send Quotation
          </Button>
        </div>
      </div>
    </div>
  )
}
