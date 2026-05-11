'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from "./skeleton";
import { cn } from "../utils";

interface FigmaImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackInitial?: string;
  fallbackIcon?: React.ReactNode;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export const FigmaImage = ({ 
  src, 
  alt, 
  className, 
  fallbackInitial, 
  fallbackIcon, 
  fill = true, 
  sizes,
  style 
}: FigmaImageProps) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      {isLoading && !error && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full bg-slate-200/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>
      )}
      
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          className={cn(
            "object-cover transition-all duration-500",
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
          {fallbackInitial ? (
            <span className="font-bold text-lg">{fallbackInitial}</span>
          ) : (
            fallbackIcon || null
          )}
        </div>
      )}
    </div>
  );
};
