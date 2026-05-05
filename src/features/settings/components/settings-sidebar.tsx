'use client'

import React from 'react'
import { 
  HiOutlineUser, 
  HiOutlineShieldCheck, 
  HiOutlineBell, 
  HiOutlineSupport, 
  HiOutlineLogout,
  HiChevronRight
} from 'react-icons/hi'
import { cn } from '@/lib/utils'

const settingsItems = [
  { label: 'Account', icon: HiOutlineUser, id: 'account' },
  { label: 'Security', icon: HiOutlineShieldCheck, id: 'security' },
  { label: 'Notifications', icon: HiOutlineBell, id: 'notifications' },
  { label: 'Help & Support', icon: HiOutlineSupport, id: 'help' },
]

interface SettingsSidebarProps {
  activeSection: string
  onSectionChange: (id: string) => void
}

export const SettingsSidebar = ({ activeSection, onSectionChange }: SettingsSidebarProps) => {
  return (
    <div className="w-[280px] py-5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col gap-2 h-fit">
      {settingsItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id

        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "self-stretch h-12 px-4 py-3 flex justify-between items-center transition-all border-l-[3px]",
              isActive 
                ? "bg-blue-50 border-blue-700 text-blue-700 font-bold" 
                : "border-transparent text-zinc-600 font-medium hover:bg-stone-100"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={cn("w-5 h-5", isActive ? "text-blue-700" : "text-zinc-600")} />
              <span className="text-xs leading-5 uppercase tracking-wide">{item.label}</span>
            </div>
            <HiChevronRight className={cn("w-5 h-5", isActive ? "text-blue-700" : "text-zinc-300")} />
          </button>
        )
      })}
      
      <button className="self-stretch h-11 px-4 py-3 flex justify-start items-center gap-2.5 text-red-600 hover:bg-red-50 transition-colors mt-2">
        <HiOutlineLogout className="w-5 h-5" />
        <span className="text-xs font-medium uppercase tracking-wide">Log out</span>
      </button>
    </div>
  )
}
