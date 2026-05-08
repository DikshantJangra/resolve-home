'use client'

import React, { useState, useEffect, useRef } from 'react'
import { HiOutlineDotsHorizontal, HiOutlinePlus, HiOutlineSearch, HiOutlineBriefcase, HiOutlineLocationMarker, HiChevronRight } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { MessageActions } from './message-actions'
import { QuotationModal } from './quotation-modal'
import { useChatMessages, useUserProfile } from '@/hooks/api-hooks'
import { useSocket } from '@/components/providers/socket-provider'
import { useChatStore } from '@/store/use-chat-store'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { IoArrowBack } from 'react-icons/io5'

interface ChatWindowProps {
  onBack?: () => void
}

export const ChatWindow = ({ onBack }: ChatWindowProps) => {
  const [showActions, setShowActions] = useState(false)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const { activeChatId } = useChatStore()
  const { data: initialMessages, isLoading } = useChatMessages(activeChatId || '')
  const [messages, setMessages] = useState<any[]>([])
  const { socket } = useSocket()
  const { data: user } = useUserProfile()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages)
    }
  }, [initialMessages])

  useEffect(() => {
    if (!socket || !activeChatId) return

    const handleNewMessage = (message: any) => {
      if (message.chatId === activeChatId) {
        setMessages((prev) => [...prev, message])
      }
    }

    socket.on('receive_message', handleNewMessage)

    return () => {
      socket.off('receive_message', handleNewMessage)
    }
  }, [socket, activeChatId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket || !activeChatId) return

    const messageData = {
      chatId: activeChatId,
      content: inputMessage,
      senderId: user?.id,
      timestamp: new Date().toISOString(),
    }

    socket.emit('send_message', messageData)
    setMessages((prev) => [...prev, messageData])
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
        <p className="text-zinc-500">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-neutral-50 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden relative">
      {/* Header */}
      <div className="h-20 p-4 md:p-5 bg-stone-50 border-b border-zinc-300 flex items-center gap-2 relative z-10">
        <div className="flex-1 flex items-center gap-2 md:gap-3">
          {/* Mobile Back Button */}
          <button 
            onClick={onBack}
            className="lg:hidden p-1 -ml-1 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>

          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-indigo-50 overflow-hidden relative shrink-0">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel`} 
              alt="Samuel"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-neutral-700">Engineer</h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-xs text-zinc-600 leading-4">Online</span>
              </div>
            </div>
            <div className="text-sm font-normal text-zinc-600 line-clamp-1">
              Booking ID: <span className="text-blue-700">{activeChatId.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowActions(!showActions)}
            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <HiOutlineDotsHorizontal className="w-5 h-5" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 z-20">
              <MessageActions 
                onMakeQuotation={() => {
                  setShowQuotationModal(true)
                  setShowActions(false)
                }}
                onFlagMessage={() => {
                  setShowActions(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 pb-24 space-y-4"
      >
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user?.id
          return (
            <div key={idx} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                isMe ? "bg-blue-700 text-white rounded-br-none" : "bg-white text-zinc-700 rounded-bl-none border border-zinc-100"
              )}>
                <p>{msg.content}</p>
                <p className={cn("text-[10px] mt-1.5 opacity-60", isMe ? "text-right" : "text-left")}>
                  {format(new Date(msg.timestamp || Date.now()), 'HH:mm')}
                </p>
              </div>
            </div>
          )
        })}
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
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message here"
            className="w-full bg-transparent text-zinc-800 text-sm font-normal outline-none placeholder:text-zinc-400"
          />
        </div>
        <Button 
          onClick={handleSendMessage}
          className="h-11 bg-blue-700 hover:bg-blue-800 text-white px-6 rounded-xl"
        >
          Send
        </Button>
      </div>

      {/* Modals */}
      <QuotationModal 
        isOpen={showQuotationModal} 
        onClose={() => setShowQuotationModal(false)} 
      />
    </div>
  )
}
