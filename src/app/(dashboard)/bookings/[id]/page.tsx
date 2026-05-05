'use client'

import React from 'react'
import Link from 'next/link'
import { 
  HiOutlineChevronLeft, 
  HiOutlineClock, 
  HiOutlineStar, 
  HiOutlineBriefcase,
  HiOutlinePhone,
  HiOutlineChatAlt,
  HiOutlineLocationMarker
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { BookingProgressTracker } from '@/features/booking/components/booking-progress-tracker'
import { ReviewCard } from '@/features/booking/components/review-card'
import { Booking } from '@/features/booking/types'
import { Button } from '@/components/ui/button'

const MOCK_BOOKING_DETAILS: Booking = {
  id: 'RH-7820-055',
  referenceId: '#RH-7820-055',
  category: 'Plumbing',
  description: 'Burst pipe, kitchen sink',
  status: 'In Progress',
  professional: {
    name: 'James Adewale',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    specialty: 'Electrician',
    jobsCompleted: 10,
    distance: '2.4km away',
    isVerified: true,
    reviews: [
      {
        id: 'r1',
        rating: 5,
        location: 'Lagos, Nigeria',
        title: 'Fix our 3phase inverter pumping machine',
        comment: 'From the first consultation to the final touches, Refit delivered on every promise. Our home extension is exactly what we wanted.',
        images: ['https://placehold.co/81x65', 'https://placehold.co/81x65']
      },
      {
        id: 'r2',
        rating: 5,
        location: 'Lagos, Nigeria',
        title: 'Fix our 3phase inverter pumping machine',
        comment: 'From the first consultation to the final touches, Refit delivered on every promise. Our home extension is exactly what we wanted.',
        images: ['https://placehold.co/60x65', 'https://placehold.co/60x65', 'https://placehold.co/60x65']
      },
      {
        id: 'r3',
        rating: 5,
        location: 'Lagos, Nigeria',
        title: 'Fix our 3phase inverter pumping machine',
        comment: 'From the first consultation to the final touches, Refit delivered on every promise. Our home extension is exactly what we wanted.',
        images: ['https://placehold.co/81x65', 'https://placehold.co/81x65', 'https://placehold.co/81x65']
      }
    ]
  },
  price: 45000,
  date: 'Today',
  time: '2:00 PM – 4:00 PM',
  address: '7 Bourdillon Road, Ikoyi, Lagos',
  eta: '20 - 30 mins',
  progress: [
    { label: 'Pro Matched', status: 'completed' },
    { label: 'On the way', status: 'completed' },
    { label: 'Arrived', status: 'completed' },
    { label: 'In progress', status: 'current' },
    { label: 'Completed', status: 'pending' },
  ]
}

export default function BookingDetailsPage() {
  const booking = MOCK_BOOKING_DETAILS // In real app, fetch by id

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Link 
        href="/bookings" 
        className="inline-flex items-center gap-1 text-zinc-600 hover:text-blue-700 transition-colors group"
      >
        <HiOutlineChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Bookings details</span>
      </Link>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <HiWrenchScrewdriver className="w-6 h-6 text-blue-700" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-neutral-700 text-lg font-semibold">{booking.category}</h2>
                <span className="text-zinc-500 text-[10px] font-medium px-2 py-0.5 bg-zinc-50 rounded">
                  JOB ID: {booking.referenceId}
                </span>
              </div>
              <p className="text-zinc-500 text-sm">{booking.description}</p>
            </div>
          </div>
          <div className="px-5 py-1.5 bg-orange-50 text-orange-500 rounded-full text-xs font-medium">
            {booking.status}
          </div>
        </div>

        {/* Progress Tracker Section */}
        <div className="py-6 border-t border-b border-zinc-50 flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src={booking.professional.avatar} 
              alt={booking.professional.name} 
              className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-gray-700 text-sm font-semibold">{booking.professional.name}</span>
              <div className="flex items-center gap-1">
                <HiOutlineStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-gray-700 text-xs font-semibold">{booking.professional.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-w-0 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
             {booking.progress && <BookingProgressTracker steps={booking.progress} />}
          </div>
        </div>

        {/* ETA Info */}
        <div className="flex items-center gap-2 text-neutral-700">
          <HiOutlineClock className="w-4 h-4 text-blue-700" />
          <span className="text-sm font-medium">ETA - {booking.eta}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-5 h-[520px] bg-stone-200 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-700/20 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 bg-blue-700 rounded-full border-4 border-white" />
                </div>
                <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-zinc-200">
                  <span className="text-xs font-semibold text-blue-700">Live Tracking</span>
                </div>
             </div>
          </div>
          {/* Custom Map UI element from Figma */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12">
             <div className="w-10 h-12 relative flex justify-center">
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                   <HiOutlineBriefcase className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 w-2 h-2 bg-blue-700 rotate-45 border-b border-r border-white" />
             </div>
          </div>
        </div>

        {/* Professional Profile & Reviews */}
        <div className="lg:col-span-7 bg-stone-50 rounded-2xl p-6 flex flex-col gap-8 border border-zinc-100">
          <div className="flex items-center gap-4">
            <img 
              src={booking.professional.avatar} 
              alt={booking.professional.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-neutral-700 text-lg font-bold">{booking.professional.name}</h3>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded">Pro Verified</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-xs">
                <div className="flex items-center gap-1">
                  <span>{booking.professional.specialty}</span>
                  <div className="w-1 h-1 bg-blue-700 rounded-full mx-1" />
                  <HiOutlineStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{booking.professional.rating} Rating</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-zinc-500 text-xs">
                <span className="flex items-center gap-1">
                  <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                  {booking.professional.distance}
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineBriefcase className="w-3.5 h-3.5" />
                  {booking.professional.jobsCompleted} Jobs completed
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-neutral-700 text-sm font-semibold">Professional&apos;s Review</h4>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2">
              {booking.professional.reviews?.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <Button variant="outline" className="flex-1 h-12 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl">
              <HiOutlinePhone className="w-5 h-5 mr-2" />
              Call Engineer
            </Button>
            <Button className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 rounded-xl">
              <HiOutlineChatAlt className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
