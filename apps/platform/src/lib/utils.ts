import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  // Ensure we don't double slash
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  
  // If it's a relative path starting with /uploads, prepend the backend URL
  if (cleanUrl.startsWith('/uploads')) {
    return `${baseUrl}${cleanUrl}`
  }
  
  return url
}
