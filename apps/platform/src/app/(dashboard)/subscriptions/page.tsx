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

  const { data: subscription, isLoading: subLoading } = useMySubscription()
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

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      subtitle: 'For light, occasional usage best for: individuals or small households',
      price: 7500,
      icon: HiOutlineBadgeCheck,
      features: [
        'Access to verified professionals',
        'Standard booking priority',
        'Reduced call-out fees',
        '24/7 support',
        'Track all jobs in real time',
      ],
    },
    {
      id: 'standard',
      name: 'Standard',
      subtitle: 'For consistent home maintenance, best for: active homes and busy professionals',
      price: 15000,
      isPopular: true,
      icon: HiOutlineShieldCheck,
      features: [
        'Everything on basic',
        'Faster booking priority',
        'More call-out coverage',
        'Priority support',
        'Home health reports',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'For full-service convenience, best for: landlords, large homes, and high-frequency users',
      price: 50000,
      icon: HiOutlineRefresh,
      features: [
        'Everything on Standard',
        'Parts & labour included',
        'Same-day guarantee',
        'Annual home inspection',
        'Dedicated account manager',
      ],
    },
  ]

  // Auto-subscribe if plan is in URL
  React.useEffect(() => {
    const planId = searchParams.get('plan') as 'basic' | 'standard' | 'premium' | null
    if (!mounted || !planId || subscription || subLoading || subscribeMutation.isPending || isProcessingPlan) return

    setIsProcessingPlan(true)
    handleSubscribe(planId)
  }, [mounted, subLoading])

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
    subscribeMutation.mutate(planId as any, {
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

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel? You will lose access at the end of your period.')) {
      try {
        await cancelMutation.mutateAsync()
        toast.success('Subscription cancelled')
      } catch (err: any) {
        toast.error(err?.message || 'Failed to cancel')
      }
    }
  }

  const handleToggleAutoRenew = async () => {
    try {
      await toggleAutoRenewMutation.mutateAsync(!subscription?.autoRenew)
      toast.success(`Auto-renew ${!subscription?.autoRenew ? 'enabled' : 'disabled'}`)
    } catch (err: any) {
      toast.error('Failed to update auto-renew settings')
    }
  }

  if (!mounted || subLoading || isVerifying) {
    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-5 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-2xl font-bold font-plus-jakarta">My Membership</h1>
        <p className="text-zinc-500 text-sm">Manage your subscription, billing history, and plan details.</p>
      </div>

      {/* Current Subscription Card */}
      {subscription && (
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_115.97%_115.97%_at_82.00%_18.00%,_#4A2208_0%,_#1E1220_45%,_#111318_100%)] rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  subscription.status === 'active' ? "bg-emerald-600" : "bg-orange-600"
                )}>
                  {subscription.status}
                </div>
                <button 
                  onClick={handleToggleAutoRenew}
                  disabled={toggleAutoRenewMutation.isPending}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <HiOutlineRefresh className={cn("w-3 h-3", subscription.autoRenew && "animate-spin-slow")} />
                  {subscription.autoRenew ? 'Auto-renew ON' : 'Auto-renew OFF'}
                </button>
              </div>
              <div>
                <h2 className="text-3xl font-bold font-plus-jakarta">{subscription.planName} Plan</h2>
                <p className="text-white/70 mt-1 text-sm">
                  Renews on {subscription.endDate ? format(new Date(subscription.endDate), 'MMMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-4xl font-bold">₦{(subscription.amount || 0).toLocaleString()}</span>
              <span className="text-white/60 text-sm">per month</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <HiOutlineCalendar className="w-5 h-5 text-orange-500" />
              <span>Next billing date: <strong>{subscription.endDate ? format(new Date(subscription.endDate), 'MMMM dd, yyyy') : 'N/A'}</strong></span>
            </div>
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
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      {/* Available Plans */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-700 text-2xl font-bold font-plus-jakarta">
            {subscription ? 'Change Plan' : 'Select a Plan'}
          </h3>
          <p className="text-zinc-500 text-sm">Choose the best plan that suits your home service needs.</p>
        </div>
        
        <div 
          ref={scrollRef}
          className="mt-6 flex overflow-x-auto pb-6 -mx-4 px-4 gap-5 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0"
        >
          {plans.map((plan) => {
            const isCurrent = subscription?.planId === plan.id;
            const isDark = plan.id === 'standard';
            
            return (
              <div
                key={plan.id}
                className={cn(
                  "pricing-card relative flex flex-col min-w-[300px] md:min-w-0 p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl snap-center",
                  isDark
                    ? "bg-[radial-gradient(ellipse_115.97%_115.97%_at_82.00%_18.00%,_#4A2208_0%,_#1E1220_45%,_#111318_100%)] border-transparent"
                    : "bg-stone-50 border-zinc-200"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute left-1/2 -top-px -translate-x-1/2 bg-orange-600 px-6 py-1 rounded-b-[10px] z-10">
                    <span className="text-white text-[10px] font-extrabold uppercase tracking-wide">Most Popular</span>
                  </div>
                )}

                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex flex-col gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center border shrink-0",
                      isDark ? "bg-slate-100 border-transparent" : "bg-white border-indigo-200"
                    )}>
                      <plan.icon className={cn("w-6 h-6", isDark ? "text-neutral-700" : "text-blue-700")} />
                    </div>
                    <div className="space-y-1">
                      <h3 className={cn("text-2xl font-semibold font-plus-jakarta leading-8", isDark ? "text-neutral-50" : "text-neutral-700")}>
                        {plan.name}
                      </h3>
                      <p className={cn("text-sm font-normal leading-5 h-10", isDark ? "text-neutral-50/80" : "text-zinc-600")}>
                        {plan.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <span className={cn("text-4xl font-bold font-plus-jakarta leading-10", isDark ? "text-neutral-50" : "text-slate-900")}>
                      ₦{plan.price.toLocaleString()}
                    </span>
                    <span className={cn("text-xs font-semibold ml-1 mb-1", isDark ? "text-neutral-50/60" : "text-neutral-700")}>/mo</span>
                  </div>
                </div>

                <div className="w-full mb-8">
                  <Button
                    disabled={isCurrent || subscribeMutation.isPending || changePlanMutation.isPending}
                    onClick={() => subscription ? handleChangePlan(plan.id) : handleSubscribe(plan.id)}
                    className={cn(
                      "w-full py-6 px-6 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50",
                      isDark
                        ? "bg-slate-50 text-blue-700 hover:bg-white"
                        : "bg-transparent border border-blue-700 text-blue-700 hover:bg-blue-50"
                    )}
                  >
                    {isCurrent ? 'Current Plan' : (subscription ? 'Switch Plan' : 'Get Started')}
                  </Button>
                </div>

                <div className="flex flex-col gap-px">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-2 py-3 border-b border-zinc-300 last:border-0",
                        isDark ? "border-zinc-300/20" : "border-zinc-300"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-sm flex items-center justify-center shrink-0 border",
                        isDark ? "border-orange-600" : "border-emerald-800"
                      )}>
                        <HiOutlineBadgeCheck className={cn("w-3 h-3", isDark ? "text-orange-600" : "text-emerald-800")} />
                      </div>
                      <span className={cn("text-sm font-normal leading-5", isDark ? "text-neutral-50" : "text-neutral-700")}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className="flex flex-col gap-4 mt-4">
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
