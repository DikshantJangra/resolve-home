'use client'

import React, { useState } from 'react'
import { ChatSidebar } from "@/features/messages/components/chat-sidebar"
import { ChatWindow } from "@/features/messages/components/chat-window"
import { ChatEmptyState } from "@/features/messages/components/chat-empty-state"

export default function MessagesPage() {
  // Mock state to toggle empty state for demonstration
  const [conversations] = useState([]) // Set to [] to show empty state

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Messages</h1>
      </div>
      
      <div className="flex-1 flex gap-5 overflow-hidden">
        {/* Sidebar always visible for navigation/search */}
        <ChatSidebar />
        
        {/* Main Content: Either the chat window or the empty state */}
        {conversations.length > 0 ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden flex items-center justify-center">
             <ChatEmptyState />
          </div>
        )}
      </div>
    </div>
  )
}
