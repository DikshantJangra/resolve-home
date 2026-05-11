'use client'

import React, { useState } from 'react'
import { HiOutlineStar, HiStar } from 'react-icons/hi'
import { Button } from "@resolve/ui"
import { Textarea } from "@resolve/ui"
import { useReviewBooking } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { cn } from "@resolve/ui"

interface ReviewFormProps {
  bookingId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const ReviewForm = ({ bookingId, onSuccess, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const { mutate: submitReview, isPending } = useReviewBooking()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (comment.length < 10) {
      toast.error('Please write a slightly longer comment (min 10 characters)')
      return
    }

    submitReview({
      bookingId,
      rating,
      comment
    }, {
      onSuccess: () => {
        toast.success('Review submitted successfully!')
        onSuccess?.()
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to submit review')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-blue-100 shadow-sm">
      <div className="space-y-1">
        <h4 className="text-neutral-700 text-sm font-semibold">Rate your experience</h4>
        <p className="text-zinc-500 text-xs">How would you rate the service provided?</p>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoveredRating(i)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-transform active:scale-95"
          >
            {i <= (hoveredRating || rating) ? (
              <HiStar className="w-8 h-8 text-amber-400 fill-amber-400" />
            ) : (
              <HiOutlineStar className="w-8 h-8 text-zinc-300" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-neutral-700 text-xs font-medium">Your comment</label>
        <Textarea
          placeholder="What did you like or dislike? How can the professional improve?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px] text-sm rounded-xl border-zinc-200"
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            className="flex-1 text-zinc-500 hover:text-zinc-700"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-blue-700 hover:bg-blue-800 text-white rounded-xl h-11"
        >
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  )
}
