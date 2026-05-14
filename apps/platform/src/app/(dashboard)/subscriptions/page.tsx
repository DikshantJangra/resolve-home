'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMySubscription, useSubscriptionHistory, useVerifySubscription, useCancelSubscription, useSubscribe } from '@/hooks/api-hooks'
import { cn, Button, Skeleton } from "@resolve/ui"
import { HiOutlineBadgeCheck, HiOutlineClock, HiOutlineCalendar, HiOutlineCreditCard, HiOutlineRefresh, HiOutlineShieldCheck } from 'react-icons/hi'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

function SubscriptionsContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') || ''

  const { data: subscription, isLoading: subLoading } = useMySubscription()
  const { data: history, isLoading: historyLoading } = useSubscriptionHistory()
  const { data: verificationResult, isLoading: isVerifying } = useVerifySubscription(reference)
  const subscribeMutation = useSubscribe()
  const cancelMutation = useCancelSubscription()
  const queryClient = useQueryClient()
  const [hasShownSuccess, setHasShownSuccess] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [isProcessingPlan, setIsProcessingPlan] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  // Auto-subscribe if plan is in URL
  React.useEffect(() => {
    const planId = searchParams.get('plan') as 'basic' | 'standard' | 'premium' | null
    if (!mounted || !planId || subscription || subLoading || subscribeMutation.isPending || isProcessingPlan) return

    setIsProcessingPlan(true)
    toast.info(`Initializing ${planId} plan...`)
    subscribeMutation.mutate(planId, {
      onSuccess: (data: any) => {
        if (data?.authorizationUrl) {
          window.location.href = data.authorizationUrl
        } else {
          toast.error('Failed to initialize payment')
          setIsProcessingPlan(false)
        }
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to initialize payment')
        setIsProcessingPlan(false)
      }
    })
  }, [mounted, subLoading])

  // Handle payment verification result
  React.useEffect(() => {
    if (verificationResult?.success && !hasShownSuccess) {
      toast.success('Subscription Activated!', {
        description: `Your ${verificationResult.planName || 'plan'} is now active. Welcome aboard!`
      })
      setHasShownSuccess(true)
      window.history.replaceState({}, '', window.location.pathname)
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
      queryClient.invalidateQueries({ queryKey: ['subscription-history'] })
    }
  }, [verificationResult, hasShownSuccess, queryClient])

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose premium access at the end of your billing period.')) {
      try {
        await cancelMutation.mutateAsync()
        toast.success('Subscription cancelled successfully')
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to cancel subscription')
      }
    }
  }

  if (!mounted || subLoading || isVerifying) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-5 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-2xl font-bold font-plus-jakarta">My Membership</h1>
        <p className="text-zinc-500">Manage your subscription, billing history, and plan details.</p>
      </div>

      {/* Current Subscription Card */}
      {subscription ? (
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_115.97%_115.97%_at_82.00%_18.00%,_#4A2208_0%,_#1E1220_45%,_#111318_100%)] rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {subscription.status}
                </div>
                {subscription.autoRenew && (
                  <div className="flex items-center gap-1 text-xs text-white/60">
                    <HiOutlineRefresh className="w-3 h-3" />
                    Auto-renews
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold font-plus-jakarta">{subscription.planName} Plan</h2>
                <p className="text-white/70 mt-1">
                  Active since {subscription.startDate ? format(new Date(subscription.startDate), 'MMMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-4xl font-bold">₦{(subscription.amount || 0).toLocaleString()}</span>
              <span className="text-white/60 text-sm">per month</span>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <HiOutlineCalendar className="w-5 h-5 text-orange-500" />
              <span>Next billing date: <strong>{subscription.endDate ? format(new Date(subscription.endDate), 'MMMM dd, yyyy') : 'N/A'}</strong></span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => toast.info('Plan upgrade feature coming soon!')}
              >
                Change Plan
              </Button>
              {subscription.status === 'active' && (
                <Button
                  variant="outline"
                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  Cancel Membership
                </Button>
              )}
            </div>
          </div>

          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      ) : (
        <div className="bg-stone-50 border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
            <HiOutlineCreditCard className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutral-700">No Active Subscription</h3>
            <p className="text-zinc-500 text-sm max-w-xs">Subscribe to a plan to enjoy priority service, reduced fees and 24/7 coverage.</p>
          </div>
          <Button
            className="mt-2 bg-blue-700 hover:bg-blue-800 text-white px-8 rounded-xl"
            onClick={() => window.location.href = '/#membership'}
          >
            View Pricing Plans
          </Button>
        </div>
      )}

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: HiOutlineBadgeCheck, title: 'Verified Pros', desc: 'Access to 100% vetted and insured experts.' },
          { icon: HiOutlineClock, title: 'Priority Access', desc: 'Jump the queue with standard or premium booking.' },
          { icon: HiOutlineShieldCheck, title: 'Zero Call-out Fees', desc: 'Never pay for service dispatch on active plans.' },
        ].map((benefit, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col gap-3">
            <benefit.icon className="w-8 h-8 text-blue-600" />
            <h4 className="text-neutral-700 font-bold">{benefit.title}</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="flex flex-col gap-4">
        <h3 className="text-neutral-700 text-lg font-bold font-plus-jakarta">Billing History</h3>
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {historyLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : history && history.length > 0 ? (
                history.map((item: any) => (
                  <tr key={item.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-700">
                      {item.planName || item.planId}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-neutral-900">
                      ₦{(item.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        item.status === 'success' ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 text-sm">
                    No billing history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-8 max-w-4xl mx-auto p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-5 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    }>
      <SubscriptionsContent />
    </Suspense>
  )
}
