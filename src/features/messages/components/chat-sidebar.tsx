'use client'

import React from 'react'
import { HiOutlineSearch, HiOutlinePlusCircle } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { useUserChats } from '@/hooks/api-hooks'
import { useChatStore } from '@/store/use-chat-store'
import { formatDistanceToNow } from 'date-fns'

export const ChatSidebar = () => {
  const [isMounted, setIsMounted] = React.useState(false)
  const { data: chats, isLoading } = useUserChats()
  const { activeChatId, setActiveChatId } = useChatStore()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <div className="w-[458px] h-full bg-neutral-50 p-5">Loading chats...</div>
  }
  return (
    <div className="w-[458px] h-full flex flex-col bg-neutral-50 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
      {/* Header Tabs */}
      <div className="px-5 border-b border-zinc-300 flex items-center justify-between h-[58px] bg-white">
        <div className="flex items-center gap-1">
          {['Inbox', 'Unread', 'Request'].map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-2.5 py-2.5 text-sm font-medium transition-colors relative h-[58px] flex items-center",
                tab === 'Inbox' ? "text-blue-700 border-b-2 border-blue-700" : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <HiOutlinePlusCircle className="w-6 h-6 text-blue-700 cursor-pointer opacity-80 hover:opacity-100" />
      </div>

      {/* Search bar */}
      <div className="p-5">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search conversation"
            className="w-full h-12 pl-4 pr-11 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600" />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
        {(!chats || chats.length === 0) && (
          <div className="text-center py-10 text-zinc-500 text-sm">No conversations yet</div>
        )}
        {chats?.map((chat: any) => {
          const isActive = activeChatId === chat.id
          const otherUser = chat.engineer // Assuming client side for now, or check roles
          const lastMessage = chat.lastMessage

          return (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "px-2 py-3 flex gap-2 cursor-pointer transition-all duration-200",
                isActive ? "bg-indigo-50 rounded-xl shadow-sm" : "hover:bg-white/50 rounded-xl"
              )}
            >
              <div className="shrink-0 relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-indigo-50">
                  <img 
                    src={otherUser?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name || 'User'}`} 
                    alt={otherUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "text-base truncate",
                      isActive ? "text-neutral-700 font-medium" : "text-neutral-700 font-normal"
                    )}>
                      {otherUser?.name || 'Unknown User'}
                    </h4>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                      <span className="text-xs text-zinc-600 whitespace-nowrap">
                        {chat.updatedAt ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true }) : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    {chat.unreadCount > 0 && (
                      <div className="w-4 h-4 bg-rose-400 rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-neutral-700 font-medium">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-zinc-600 line-clamp-1 leading-5">
                  {lastMessage?.content || 'No messages yet'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
