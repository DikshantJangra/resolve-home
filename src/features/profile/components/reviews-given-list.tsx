'use client'

import React from 'react'
import { HiOutlineStar } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { useUserBookings } from '@/hooks/api-hooks'
import { format } from 'date-fns'

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
  const { data: bookings, isLoading } = useUserBookings()

  const reviews = bookings
    ?.filter((b: any) => b.status === 'completed' && b.review)
    .map((b: any) => ({
      professionalName: b.engineer?.user?.name || 'Professional',
      professionalInitials: b.engineer?.user?.name 
        ? b.engineer.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() 
        : 'P',
      category: b.service?.name || 'Service',
      date: b.review?.createdAt ? format(new Date(b.review.createdAt), 'MMM d, yyyy') : format(new Date(b.updatedAt), 'MMM d, yyyy'),
      rating: b.review?.rating || 0,
      comment: b.review?.comment || ''
    })) || []

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 w-full bg-gray-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
          <HiOutlineStar className="w-8 h-8 text-blue-200" />
        </div>
        <p className="text-zinc-500 text-sm italic">You haven&apos;t given any reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review: any, index: number) => (
        <ReviewGivenItem key={index} {...review} />
      ))}
    </div>
  )
}
