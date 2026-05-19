'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUserProfile } from '@/hooks/api-hooks'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: user } = useUserProfile()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Request desktop push notification permission on mount
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!user?.user?.id && !user?.id) return

    const userId = user?.user?.id || user?.id
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'https://resolvhome.onrender.com', {
      transports: ['websocket'],
      auth: { token },
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      // Identify this user to the server
      socketInstance.emit('join', userId)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('new_notification', (notification: any) => {
      console.log('🔔 New real-time notification received:', notification)
      // Invalidate notifications query
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })

      // Trigger desktop browser push notification if supported and granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title || 'New Notification', {
          body: notification.message,
          icon: '/logo.svg',
        })
      }

      // Show beautiful interactive sonner toast
      toast(notification.title || 'New Notification', {
        description: notification.message,
        action: notification.actionUrl ? {
          label: 'View',
          onClick: () => {
            window.location.href = notification.actionUrl
          }
        } : undefined,
        duration: 8000,
      })
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user?.user?.id, user?.id, queryClient])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
