'use client'

import React from 'react'
import { HiOutlineSearch, HiOutlinePlusCircle } from 'react-icons/hi'
import { cn } from "@resolve/ui"
import { useUserChats } from '@/hooks/api-hooks'
import { useChatStore } from '@/store/use-chat-store'
import { formatDistanceToNow } from 'date-fns'

export const ChatSidebar = () => {
  const [isMounted, setIsMounted] = React.useState(false)
  const { data: chats, isLoading } = useUserChats()
  const { activeChatId, setActiveChatId } = useChatStore()
  const [activeTab, setActiveTab] = React.useState('Inbox')

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return (
      <div className="w-full h-full bg-neutral-50 rounded-[20px] outline outline-1 outline-zinc-300 p-5 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading conversations...</div>
      </div>
    )
  }

  const filteredChats = chats?.filter((chat: any) => {
    if (activeTab === 'Unread') return chat.unreadCount > 0
    return true
  })

  return (
    <div className="w-full lg:w-[458px] h-full flex flex-col bg-neutral-50 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
      {/* Header Tabs */}
      <div className="px-5 border-b border-zinc-300 flex items-center justify-between bg-white relative z-10 shrink-0">
        <div className="flex items-center gap-1">
          {['Inbox', 'Unread', 'Request'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-4 text-sm font-medium transition-colors relative flex items-center",
                activeTab === tab ? "text-blue-700" : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="p-5 shrink-0">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search conversation"
            className="w-full h-12 pl-4 pr-11 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3 no-scrollbar">
        {(!filteredChats || filteredChats.length === 0) && (
          <div className="text-center py-10">
            <p className="text-zinc-500 text-sm">No {activeTab.toLowerCase()} conversations</p>
          </div>
        )}
        {filteredChats?.map((chat: any) => {
          const isActive = activeChatId === chat.id
          const otherUser = chat.otherParticipant || chat.otherUser || chat.engineer || chat.customer
          const lastMessage = chat.lastMessage

          return (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "px-3 py-4 flex gap-3 cursor-pointer transition-all duration-200 border border-transparent",
                isActive ? "bg-indigo-50 rounded-xl border-indigo-100" : "hover:bg-white rounded-xl"
              )}
            >
              <div className="shrink-0 relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-indigo-50 bg-white">
                  <img
                    src={otherUser?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name || chat.id}`}
                    alt={otherUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-0.5">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <h4 className="text-base font-medium text-neutral-700 truncate">
                      {otherUser?.name || 'User'}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                        {chat.updatedAt ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: false }) : 'just now'}
                      </span>
                    </div>
                  </div>

                  {chat.unreadCount > 0 && (
                    <div className="px-1.5 py-0.5 bg-rose-400 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-neutral-800 font-bold leading-none">{chat.unreadCount}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-500 line-clamp-1 leading-5">
                  {lastMessage?.message || lastMessage?.content || ''}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
