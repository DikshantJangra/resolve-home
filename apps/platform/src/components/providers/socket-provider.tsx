'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUserProfile } from '@/hooks/api-hooks'

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

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user?.user?.id, user?.id])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
