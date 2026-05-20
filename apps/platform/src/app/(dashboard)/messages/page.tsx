'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChatSidebar } from "@/features/messages/components/chat-sidebar"
import { ChatWindow } from "@/features/messages/components/chat-window"
import { ChatEmptyState } from "@/features/messages/components/chat-empty-state"
import { useUserChats } from '@/hooks/api-hooks'
import { useChatStore } from '@/store/use-chat-store'
import { cn } from "@resolve/ui"
import { useUserProfile } from '@/hooks/api-hooks'
import { HiOutlineArrowLeft } from 'react-icons/hi'

export default function MessagesPage() {
  const [mounted, setMounted] = React.useState(false)
  const { data: chats, isLoading } = useUserChats()
  const { data: userProfile, isLoading: isUserLoading } = useUserProfile()
  const { activeChatId, setActiveChatId } = useChatStore()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const tabParam = searchParams.get('tab')

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-select chat matching the bookingId from URL
  React.useEffect(() => {
    if (!bookingId || !chats?.length) return
    const match = chats.find((c: any) => c.bookingId === bookingId)
    if (match) setActiveChatId(match.id)
  }, [bookingId, chats, setActiveChatId])

  const isWorker = userProfile?.user?.role === 'worker'

  if (!mounted || isLoading || isUserLoading) {
    return (
      <div className="h-full bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="text-zinc-500 animate-pulse text-sm">Loading messages...</div>
      </div>
    )
  }

  const hasConversations = chats && chats.length > 0
  const showLoading = !mounted || isLoading

  return (
    <div className="h-[calc(100vh-130px)] lg:h-[calc(100vh-140px)] flex flex-col gap-4 md:gap-6 overflow-hidden">
      <div className="flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Messages</h1>
          {tabParam === 'Request' && (
            <Link
              href="/bookings"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-blue-700 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to Bookings
            </Link>
          )}
        </div>
        {tabParam === 'Request' && (
          <p className="text-zinc-500 text-sm">Waiting for confirmation from your Pro Partner.</p>
        )}
      </div>

      <div className="flex-1 flex gap-5 overflow-hidden relative min-h-0">
        {/* Sidebar: Visible on desktop, or on mobile when no chat is active */}
        <div className={cn(
          "w-full lg:w-[458px] h-full transition-all shrink-0",
          activeChatId ? "hidden lg:block" : "block"
        )}>
          <ChatSidebar initialTab={tabParam || undefined} />
        </div>

        {/* Main Content: Visible on desktop, or on mobile when a chat is active */}
        <div className={cn(
          "flex-1 h-full transition-all",
          !activeChatId ? "hidden lg:block" : "block"
        )}>
          {showLoading ? (
            <div className="h-full bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden flex items-center justify-center">
              <div className="text-zinc-500 animate-pulse text-sm">Loading messages...</div>
            </div>
          ) : activeChatId ? (
            <ChatWindow onBack={() => setActiveChatId(null)} />
          ) : (
            <div className="h-full bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden flex items-center justify-center">
              <ChatEmptyState />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
