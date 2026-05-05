'use client'

import React from 'react'
import { HiOutlineStar, HiOutlineLocationMarker } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { Review } from '../types'

interface ReviewCardProps {
  review: Review
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="w-72 p-3 bg-white rounded-[10px] border border-zinc-100 flex flex-col gap-3 shrink-0">
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <HiOutlineStar 
                key={i} 
                className={cn(
                  "w-3.5 h-3.5",
                  i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"
                )} 
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-medium">
            <HiOutlineLocationMarker className="w-3 h-3" />
            <span>{review.location}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-slate-900 text-sm font-medium leading-5 line-clamp-1">{review.title}</h4>
          <p className="text-zinc-700 text-xs font-normal leading-4 line-clamp-3">{review.comment}</p>
        </div>
      </div>

      {review.images.length > 0 && (
        <div className="flex gap-1 overflow-hidden">
          {review.images.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`Review ${index + 1}`} 
              className="flex-1 h-16 rounded-sm object-cover"
            />
          ))}
          {review.images.length < 3 && (
             <div className="flex-1 h-16 bg-zinc-100 rounded-sm flex items-center justify-center">
               <span className="text-zinc-400 text-[10px]">No image</span>
             </div>
          )}
        </div>
      )}
    </div>
  )
}
