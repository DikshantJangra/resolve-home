'use client'

import React, { useState, useEffect } from 'react'
import { 
  HiOutlineUser, 
  HiOutlineUserGroup, 
  HiOutlineBell, 
  HiOutlineLockClosed,
  HiOutlineCamera,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineSearch,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineKey,
  HiOutlineCreditCard,
  HiOutlinePencil,
  HiOutlineAnnotation
} from 'react-icons/hi'
import { cn, Button, Input, Label, Skeleton, formatImageUrl } from "@resolve/ui"
import { 
  useUserProfile, 
  useUpdateProfile, 
  useUpdatePassword, 
  useUploadFile, 
  useAdminUsers,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useAdminWalletTransactions
} from '@/hooks/api-hooks'
import { toast } from 'sonner'

type TabType = 'profile' | 'team' | 'notifications' | 'security'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const { data: team, isLoading: teamLoading } = useAdminUsers()
  const { data: notifSettings, isLoading: notifLoading } = useNotificationSettings()
  const { data: transactions, isLoading: transactionsLoading } = useAdminWalletTransactions()

  const updateProfile = useUpdateProfile()
  const updatePassword = useUpdatePassword()
  const uploadFile = useUploadFile()
  const updateNotifSettings = useUpdateNotificationSettings()

  // Profile Form State
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  })

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        avatar: profile.avatar || ''
      })
    }
  }, [profile])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync(profileData)
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (err: any) {
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await updatePassword.mutateAsync({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password updated successfully')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const uploadRes = await uploadFile.mutateAsync(file)
      const url = uploadRes.url || uploadRes
      setProfileData(prev => ({ ...prev, avatar: url }))
      toast.success('Avatar uploaded')
    } catch (err) {
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="flex flex-col gap-8">
            <ProfileTab 
              profile={profile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              data={profileData} 
              setData={setProfileData} 
              onSubmit={handleProfileUpdate} 
              onAvatarUpload={handleAvatarUpload}
              isPending={updateProfile.isPending}
              loading={profileLoading}
            />
            {!isEditing && <RecentActivityTable transactions={transactions} loading={transactionsLoading} />}
          </div>
        )
      case 'team':
        return <TeamTab team={team} loading={teamLoading} />
      case 'notifications':
        return <NotificationsTab settings={notifSettings} updateSettings={updateNotifSettings} loading={notifLoading} />
      case 'security':
        return <SecurityTab 
          data={passwordData} 
          setData={setPasswordData} 
          onSubmit={handlePasswordUpdate}
          isPending={updatePassword.isPending}
        />
    }
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Platform Settings</h1>
          <p className="text-zinc-600 text-sm sm:text-base font-normal font-inter leading-tight sm:leading-6">
            Control your profile, team permissions, and global platform logic.
          </p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl opacity-0 hidden sm:block">
          Onboard Pro
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="p-1 bg-stone-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex items-center gap-1 sm:gap-2 w-full max-w-[1440px] overflow-x-auto no-scrollbar">
        <TabItem 
          active={activeTab === 'profile'} 
          onClick={() => { setActiveTab('profile'); setIsEditing(false); }} 
          icon={<HiOutlineUser className="w-5 h-5" />}
          label="My Profile"
        />
        <TabItem 
          active={activeTab === 'team'} 
          onClick={() => setActiveTab('team')} 
          icon={<HiOutlineUserGroup className="w-5 h-5" />}
          label="Team Management"
        />
        <TabItem 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')} 
          icon={<HiOutlineBell className="w-5 h-5" />}
          label="Notifications"
        />
        <TabItem 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')} 
          icon={<HiOutlineLockClosed className="w-5 h-5" />}
          label="Security"
        />
      </div>

      {/* Content Area */}
      <div className="w-full">
        {renderTabContent()}
      </div>
    </div>
  )
}

function TabItem({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "shrink-0 px-4 sm:px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap",
        active 
          ? "bg-blue-50/50 outline outline-1 outline-offset-[-1px] outline-blue-200 shadow-sm" 
          : "hover:bg-zinc-100/50"
      )}
    >
      <div className={cn(
        "transition-colors shrink-0",
        active ? "text-blue-700" : "text-zinc-600"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm font-medium font-inter leading-5 transition-colors",
        active ? "text-blue-700" : "text-neutral-700"
      )}>
        {label}
      </span>
    </button>
  )
}

function ProfileTab({ profile, isEditing, setIsEditing, data, setData, onSubmit, onAvatarUpload, isPending, loading }: any) {
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-8 flex flex-col gap-8 shadow-sm max-w-4xl">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-zinc-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                {data.avatar ? (
                  <img src={formatImageUrl(data.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <HiOutlineUser className="w-12 h-12 text-zinc-300" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <HiOutlineCamera className="w-6 h-6 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={onAvatarUpload} />
              </label>
            </div>
            <div className="flex flex-col">
              <h3 className="text-neutral-800 text-lg font-semibold font-inter">Profile Picture</h3>
              <p className="text-zinc-500 text-sm">PNG, JPG or GIF. Max 2MB.</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-zinc-500">Cancel</Button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label>Full Name</Label>
            <div className="relative">
              <Input 
                value={data.name}
                onChange={e => setData((prev: any) => ({ ...prev, name: e.target.value }))}
                className="pl-10 h-12"
                placeholder="Enter your name"
              />
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email Address</Label>
            <div className="relative">
              <Input 
                value={data.email}
                disabled
                className="pl-10 h-12 bg-zinc-50 opacity-80 cursor-not-allowed"
                placeholder="email@example.com"
              />
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Phone Number</Label>
            <div className="relative">
              <Input 
                value={data.phone}
                onChange={e => setData((prev: any) => ({ ...prev, phone: e.target.value }))}
                className="pl-10 h-12"
                placeholder="+234 ..."
              />
              <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4">
            <Button type="submit" isLoading={isPending} className="bg-blue-700 hover:bg-blue-800 px-8 h-12 rounded-xl text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="p-5 bg-stone-50 rounded-xl flex flex-col gap-5 max-w-4xl">
        {/* Profile Card */}
        <div className="p-5 bg-white rounded-xl outline outline-1 outline-zinc-300 flex flex-col gap-5">
          <div className="p-3 bg-white rounded-xl outline outline-1 outline-stone-50 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-zinc-300 overflow-hidden bg-zinc-50 flex items-center justify-center">
                  {profile?.avatar ? (
                    <img src={formatImageUrl(profile.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <HiOutlineUser className="w-6 h-6 text-zinc-400" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-zinc-600 text-base font-semibold font-inter leading-6">{profile?.name || 'User Name'}</div>
                  <div className="text-zinc-600 text-sm font-normal font-inter leading-5 capitalize">{profile?.role?.replace('_', ' ') || 'Administrator'}</div>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
              >
                <HiOutlinePencil className="w-5 h-5" />
                <span className="text-sm font-medium font-inter">Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Professional Info Card */}
        <div className="p-5 bg-white rounded-xl outline outline-1 outline-zinc-300 flex flex-col gap-5 overflow-hidden">
          <div className="text-neutral-700 text-base font-semibold font-inter leading-6">Professional Info</div>
          <div className="flex flex-col gap-6">
            <InfoRow label="Full Name" value={profile?.name || '---'} />
            <InfoRow label="Email Address" value={profile?.email || '---'} />
            <InfoRow label="Phone Number" value={profile?.phone || '---'} />
            <InfoRow label="Role" value={profile?.role?.toUpperCase() || '---'} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-start">
      <div className="text-neutral-700 text-sm font-normal font-inter leading-5">{label}</div>
      <div className="text-neutral-700 text-sm font-medium font-inter leading-5">{value}</div>
    </div>
  )
}

function RecentActivityTable({ transactions, loading }: any) {
  return (
    <div className="bg-white rounded-xl border border-zinc-300 overflow-hidden shadow-sm max-w-4xl">
       <div className="p-4 border-b border-zinc-200 bg-stone-50/50">
        <h3 className="text-neutral-800 text-base font-semibold font-inter">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-zinc-300">
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Date</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Professional</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Status</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Reference</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td></tr>
              ))
            ) : transactions?.length > 0 ? (
              transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-zinc-600 text-sm font-medium font-inter whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-600/10 flex items-center justify-center text-zinc-700 font-medium text-sm">
                        {tx.professionalName?.charAt(0) || 'P'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-700 text-sm font-medium font-inter">{tx.professionalName || 'N/A'}</span>
                        <span className="text-zinc-500 text-xs font-normal font-inter">{tx.professionalEmail || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        tx.status === 'success' ? "bg-green-700" : tx.status === 'pending' ? "bg-amber-500" : "bg-rose-400"
                      )} />
                      <span className={cn(
                        "text-sm font-medium font-inter capitalize",
                        tx.status === 'success' ? "text-green-700" : tx.status === 'pending' ? "text-amber-500" : "text-rose-400"
                      )}>
                        {tx.status || 'pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 text-sm font-medium font-inter">
                    {tx.reference || '—'}
                  </td>
                  <td className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">
                    ₦{(tx.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
               <tr className="hover:bg-zinc-50 transition-colors">
                 <td colSpan={5} className="px-6 py-10 text-center text-zinc-400 text-sm">No recent activity found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TeamTab({ team, loading }: any) {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <div className="flex-1 min-w-full p-5 bg-stone-50 rounded-xl inline-flex flex-col justify-start items-start gap-5">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-neutral-700 text-base font-semibold font-inter leading-6">Administrators & Staff</div>
            <button className="justify-start text-blue-700 text-base font-semibold font-inter leading-6 hover:text-blue-800 transition-colors">
              Invite new member
            </button>
          </div>
          
          <div className="self-stretch bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-zinc-300">
                    <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter leading-6">Name</th>
                    <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter leading-6">Role</th>
                    <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter leading-6">Last Activity</th>
                    <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter leading-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                      </tr>
                    ))
                  ) : team && team.length > 0 ? (
                    team.map((member: any) => (
                      <tr key={member.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-2">
                          <div className="flex items-center gap-3 h-12">
                            <div className="w-12 h-12 relative bg-zinc-600/10 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                              {member.avatar ? (
                                <img src={formatImageUrl(member.avatar)} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-zinc-700 text-sm font-medium font-inter">
                                  {member.name?.charAt(0) || 'U'}
                                </span>
                              )}
                            </div>
                            <div className="inline-flex flex-col justify-start items-start gap-[2px]">
                              <div className="text-zinc-800 text-sm font-medium font-inter leading-5">{member.name}</div>
                              <div className="text-zinc-500 text-xs font-normal font-inter leading-4">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-2 h-16">
                          <div className="text-zinc-600 text-sm font-medium font-inter leading-5 capitalize">
                            {member.role?.replace('_', ' ') || 'Super Admin'}
                          </div>
                        </td>
                        <td className="px-6 py-2 h-16">
                          <div className="text-zinc-600 text-sm font-medium font-inter leading-5">
                            {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : 'Now'}
                          </div>
                        </td>
                        <td className="px-6 py-2 h-16">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2.5 h-2.5 rounded-full",
                              member.status === 'active' || !member.status ? "bg-green-700" : "bg-rose-400"
                            )} />
                            <div className={cn(
                              "text-sm font-medium font-inter leading-5",
                              member.status === 'active' || !member.status ? "text-green-700" : "text-rose-400"
                            )}>
                              {member.status === 'active' || !member.status ? 'Active' : 'Not active'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-zinc-400 text-sm">No team members found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab({ settings, updateSettings, loading }: any) {
  const [localSettings, setLocalSettings] = useState<any>({
    securityAlerts: true,
    merchantVerification: true,
    disputeEscalation: false,
    newLogin: true
  })

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        securityAlerts: settings.securityAlerts ?? true,
        merchantVerification: settings.merchantVerification ?? true,
        disputeEscalation: settings.disputeEscalation ?? false,
        newLogin: settings.newLogin ?? true
      })
    }
  }, [settings])

  const toggleSetting = (key: string) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] }
    setLocalSettings(newSettings)
    if (updateSettings?.mutate) {
      updateSettings.mutate(newSettings)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <div className="flex-1 min-w-full p-5 bg-stone-50 rounded-xl inline-flex flex-col justify-start items-start gap-5">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-neutral-700 text-base font-semibold font-inter leading-6">Notification Preferences</div>
          </div>
          
          <div className="self-stretch bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start overflow-hidden">
            <NotificationItem 
              icon={<HiOutlineShieldCheck className="w-6 h-6 text-zinc-600" />}
              title="Security Alerts"
              description="Get notified about unrecognized login attempts and password changes."
              active={localSettings.securityAlerts}
              onToggle={() => toggleSetting('securityAlerts')}
            />
            <NotificationItem 
              icon={<HiOutlineUserGroup className="w-6 h-6 text-zinc-600" />}
              title="Merchant Verification"
              description="New professional registration requests needing approval."
              active={localSettings.merchantVerification}
              onToggle={() => toggleSetting('merchantVerification')}
            />
            <NotificationItem 
              icon={<HiOutlineAnnotation className="w-6 h-6 text-zinc-600" />}
              title="Dispute Escalation"
              description="Get notified about unrecognized login attempts and password changes."
              active={localSettings.disputeEscalation}
              onToggle={() => toggleSetting('disputeEscalation')}
            />
            <NotificationItem 
              icon={<HiOutlineLockClosed className="w-6 h-6 text-zinc-600" />}
              title="New Login"
              description="Get notification on when a new login is made on your account"
              active={localSettings.newLogin}
              onToggle={() => toggleSetting('newLogin')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationItem({ icon, title, description, active, onToggle }: any) {
  return (
    <div className="self-stretch h-auto min-h-20 px-6 py-4 border-b border-zinc-300 last:border-b-0 inline-flex justify-between items-center hover:bg-stone-50/50 transition-colors">
      <div className="flex justify-start items-center gap-4">
        <div className="w-12 h-12 relative bg-zinc-600/10 rounded-full flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="inline-flex flex-col justify-start items-start gap-[2px]">
          <div className="text-zinc-800 text-sm font-medium font-inter leading-5">{title}</div>
          <div className="text-zinc-500 text-xs font-normal font-inter leading-4">{description}</div>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={cn(
          "w-11 h-6 rounded-full transition-all relative shrink-0",
          active ? "bg-blue-700" : "bg-zinc-200"
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
          active ? "left-6" : "left-1"
        )} />
      </button>
    </div>
  )
}

function SecurityTab({ data, setData, onSubmit, isPending }: any) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-8 flex flex-col gap-8 max-w-4xl shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-blue-50">
          <HiOutlineLockClosed className="w-5 h-5 text-blue-700" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-neutral-800 text-lg font-semibold font-plus-jakarta">Update Password</h2>
          <p className="text-zinc-500 text-sm font-normal font-inter">Ensure your account is using a long, random password to stay secure.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-2">
          <Label>Current Password</Label>
          <div className="relative">
            <Input 
              type="password"
              value={data.oldPassword}
              onChange={e => setData((prev: any) => ({ ...prev, oldPassword: e.target.value }))}
              placeholder="••••••••"
              className="pl-10 h-12"
            />
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>New Password</Label>
          <div className="relative">
            <Input 
              type="password"
              value={data.newPassword}
              onChange={e => setData((prev: any) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="••••••••"
              className="pl-10 h-12"
            />
            <HiOutlineKey className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Confirm New Password</Label>
          <div className="relative">
            <Input 
              type="password"
              value={data.confirmPassword}
              onChange={e => setData((prev: any) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="••••••••"
              className="pl-10 h-12"
            />
            <HiOutlineKey className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" isLoading={isPending} className="bg-blue-700 hover:bg-blue-800 px-8 h-12 rounded-xl text-white">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}
