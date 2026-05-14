'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMySubscription, useSubscriptionHistory, useVerifySubscription, useCancelSubscription, useSubscribe, useChangePlan, useToggleAutoRenew, useUserProfile, useAuthSession } from '@/hooks/api-hooks'
import { cn, Button, Skeleton } from "@resolve/ui"
import { HiOutlineBadgeCheck, HiOutlineClock, HiOutlineCalendar, HiOutlineCreditCard, HiOutlineRefresh, HiOutlineShieldCheck, HiStar } from 'react-icons/hi'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

function SubscriptionsContent() {
  const searchParams = useSearchParams()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const plansRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768 && scrollRef.current) {
        const container = scrollRef.current
        const cards = container.querySelectorAll('.pricing-card')
        const middleCard = cards[1] as HTMLElement
        if (middleCard) {
          const scrollPos = middleCard.offsetLeft - (container.offsetWidth / 2) + (middleCard.offsetWidth / 2)
          container.scrollTo({ left: scrollPos, behavior: 'smooth' })
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])
  
  const reference = searchParams.get('reference') || searchParams.get('trxref') || ''

  const { data: subscription, isLoading: subLoading, isRefetching: subRefetching } = useMySubscription()
  const { data: history, isLoading: historyLoading } = useSubscriptionHistory()
  const { data: verificationResult, isLoading: isVerifying } = useVerifySubscription(reference)
  const subscribeMutation = useSubscribe()
  const cancelMutation = useCancelSubscription()
  const changePlanMutation = useChangePlan()
  const toggleAutoRenewMutation = useToggleAutoRenew()
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
    handleSubscribe(planId)
  }, [mounted, subLoading, subscription])

  // Handle payment verification result
  React.useEffect(() => {
    if (verificationResult) {
      if (verificationResult.success && !hasShownSuccess) {
        toast.success('Subscription Activated!', {
          description: `Your plan is now active. Welcome aboard!`
        })
        setHasShownSuccess(true)
        window.history.replaceState({}, '', window.location.pathname)
        queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
        queryClient.invalidateQueries({ queryKey: ['subscription-history'] })
      } else if (verificationResult.success === false && !hasShownSuccess) {
        toast.error('Verification Failed', {
          description: verificationResult.message || 'We could not verify your payment. Please contact support.'
        })
        setHasShownSuccess(true) // Mark as shown to avoid repeating
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [verificationResult, hasShownSuccess, queryClient])

  const handleSubscribe = async (planId: string) => {
    toast.info(`Initializing ${planId} plan...`)
    subscribeMutation.mutate({ 
      planId: planId as any, 
      callbackURL: window.location.href 
    }, {
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
  }

  const handleChangePlan = async (planId: string) => {
    if (planId === subscription?.planId) return
    
    const confirmMsg = `Upgrade/Downgrade to ${planId} plan? This will take effect immediately.`
    if (confirm(confirmMsg)) {
      try {
        await changePlanMutation.mutateAsync(planId as any)
        toast.success('Plan changed successfully')
      } catch (err: any) {
        toast.error(err?.message || 'Failed to change plan')
      }
    }
  }

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      try {
        await cancelMutation.mutateAsync()
        toast.success('Subscription cancelled')
      } catch (err: any) {
        toast.error(err?.message || 'Failed to cancel subscription')
      }
    }
  }

  const handleToggleAutoRenew = async (enabled: boolean) => {
    try {
      await toggleAutoRenewMutation.mutateAsync(enabled)
      toast.success(enabled ? 'Auto-renew enabled' : 'Auto-renew disabled')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to toggle auto-renew')
    }
  }

  const handleRedirectToHome = () => {
    router.push('/#membership')
  }

  if (!mounted || (subLoading && !subscription)) {
    return (
      <div className="flex flex-col gap-8 pb-20">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h4 className="text-blue-700 text-lg font-bold font-plus-jakarta uppercase tracking-wider">Pricing</h4>
          <h1 className="text-neutral-700 text-3xl font-bold font-plus-jakarta leading-tight">
            Simple pricing, serious home cover.
          </h1>
        </div>
        <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
          No hidden call-out fees, All services in every plan, Cancel anytime
        </p>
      </div>

      {subscription && (
        <div className="bg-stone-50 border border-zinc-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <HiOutlineBadgeCheck className="w-6 h-6 text-blue-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Current Plan</span>
              <h2 className="text-neutral-700 text-xl font-bold">{subscription.planName || subscription.planId}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-10">
            <div className="flex flex-col">
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Status</span>
              {subRefetching ? (
                <span className="text-xs font-semibold text-zinc-400 animate-pulse">Verifying...</span>
              ) : (
                <span className={cn(
                  "text-sm font-semibold capitalize",
                  subscription.status === 'active' ? "text-emerald-600" : "text-amber-600"
                )}>{subscription.status}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Period</span>
              <span className="text-neutral-700 text-sm font-semibold">
                {subscription.startDate && subscription.endDate
                  ? `${format(new Date(subscription.startDate), 'MMM dd')} — ${format(new Date(subscription.endDate), 'MMM dd, yyyy')}`
                  : subscription.endDate
                    ? `Until ${format(new Date(subscription.endDate), 'MMM dd, yyyy')}`
                    : '—'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Auto Renew</span>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  onClick={() => handleToggleAutoRenew(!subscription.autoRenew)}
                  className={cn(
                    "w-8 h-4 rounded-full relative cursor-pointer transition-colors",
                    subscription.autoRenew ? "bg-blue-700" : "bg-zinc-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                    subscription.autoRenew ? "right-0.5" : "left-0.5"
                  )} />
                </div>
                <span className="text-xs font-medium text-zinc-600">{subscription.autoRenew ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleCancelSubscription}
            disabled={cancelMutation.isPending}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl px-6 h-11 text-xs font-bold"
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Plan'}
          </Button>
        </div>
      )}

      {/* Select Plan UI */}
      <div ref={plansRef} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-700 text-2xl font-bold font-plus-jakarta">
            {subscription ? 'Change Plan' : 'Select a Plan'}
          </h3>
          <p className="text-zinc-500 text-sm">Choose the best plan that suits your home service needs.</p>
        </div>
        
        <div className="bg-stone-50 border border-dashed border-zinc-300 rounded-2xl p-12 flex flex-col items-center text-center gap-4 mt-2">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
            <HiOutlineShieldCheck className="w-8 h-8 text-blue-700" />
          </div>
          <div className="max-w-md">
            <h4 className="text-neutral-700 font-bold text-lg">Choose Your Plan</h4>
            <p className="text-zinc-500 text-sm mt-1">
              To {subscription ? 'upgrade or downgrade' : 'get started'}, please select your preferred subscription plan.
            </p>
          </div>
          <Button 
            onClick={handleRedirectToHome}
            className="mt-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-8 h-12 text-sm font-bold shadow-lg shadow-blue-700/20"
          >
            Subscribe Now
          </Button>
        </div>
      </div>

      {/* History */}
      {history && history.length > 0 && (
        <div className="flex flex-col gap-6 mt-12">
          <div className="flex flex-col gap-1">
            <h3 className="text-neutral-700 text-lg font-bold font-plus-jakarta">Billing History</h3>
            <p className="text-zinc-500 text-xs">View your past subscription payments and invoices.</p>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 border-b border-zinc-200">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Plan</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {history.map((item: any) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-neutral-700">{item.planName || item.planId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-700">₦{(item.amount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                          item.status === 'success' || item.status === 'active' 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-zinc-500">{format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-700 text-xs font-bold hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-8 pb-20">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <SubscriptionsContent />
    </Suspense>
  )
}
