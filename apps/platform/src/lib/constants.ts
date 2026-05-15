export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resolve-home.vercel.app'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://resolvhome.onrender.com'

export const getAvatarUrl = (name?: string | null, image?: string | null): string => {
  if (image) return image
  return `${APP_URL}/api/avatar?seed=${encodeURIComponent(name || 'User')}`
}

export const getDicebearUrl = (seed?: string | null): string =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'User')}`
