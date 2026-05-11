import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  
  if (cleanUrl.startsWith('/uploads')) {
    return `${baseUrl}${cleanUrl}`
  }
  
  return url
}
