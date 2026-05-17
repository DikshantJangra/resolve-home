'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  HiOutlineDotsHorizontal, 
  HiOutlinePlus, 
  HiOutlineBriefcase, 
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamationCircle
} from 'react-icons/hi'
import { cn, LoadingSpinner, formatImageUrl } from "@resolve/ui"
import { MessageActions } from './message-actions'
import { QuotationModal } from './quotation-modal'
import { 
  useChatMessages, 
  useUserProfile, 
  useUserChats, 
  useUploadFile, 
  useMarkChatRead,
  useAcceptJob,
  useRejectJob,
  useCancelBooking
} from '@/hooks/api-hooks'
import { useSocket } from '@/components/providers/socket-provider'
import { useChatStore } from '@/store/use-chat-store'
import { format } from 'date-fns'
import { Button } from "@resolve/ui"
import { IoArrowBack } from 'react-icons/io5'
import { ServiceQuotation } from './service-quotation'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ChatWindowProps {
  onBack?: () => void
}

export const ChatWindow = ({ onBack }: ChatWindowProps) => {
  const router = useRouter()
  const [showActions, setShowActions] = useState(false)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { mutateAsync: uploadFile } = useUploadFile()

  const { activeChatId } = useChatStore()
  const { data: initialMessages, isLoading } = useChatMessages(activeChatId || '')
  const [messages, setMessages] = useState<any[]>([])
  const { socket } = useSocket()
  const { data: userProfile } = useUserProfile()
  const { data: chats } = useUserChats()
  const { mutate: markRead } = useMarkChatRead()
  const user = userProfile?.user
  const scrollRef = useRef<HTMLDivElement>(null)

  const { mutate: acceptJob, isPending: isAccepting } = useAcceptJob()
  const { mutate: rejectJob, isPending: isRejecting } = useRejectJob()
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()

  const isEngineer = user?.role === 'worker'

  const activeChat = chats?.find((c: any) => c.id === activeChatId)
  const otherUser = activeChat?.otherParticipant || activeChat?.otherUser
  const booking = activeChat?.booking

  const handleAcceptBooking = () => {
    if (!booking?.id) return
    acceptJob(booking.id, {
      onSuccess: () => {
        toast.success("Booking request accepted!")
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.error || err?.message || "Failed to accept booking"
        toast.error(errMsg)
      }
    })
  }

  const handleDeclineBooking = () => {
    if (!booking?.id) return
    rejectJob(booking.id, {
      onSuccess: () => {
        toast.success("Booking request declined!")
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.error || err?.message || "Failed to decline booking"
        toast.error(errMsg)
      }
    })
  }

  const handleCancelBooking = () => {
    if (!booking?.id) return
    cancelBooking(booking.id, {
      onSuccess: () => {
        toast.success("Booking request cancelled successfully!")
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.error || err?.message || "Failed to cancel booking"
        toast.error(errMsg)
      }
    })
  }

  // Load initial messages
  useEffect(() => {
    if (initialMessages) setMessages(initialMessages)
  }, [initialMessages])

  // Mark as read whenever active chat changes
  useEffect(() => {
    if (activeChatId) markRead(activeChatId)
  }, [activeChatId])

  // Join chat room + listen for events when activeChatId changes
  useEffect(() => {
    if (!socket || !activeChatId) return

    socket.emit('join_chat', activeChatId)
    // Mark messages as read when opening the chat
    markRead(activeChatId)

    const handleNewMessage = (message: any) => {
      if (message.chatId === activeChatId) {
        setMessages((prev) => {
          // Remove matching optimistic message (same senderId + message content sent within 5s)
          const now = Date.now()
          const filtered = prev.filter((m) => {
            if (!m._tempId) return true
            const isMatch = m.senderId === message.senderId &&
              m.message === message.message &&
              Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000
            return !isMatch
          })
          return [...filtered, message]
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

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    setIsTyping(false)
    socket.emit('stop_typing', { chatId: activeChatId })

    const tempId = `temp-${Date.now()}`
    const optimistic = {
      _tempId: tempId,
      chatId: activeChatId,
      message: inputMessage,
      senderId: user?.id,
      createdAt: new Date().toISOString(),
      mediaType: 'text',
    }

    setMessages((prev) => [...prev, optimistic])
    socket.emit('send_message', { chatId: activeChatId, message: inputMessage, mediaType: 'text' })
    setInputMessage('')
  }

  const handleFileClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !socket || !activeChatId) return

    setIsUploading(true)
    try {
      const url = await uploadFile(file)
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      const mediaType = isImage ? 'image' : isVideo ? 'video' : 'image'

      const tempId = `temp-${Date.now()}`
      const optimistic = {
        _tempId: tempId,
        chatId: activeChatId,
        message: file.name,
        mediaType,
        mediaUrl: url,
        senderId: user?.id,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, optimistic])
      socket.emit('send_message', { chatId: activeChatId, message: file.name, mediaType, mediaUrl: url })
    } catch {
      // toast handled by apiClient interceptor
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
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
        <LoadingSpinner className="w-6 h-6 text-blue-700" />
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
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-indigo-50 overflow-hidden shrink-0 bg-white">
            <img
              src={otherUser?.image ? formatImageUrl(otherUser.image) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(otherUser?.name || 'user')}`}
              alt={otherUser?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-medium text-neutral-700">{otherUser?.name || 'User'}</h3>
            <p className="text-xs text-zinc-500">
              {otherTyping
                ? <span className="text-blue-600 animate-pulse">typing...</span>
                : otherUser?.email || 'Booking chat'}
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
          <div className="w-full p-5 bg-white rounded-2xl border border-zinc-200 flex flex-col gap-4 shadow-sm max-w-md relative overflow-hidden">
            {/* Top Info Bar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 shrink-0 border border-blue-100">
                <HiOutlineBriefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-zinc-800 font-semibold text-sm truncate">
                  {booking.service?.name || "Service Request"}
                </span>
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                  Booking #{booking.id ? booking.id.substring(0, 8) : "Pending"}
                </span>
              </div>
              <span className={cn(
                "ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 font-['Inter'] leading-none",
                booking.status === 'awaiting_engineer' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  booking.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                  booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                  'bg-blue-50 text-blue-600 border border-blue-100'
              )}>
                {booking.status?.replace('_', ' ')}
              </span>
            </div>

            {/* Issue and Schedule details */}
            <div className="flex flex-col gap-2.5 py-1 border-t border-b border-zinc-100 my-0.5">
              {booking.issueDetails && (
                <p className="text-zinc-600 text-xs font-normal font-['Inter'] leading-relaxed line-clamp-2">
                  <span className="font-semibold text-zinc-700">Details: </span>
                  {booking.issueDetails}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-zinc-500 text-xs font-medium font-['Inter']">
                {booking.scheduledDate && (
                  <div className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="w-4 h-4 text-zinc-400" />
                    <span>{booking.scheduledDate}</span>
                  </div>
                )}
                {booking.scheduledTime && (
                  <div className="flex items-center gap-1.5">
                    <HiOutlineClock className="w-4 h-4 text-zinc-400" />
                    <span>{booking.scheduledTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Conditional Action Buttons or Status Prompts */}
            {booking.status === 'awaiting_engineer' ? (
              isEngineer ? (
                /* Worker Action Buttons */
                <div className="flex flex-col gap-2.5">
                  <p className="text-zinc-500 text-[11px] font-normal leading-4 font-['Inter']">
                    The customer has selected you for this service. Please confirm if you can complete this job.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-9 text-xs border-zinc-200 text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl font-semibold transition-all shadow-none shrink-0"
                      onClick={handleDeclineBooking}
                      disabled={isRejecting || isAccepting}
                    >
                      {isRejecting ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <LoadingSpinner className="w-3.5 h-3.5" />
                          Declining...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <HiOutlineX className="w-3.5 h-3.5" />
                          Decline Request
                        </span>
                      )}
                    </Button>
                    <Button
                      className="flex-1 h-9 text-xs bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-all shadow-none shrink-0"
                      onClick={handleAcceptBooking}
                      disabled={isAccepting || isRejecting}
                    >
                      {isAccepting ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <LoadingSpinner className="w-3.5 h-3.5 text-white" />
                          Accepting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <HiOutlineCheck className="w-3.5 h-3.5" />
                          Accept Request
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Customer Pending Box */
                <div className="flex flex-col gap-3">
                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mt-1.5 shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-zinc-700 text-xs font-semibold">Awaiting Professional's Confirmation</span>
                      <span className="text-zinc-500 text-[11px] leading-relaxed">
                        We have notified {otherUser?.name || "the professional"}. They can accept or decline this request.
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-9 text-xs border-zinc-200 text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl font-medium transition-all shadow-none"
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <LoadingSpinner className="w-3.5 h-3.5" />
                        Cancelling Booking...
                      </span>
                    ) : (
                      "Cancel Booking Request"
                    )}
                  </Button>
                </div>
              )
            ) : booking.status === 'confirmed' ? (
              /* Confirmed Status message */
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5">
                <HiOutlineCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-700 text-xs font-semibold">Booking Confirmed</span>
                  <span className="text-zinc-500 text-[11px] leading-relaxed">
                    {isEngineer 
                      ? "You have accepted this booking request. You can now prepare a service quotation." 
                      : `${otherUser?.name || "The professional"} has accepted your booking request.`}
                  </span>
                </div>
              </div>
            ) : booking.status === 'cancelled' ? (
              /* Cancelled Status message */
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-start gap-2.5">
                <HiOutlineExclamationCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-600 text-xs font-semibold">Booking Request Cancelled</span>
                  <span className="text-zinc-500 text-[11px] leading-relaxed">
                    This booking request was cancelled.
                  </span>
                </div>
              </div>
            ) : booking.status === 'pending' ? (
              /* Declined Status / Re-selection box */
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <HiOutlineX className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-red-900 text-xs font-semibold">Booking Request Declined</span>
                    <span className="text-zinc-500 text-[11px] leading-relaxed">
                      {booking.rejectionReason || "The professional was unable to accept this booking request."} Please select another professional partner to complete your service.
                    </span>
                  </div>
                </div>
                {!isEngineer && (
                  <Button
                    className="w-full h-9 text-xs bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-all shadow-none mt-1"
                    onClick={() => router.push(`/bookings/${booking.id}`)}
                  >
                    Select Another Professional
                  </Button>
                )}
              </div>
            ) : null}
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
                "max-w-[80%] rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden",
                isMe ? "bg-blue-700 text-white rounded-br-none" : "bg-white text-zinc-700 rounded-bl-none border border-zinc-100"
              )}>
                {msg.mediaType === 'image' && msg.mediaUrl && (
                  <a href={msg.mediaUrl} target="_blank" rel="noreferrer">
                    <img src={msg.mediaUrl} alt="attachment" className="max-w-[240px] w-full object-cover rounded-t-2xl" />
                  </a>
                )}
                {msg.mediaType === 'video' && msg.mediaUrl && (
                  <video src={msg.mediaUrl} controls className="max-w-[240px] w-full" />
                )}
                {msg.mediaType !== 'image' && msg.mediaType !== 'video' && msg.mediaUrl && (
                  <a href={msg.mediaUrl} target="_blank" rel="noreferrer"
                    className={cn("flex items-center gap-2 px-3.5 py-2.5 text-xs underline", isMe ? "text-blue-100" : "text-blue-700")}>
                    📎 {msg.message || 'Attachment'}
                  </a>
                )}
                {(msg.message || msg.content) && msg.mediaType !== 'image' && msg.mediaType !== 'video' && !msg.mediaUrl && (
                  <p className="whitespace-pre-wrap px-3.5 py-2.5">
                    {msg.message || msg.content}
                  </p>
                )}
                {msg.mediaType === 'image' && msg.mediaUrl && (msg.message || msg.content) && msg.message !== msg.mediaUrl && (
                  <p className="whitespace-pre-wrap px-3.5 py-1 text-xs opacity-80">{msg.message || msg.content}</p>
                )}
                <p className={cn("text-[10px] px-3.5 pb-2 opacity-60", isMe ? "text-right" : "text-left")}>
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={handleFileClick}
          disabled={isUploading}
          className="p-2 bg-stone-50 rounded-lg text-zinc-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
          title="Attach file"
        >
          {isUploading ? (
            <LoadingSpinner className="w-5 h-5 text-zinc-400" />
          ) : (
            <HiOutlinePlus className="w-5 h-5" />
          )}
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
