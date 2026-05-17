'use client'

import React, { useState, useEffect, useRef } from 'react'
import { HiOutlineDotsHorizontal, HiOutlinePlus, HiOutlineBriefcase, HiOutlineLocationMarker } from 'react-icons/hi'
import { cn } from "@resolve/ui"
import { MessageActions } from './message-actions'
import { QuotationModal } from './quotation-modal'
import { useChatMessages, useUserProfile, useUserChats } from '@/hooks/api-hooks'
import { useSocket } from '@/components/providers/socket-provider'
import { useChatStore } from '@/store/use-chat-store'
import { format } from 'date-fns'
import { Button } from "@resolve/ui"
import { IoArrowBack } from 'react-icons/io5'
import { ServiceQuotation } from './service-quotation'

interface ChatWindowProps {
  onBack?: () => void
}

export const ChatWindow = ({ onBack }: ChatWindowProps) => {
  const [showActions, setShowActions] = useState(false)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { activeChatId } = useChatStore()
  const { data: initialMessages, isLoading } = useChatMessages(activeChatId || '')
  const [messages, setMessages] = useState<any[]>([])
  const { socket } = useSocket()
  const { data: userProfile } = useUserProfile()
  const { data: chats } = useUserChats()
  const user = userProfile?.user
  const scrollRef = useRef<HTMLDivElement>(null)

  const isEngineer = user?.role === 'worker'

  const activeChat = chats?.find((c: any) => c.id === activeChatId)
  const otherUser = activeChat?.otherParticipant || activeChat?.otherUser
  const booking = activeChat?.booking

  // Load initial messages
  useEffect(() => {
    if (initialMessages) setMessages(initialMessages)
  }, [initialMessages])

  // Join chat room + listen for events when activeChatId changes
  useEffect(() => {
    if (!socket || !activeChatId) return

    socket.emit('join_chat', activeChatId)

    const handleNewMessage = (message: any) => {
      if (message.chatId === activeChatId) {
        setMessages((prev) => {
          // Avoid duplicates (optimistic update already added it)
          const exists = prev.some((m) => m.id && m.id === message.id)
          return exists ? prev : [...prev, message]
        })
      }
    }

    const handleUserTyping = ({ chatId, userId }: any) => {
      if (chatId === activeChatId && userId !== user?.id) setOtherTyping(true)
    }

    const handleUserStoppedTyping = ({ chatId, userId }: any) => {
      if (chatId === activeChatId && userId !== user?.id) setOtherTyping(false)
    }

    socket.on('receive_message', handleNewMessage)
    socket.on('user_typing', handleUserTyping)
    socket.on('user_stopped_typing', handleUserStoppedTyping)

    return () => {
      socket.off('receive_message', handleNewMessage)
      socket.off('user_typing', handleUserTyping)
      socket.off('user_stopped_typing', handleUserStoppedTyping)
    }
  }, [socket, activeChatId, user?.id])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, otherTyping])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
    if (!socket || !activeChatId) return

    if (!isTyping) {
      setIsTyping(true)
      socket.emit('typing', { chatId: activeChatId })
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit('stop_typing', { chatId: activeChatId })
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket || !activeChatId) return

    // Stop typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    setIsTyping(false)
    socket.emit('stop_typing', { chatId: activeChatId })

    const optimistic = {
      chatId: activeChatId,
      message: inputMessage,
      senderId: user?.id,
      createdAt: new Date().toISOString(),
      mediaType: 'text',
    }

    socket.emit('send_message', { chatId: activeChatId, message: inputMessage, mediaType: 'text' })
    setMessages((prev) => [...prev, optimistic])
    setInputMessage('')
  }

  if (!activeChatId) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-neutral-50 rounded-[20px] outline outline-1 outline-zinc-300">
        <p className="text-zinc-500">Select a conversation to start chatting</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-neutral-50 rounded-[20px] outline outline-1 outline-zinc-300">
        <div className="w-6 h-6 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-neutral-50 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden relative">
      {/* Header */}
      <div className="h-20 p-4 md:p-5 bg-stone-50 border-b border-zinc-300 flex items-center gap-2 relative z-10">
        <div className="flex-1 flex items-center gap-2 md:gap-3">
          <button onClick={onBack} className="lg:hidden p-1 -ml-1 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
            <IoArrowBack className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-indigo-50 overflow-hidden shrink-0">
            <img
              src={otherUser?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name || 'user'}`}
              alt={otherUser?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-medium text-neutral-700">{otherUser?.name || 'User'}</h3>
            <p className="text-xs text-zinc-500">
              {otherTyping ? <span className="text-blue-600 animate-pulse">typing...</span> : 'Booking chat'}
            </p>
          </div>
        </div>

        {isEngineer && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
            >
              <HiOutlineDotsHorizontal className="w-5 h-5" />
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 z-20">
                <MessageActions
                  onMakeQuotation={() => { setShowQuotationModal(true); setShowActions(false) }}
                  onFlagMessage={() => setShowActions(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 pb-24 space-y-4">
        {/* Booking summary card — show real data if available */}
        {booking && (
          <div className="w-full p-4 bg-white rounded-xl border border-zinc-100 flex flex-col gap-3 shadow-sm max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700">
                <HiOutlineBriefcase className="w-4 h-4" />
              </div>
              <span className="text-zinc-700 font-semibold text-sm">Booking Request</span>
              <span className={cn(
                "ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                booking.status === 'awaiting_engineer' ? 'bg-amber-50 text-amber-600' :
                  booking.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
              )}>
                {booking.status?.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user?.id
          if (msg.mediaType === 'quotation' || msg.type === 'quotation') {
            return (
              <div key={idx} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                <ServiceQuotation quotation={msg.quotation || msg.metadata} isMe={isMe} />
              </div>
            )
          }
          return (
            <div key={idx} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                isMe ? "bg-blue-700 text-white rounded-br-none" : "bg-white text-zinc-700 rounded-bl-none border border-zinc-100"
              )}>
                <p className="whitespace-pre-wrap">{msg.message || msg.content}</p>
                <p className={cn("text-[10px] mt-1 opacity-60", isMe ? "text-right" : "text-left")}>
                  {format(new Date(msg.createdAt || msg.timestamp || Date.now()), 'HH:mm')}
                </p>
              </div>
            </div>
          )
        })}

        {otherTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 shadow-sm">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full h-20 p-5 bg-white border-t border-zinc-100 flex items-center gap-2">
        <button className="p-2 bg-stone-50 rounded-lg text-zinc-600 hover:bg-stone-100 transition-colors">
          <HiOutlinePlus className="w-5 h-5" />
        </button>
        <div className="flex-1 h-11 px-4 bg-stone-50 rounded-xl flex items-center overflow-hidden">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message here"
            className="w-full bg-transparent text-zinc-800 text-sm outline-none placeholder:text-zinc-400"
          />
        </div>
        <Button onClick={handleSendMessage} className="h-11 bg-blue-700 hover:bg-blue-800 text-white px-6 rounded-xl">
          Send
        </Button>
      </div>

      <QuotationModal isOpen={showQuotationModal} onClose={() => setShowQuotationModal(false)} bookingId={activeChatId} />
    </div>
  )
}
