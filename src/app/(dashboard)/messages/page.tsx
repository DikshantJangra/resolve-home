'use client'

import React, { useState } from 'react'
import { ChatSidebar } from "@/features/messages/components/chat-sidebar"
import { ChatWindow } from "@/features/messages/components/chat-window"
import { ChatEmptyState } from "@/features/messages/components/chat-empty-state"
import { useUserChats } from '@/hooks/api-hooks'
import { useChatStore } from '@/store/use-chat-store'
import { cn } from '@/lib/utils'

export default function MessagesPage() {
  const [mounted, setMounted] = React.useState(false)
  const { data: chats, isLoading } = useUserChats()
  const { activeChatId, setActiveChatId } = useChatStore()
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const hasConversations = chats && chats.length > 0
  const showLoading = !mounted || isLoading

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Messages</h1>
      </div>
      
      <div className="flex-1 flex gap-5 overflow-hidden relative">
        {/* Sidebar: Visible on desktop, or on mobile when no chat is active */}
        <div className={cn(
          "w-full lg:w-[458px] h-full transition-all shrink-0",
          activeChatId ? "hidden lg:block" : "block"
        )}>
          <ChatSidebar />
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
