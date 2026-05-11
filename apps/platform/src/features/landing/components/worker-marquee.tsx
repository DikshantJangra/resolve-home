'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin, Briefcase, Calendar, Navigation } from 'lucide-react';
import { cn } from "@resolve/ui";
import { Skeleton } from "@resolve/ui"
interface Worker {
  name: string;
  role: string;
  specialty: string;
  rating: number;
  jobs: string;
  location: string;
  todayJobs: string;
  distance: string;
  status: string;
  statusColor: string;
  image: string;
}

const workers: Worker[] = [
  {
    name: "Ngozi F.",
    role: "Plumber",
    specialty: "Emergency Leaks",
    rating: 4.6,
    jobs: "75+",
    location: "Yaba",
    todayJobs: "2 jobs today",
    distance: "5.2 km",
    status: "On the way · 25 min",
    statusColor: "bg-[#1A56DB]",
    image: "/assets/workers/ngozi.png"
  },
  {
    name: "James A.",
    role: "Plumber",
    specialty: "Pipes & Drains",
    rating: 4.9,
    jobs: "143+",
    location: "Lagos Island",
    todayJobs: "2 jobs today",
    distance: "2.3 km",
    status: "Available now",
    statusColor: "bg-[#10B981]",
    image: "/assets/workers/james.png"
  },
  {
    name: "Amaka O.",
    role: "Electrician",
    specialty: "Wiring & DB",
    rating: 4.8,
    jobs: "98+",
    location: "Lekki Phase 1",
    todayJobs: "3 jobs today",
    distance: "4.1 km",
    status: "Available now",
    statusColor: "bg-[#10B981]",
    image: "/assets/workers/amaka.png"
  },
  {
    name: "Kunle B.",
    role: "Heating Engineer",
    specialty: "AC & Boilers",
    rating: 4.7,
    jobs: "211+",
    location: "Victoria Island",
    todayJobs: "1 jobs today",
    distance: "1.8 km",
    status: "Available now",
    statusColor: "bg-[#10B981]",
    image: "/assets/workers/kunle.png"
  },
  {
    name: "Tunde M.",
    role: "General Contractor",
    specialty: "Full Repairs",
    rating: 4.9,
    jobs: "327+",
    location: "Ikoyi",
    todayJobs: "4 jobs today",
    distance: "3.7 km",
    status: "Available now",
    statusColor: "bg-[#10B981]",
    image: "/assets/workers/tunde.png"
  }
];

const WorkerCard = ({ worker }: { worker: Worker }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group relative w-[280px] shrink-0 overflow-hidden rounded-[24px] border border-stone-200 bg-white p-1 transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5">
      <div className="relative h-[200px] w-full overflow-hidden rounded-[20px]">
        {isLoading && !hasError && (
          <Skeleton className="absolute inset-0 z-10 size-full rounded-none" />
        )}
        
        {!hasError ? (
          <Image
            src={worker.image}
            alt={worker.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            sizes="(max-width: 768px) 100vw, 280px"
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <span className="text-4xl font-bold text-blue-200">{worker.name[0]}</span>
          </div>
        )}

        {/* Status Badge */}
        <div className={cn(
          "absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md",
          worker.statusColor
        )}>
          <div className="size-1.5 rounded-full bg-white animate-pulse" />
          {worker.status}
        </div>

        {/* Rating Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-stone-200/60 bg-white/90 px-2 py-1 shadow-sm backdrop-blur-md">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-stone-800">{worker.rating}</span>
        </div>
      </div>

      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-stone-900">{worker.name}</h3>
          <span className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
            worker.role === "Plumber" ? "bg-red-50 text-red-600" :
            worker.role === "Electrician" ? "bg-amber-50 text-amber-600" :
            worker.role === "Heating Engineer" ? "bg-emerald-50 text-emerald-600" :
            "bg-violet-50 text-violet-600"
          )}>
            {worker.role}
          </span>
        </div>
        <p className="mt-1 text-[12px] text-stone-400">{worker.specialty}</p>

        <div className="mt-4 grid grid-cols-2 gap-y-2 border-t border-stone-100 pt-3">
          <div className="flex items-center gap-1.5">
            <Briefcase className="size-3.5 text-stone-400" />
            <span className="text-[11px] font-medium text-stone-600">{worker.jobs} jobs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-stone-400" />
            <span className="text-[11px] font-medium text-stone-600">{worker.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-stone-400" />
            <span className="text-[11px] font-medium text-stone-400">{worker.todayJobs}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Navigation className="size-3.5 text-stone-400" />
            <span className="text-[11px] font-medium text-stone-400">{worker.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkerMarquee = () => {
  return (
    <div className="relative mt-20 w-full overflow-hidden">
      {/* Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-40 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-40 bg-gradient-to-l from-white to-transparent" />
      
      <motion.div 
        className="flex gap-6"
        animate={{
          x: [0, -1520], // Adjusted for card width + gap
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Render twice for seamless loop */}
        {[...workers, ...workers, ...workers].map((worker, idx) => (
          <WorkerCard key={`${worker.name}-${idx}`} worker={worker} />
        ))}
      </motion.div>
    </div>
  );
};
