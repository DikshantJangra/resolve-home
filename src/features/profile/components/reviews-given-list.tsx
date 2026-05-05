'use client'

import React from 'react'
import { HiOutlineStar } from 'react-icons/hi'
import { cn } from '@/lib/utils'

interface ReviewGivenItemProps {
  professionalName: string
  professionalInitials: string
  category: string
  date: string
  rating: number
  comment: string
}

export const ReviewGivenItem = ({
  professionalName,
  professionalInitials,
  category,
  date,
  rating,
  comment
}: ReviewGivenItemProps) => {
  return (
    <div className="self-stretch p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 hover:border-blue-100 transition-colors">
      <div className="self-stretch flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex justify-center items-center">
            <span className="text-blue-700 text-xs font-bold font-['Inter']">{professionalInitials}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-700 text-sm font-semibold leading-5">{professionalName}</span>
            <span className="text-zinc-500 text-xs font-normal leading-4">{category} · {date}</span>
          </div>
        </div>
        
        <div className="flex gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <HiOutlineStar 
              key={i} 
              className={cn(
                "w-3 h-3",
                i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
              )} 
            />
          ))}
        </div>
      </div>
      
      <p className="text-zinc-600 text-sm font-normal leading-relaxed italic">
        &quot;{comment}&quot;
      </p>
    </div>
  )
}

export const ReviewsGivenList = () => {
  const reviews = [
    {
      professionalName: 'James Adewale',
      professionalInitials: 'JA',
      category: 'Plumbing',
      date: 'May 1, 2025',
      rating: 5,
      comment: 'James was incredibly professional. Fixed our burst pipe in under 2 hours. Would absolutely book again.'
    },
    {
      professionalName: 'Amaka Okonkwo',
      professionalInitials: 'AO',
      category: 'Electrical',
      date: 'Apr 28, 2025',
      rating: 4,
      comment: 'Very skilled. Sorted out the wiring fault quickly. Only slight issue was arrival 20 mins late.'
    },
    {
      professionalName: 'Chidi Bello',
      professionalInitials: 'CB',
      category: 'Heating & AC',
      date: 'Apr 18, 2025',
      rating: 5,
      comment: 'Excellent service from start to finish. Very tidy, explained everything clearly. Highly recommend.'
    },
    {
      professionalName: 'James Adewale',
      professionalInitials: 'JA',
      category: 'Plumbing',
      date: 'May 1, 2025',
      rating: 5,
      comment: 'James was incredibly professional. Fixed our burst pipe in under 2 hours. Would absolutely book again.'
    }
  ]

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review, index) => (
        <ReviewGivenItem key={index} {...review} />
      ))}
    </div>
  )
}
