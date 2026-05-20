'use client'

import React from 'react'
import { useProfessionalSetupStore } from '@/store/professional-setup-store'
import { Button, Input, Label, LoadingSpinner } from "@resolve/ui"
import {
  HiOutlineChevronLeft,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlinePencilAlt,
  HiOutlineRefresh,
  HiOutlineClock
} from 'react-icons/hi'
import {
  useCategories,
  useServices,
  useUpdateEngineerProfile,
  useNigerianBanks,
  useResendGuarantorVerification,
  useUpdateGuarantor,
  useUserProfile
} from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { cn } from "@resolve/ui"
import { apiClient, ENDPOINTS } from "@resolve/api"
import { Country, State, City } from 'country-state-city'
import { HiChevronDown } from 'react-icons/hi'
import { LocationBlockedModal } from '@/components/shared/location-blocked-modal'

export const ProfessionalSetupWizard = ({ onComplete, initialStep, isModal }: { onComplete: () => void, initialStep?: number, isModal?: boolean }) => {
  const store = useProfessionalSetupStore()
  const { data: categories } = useCategories()
  const { data: services = [], isLoading: loadingServices } = useServices(store.categoryId)
  const { data: banks = [], isLoading: loadingBanks } = useNigerianBanks()
  const { mutate: updateProfile, isPending } = useUpdateEngineerProfile()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isLocating, setIsLocating] = React.useState(false)
  const [isBlockedModalOpen, setIsBlockedModalOpen] = React.useState(false)
  const [isEditingEmail, setIsEditingEmail] = React.useState(false)
  const [tempEmail, setTempEmail] = React.useState('')
  const [selectedServicesMap, setSelectedServicesMap] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (services && services.length > 0) {
      setSelectedServicesMap(prev => {
        const next = { ...prev }
        services.forEach((s: any) => {
          next[s.id] = s.name
        })
        return next
      })
    }
  }, [services])

  const { mutate: resendVerification, isPending: isResending } = useResendGuarantorVerification()
  const { mutate: updateGuarantor, isPending: isUpdatingGuarantor } = useUpdateGuarantor()
  const { data: userProfile } = useUserProfile()

  const isGuarantorVerified = !!(
    userProfile?.engineerProfile?.guarantorVerification?.verified ||
    userProfile?.engineerProfile?.isGuarantorVerified ||
    userProfile?.isGuarantorVerified
  )

  const isAccountVerified = !!(
    userProfile?.engineerProfile?.isVerified ||
    userProfile?.engineerProfile?.verificationStatus === 'approved' ||
    userProfile?.engineerProfile?.approvedAt
  )

  // Auto-dismiss overlay when account is already verified
  React.useEffect(() => {
    if (isAccountVerified) {
      onComplete()
    }
  }, [isAccountVerified, onComplete])

  const handleResendVerification = () => {
    resendVerification(undefined, {
      onSuccess: () => {
        toast.success('Verification email resent successfully')
      }
    })
  }

  const handleUpdateGuarantorEmail = () => {
    if (!tempEmail || !tempEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    updateGuarantor({ guarantorName: store.guarantorName, guarantorEmail: tempEmail }, {
      onSuccess: () => {
        store.updateField('guarantorEmail', tempEmail)
        setIsEditingEmail(false)
        toast.success('Guarantor email updated successfully')
      }
    })
  }

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    navigator.permissions?.query({ name: 'geolocation' as PermissionName }).then(result => {
      if (result.state === 'denied') {
        setIsBlockedModalOpen(true)
        return
      }
      startLocating()
    }).catch(() => startLocating())
  }

  const startLocating = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // Using Nominatim (OpenStreetMap) for free reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()

          if (data && data.address) {
            const { state, city, town, village, road, neighbourhood, suburb, country_code } = data.address

            const detectedCountryCode = country_code?.toUpperCase() || 'NG'
            const country = Country.getCountryByCode(detectedCountryCode)

            if (country) {
              store.updateField('country', country.name)
              store.updateField('countryCode', country.isoCode)

              // Try to find the state code
              const states = State.getStatesOfCountry(country.isoCode)
              const cleanStateName = (state || '').replace(/ State$/i, '')
              const matchedState = states.find(s =>
                s.name.toLowerCase().includes(cleanStateName.toLowerCase()) ||
                cleanStateName.toLowerCase().includes(s.name.toLowerCase())
              )

              if (matchedState) {
                store.updateField('state', matchedState.name)
                store.updateField('stateCode', matchedState.isoCode)

                // Try to find the city
                const cities = City.getCitiesOfState(country.isoCode, matchedState.isoCode)
                const cleanCityName = (city || town || village || suburb || '').replace(/ (City|LGA|Local Government Area)$/i, '')
                const matchedCity = cities.find(c =>
                  c.name.toLowerCase().includes(cleanCityName.toLowerCase()) ||
                  cleanCityName.toLowerCase().includes(c.name.toLowerCase())
                )

                if (matchedCity) {
                  store.updateField('city', matchedCity.name)
                } else {
                  store.updateField('city', cleanCityName)
                }
              }
            }

            store.updateField('address', road || neighbourhood || data.display_name.split(',')[0] || '')
            toast.success("Location detected!")
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error)
          toast.error("Failed to resolve address. Please enter manually.")
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        setIsLocating(false)
        console.error("Geolocation error:", error)
        if (error.code === 1) { // Location access denied
          setIsBlockedModalOpen(true)
        } else {
          toast.error("Location access denied or unavailable.")
        }
      }
    )
  }

  React.useEffect(() => {
    if (initialStep) {
      store.setStep(initialStep)
    } else if (userProfile?.engineerProfile?.verificationStatus === 'pending') {
      store.setStep(4)
    }
  }, [initialStep, userProfile?.engineerProfile?.verificationStatus])

  React.useEffect(() => {
    if (!isModal) return
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [isModal])

  // Sanity check for experience enum
  React.useEffect(() => {
    const validRanges = ['1-3', '4-7', '8-12', '13+']
    if (store.experience && !validRanges.includes(store.experience)) {
      console.log('Resetting invalid experience value:', store.experience)
      store.updateField('experience', '')
    }
  }, [store.experience])
  React.useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [store.currentStep])

  // Automatically select "Others" as default if available
  React.useEffect(() => {
    if (categories && !store.categoryId) {
      const otherCategory = categories.find((cat: any) =>
        cat.name.toLowerCase() === 'others' || cat.name.toLowerCase() === 'other'
      )
      if (otherCategory) {
        store.updateField('categoryId', otherCategory.id)
      }
    }
  }, [categories, store.categoryId])

  const steps = [
    "Professional and work profile",
    "Business location",
    "Guarantor and Bank Setup"
  ]

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await apiClient.post(ENDPOINTS.UPLOAD.BASE, formData, {
        params: { type: 'any' },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = res.data?.data?.file?.url || res.data?.data?.url || res.data?.url || file.name
      store.updateField('idPhoto', url)
      toast.success('Document uploaded')
    } catch {
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFinish = () => {
    if (!isStepValid()) {
      toast.error("Some required fields are missing. Please check previous steps.")
      return
    }

    if (!/^\d+$/.test(store.accountNumber)) {
      toast.error("Bank account verification failed: Account number should be numeric. Please check your account number and try again.")
      return
    }

    const payload = {
      primarySpecialty: store.specialty,
      category: store.categoryId,
      assignedServices: store.assignedServices,
      yearsOfExperience: store.experience,
      idType: store.idType,
      idNumber: store.idNumber,
      idDocument: store.idPhoto,
      aboutMe: store.aboutMe || "",
      bankDetails: {
        accountName: store.accountName,
        bankName: store.bankName,
        bankCode: store.bankCode,
        accountNumber: store.accountNumber,
      },
      location: {
        country: store.country,
        state: store.state,
        city: store.city,
        streetAddress: store.address,
        nearestLandmark: store.landmark,
      },
      // Flattened guarantor fields (backend preferred)
      guarantorName: store.guarantorName,
      guarantorEmail: store.guarantorEmail,
      guarantorPhone: store.guarantorPhone,
      guarantorRelationship: store.guarantorRelationship,
      guarantorWorkPlace: store.guarantorWorkPlace,
      // Keep nested structure as fallback
      guarantor: {
        name: store.guarantorName,
        email: store.guarantorEmail,
        phone: store.guarantorPhone,
        relationship: store.guarantorRelationship,
        workPlace: store.guarantorWorkPlace,
      }
    }

    console.log('[SetupWizard] Submitting payload:', payload)

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Verification submitted successfully!")
        store.setStep(4)
      },
      onError: (err: any) => {
        console.error('[SetupWizard] Submission failed:', err)
      }
    })
  }

  const renderStep = () => {
    switch (store.currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Primary Specialty <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Select your speciality"
                  value={store.specialty}
                  onChange={(e) => store.updateField('specialty', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category <span className="text-red-500">*</span></Label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none"
                  value={store.categoryId}
                  onChange={(e) => {
                    store.updateField('categoryId', e.target.value)
                  }}
                >
                  <option value="">Select your category</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {store.categoryId && (
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-zinc-700 font-semibold text-sm">Services Offered <span className="text-red-500">*</span></Label>
                    {store.assignedServices.length > 0 && (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        {store.assignedServices.length} selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">Select all the specific services you are qualified to provide.</p>
                  
                  {loadingServices ? (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm py-4 animate-pulse">
                      <LoadingSpinner className="w-4 h-4 text-blue-700" />
                      <span>Loading available services...</span>
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-sm text-zinc-400 italic py-2">
                      No specific services registered under this category yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1 border border-zinc-150 rounded-xl bg-zinc-50/50">
                      {services.map((service: any) => {
                        const isSelected = store.assignedServices.includes(service.id);
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => {
                              const current = store.assignedServices;
                              if (isSelected) {
                                store.updateField('assignedServices', current.filter(id => id !== service.id));
                              } else {
                                store.updateField('assignedServices', [...current, service.id]);
                              }
                            }}
                            className={cn(
                              "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 select-none hover:translate-y-[-1px]",
                              isSelected
                                ? "bg-blue-50/60 border-blue-500 shadow-sm"
                                : "bg-white border-zinc-200 hover:border-zinc-300"
                            )}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                              isSelected ? "bg-blue-700 border-blue-700 text-white" : "border-zinc-300"
                            )}>
                              {isSelected && <svg className="w-3.5 h-3.5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-xs font-semibold text-zinc-800">{service.name}</p>
                              {service.description && (
                                <p className="text-[10px] text-zinc-500 line-clamp-1">{service.description}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {store.assignedServices.length > 0 && (
                    <div className="space-y-2 mt-4 p-3 bg-zinc-50 border border-zinc-150 rounded-xl">
                      <Label className="text-zinc-700 font-semibold text-xs">Total Selected Services ({store.assignedServices.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {store.assignedServices.map(id => {
                          const name = selectedServicesMap[id] || id;
                          return (
                            <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
                              {name}
                              <button
                                type="button"
                                onClick={() => {
                                  store.updateField('assignedServices', store.assignedServices.filter(sid => sid !== id));
                                }}
                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-blue-200 text-blue-500 hover:text-blue-700 font-bold transition-colors cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Years of experience <span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-3">
                  {['1-3', '4-7', '8-12', '13+'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => store.updateField('experience', range)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                        store.experience === range
                          ? "bg-blue-700 border-blue-700 text-white"
                          : "border-zinc-200 text-zinc-600 hover:border-blue-700 hover:text-blue-700"
                      )}
                    >
                      {range} {range === '13+' ? 'years' : 'years'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>About you (Describe yourself and your qualifications) <span className="text-red-500">*</span></Label>
                <textarea
                  placeholder="E.g. I'm a licensed electrician with 8+ years of experience in residential wiring, fault diagnosis, and safety installations. I pride myself on punctuality, clean workmanship, and transparent pricing..."
                  value={store.aboutMe}
                  onChange={(e) => store.updateField('aboutMe', e.target.value)}
                  rows={5}
                  className="w-full min-h-[130px] px-4 py-3 rounded-lg border border-zinc-200 text-sm focus:border-blue-700 outline-none resize-y transition-all bg-white"
                />
                <p className="text-[11px] text-zinc-400 leading-relaxed flex items-start gap-1.5 pt-0.5">
                  <span className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[9px] font-bold">i</span>
                  This is shown to homeowners when they are selecting a Pro Partner. Make it clear, professional, and highlight your key qualifications.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Select ID type <span className="text-red-500">*</span></Label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none"
                  value={store.idType}
                  onChange={(e) => store.updateField('idType', e.target.value)}
                >
                  <option value="">Select ID type</option>
                  <option value="BVN">BVN</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>ID Number <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="00000000000"
                  maxLength={11}
                  value={store.idNumber}
                  onChange={(e) => store.updateField('idNumber', e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="space-y-3">
                <Label>Attach/Upload ID Document <span className="text-red-500">*</span></Label>
                <div className="flex flex-col gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {store.idPhoto ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                      <div className="w-12 h-12 rounded-lg bg-white border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                        {store.idPhoto.match(/\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i) ? (
                          <img
                            src={store.idPhoto}
                            alt="ID Document"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails to load, fallback to icon
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                const icon = document.createElement('div')
                                icon.className = 'flex items-center justify-center w-full h-full'
                                icon.innerHTML = '<svg class="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
                                parent.appendChild(icon)
                              }
                            }}
                          />
                        ) : (
                          <HiOutlineDocumentText className="w-6 h-6 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-700 truncate">
                          ID Document Uploaded
                        </p>
                        <p className="text-xs text-zinc-500">
                          Click trash icon to remove
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => store.updateField('idPhoto', '')}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-11 h-11 bg-slate-50 border border-indigo-400 rounded-xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <LoadingSpinner className="w-4 h-4 text-blue-700" />
                        ) : (
                          <HiOutlinePlus className="w-5 h-5 text-blue-700" />
                        )}
                      </button>
                      <span className="text-sm text-zinc-500">
                        Upload any document type up to 5MB
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <button
              onClick={handleUseGPS}
              disabled={isLocating}
              className="flex items-center gap-2 text-blue-700 text-sm font-medium underline disabled:opacity-50"
            >
              <HiOutlinePlus className={cn("transition-transform", isLocating ? "animate-spin" : "rotate-45")} />
              {isLocating ? "Getting location..." : "Use my current GPS location"}
            </button>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Country <span className="text-red-500">*</span></Label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none"
                  value={store.countryCode}
                  onChange={(e) => {
                    const country = Country.getCountryByCode(e.target.value)
                    if (country) {
                      store.updateField('country', country.name)
                      store.updateField('countryCode', country.isoCode)
                      store.updateField('state', '')
                      store.updateField('stateCode', '')
                      store.updateField('city', '')
                    }
                  }}
                >
                  {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>State <span className="text-red-500">*</span></Label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none"
                  value={store.stateCode}
                  onChange={(e) => {
                    const state = State.getStateByCodeAndCountry(e.target.value, store.countryCode)
                    if (state) {
                      store.updateField('state', state.name)
                      store.updateField('stateCode', state.isoCode)
                      store.updateField('city', '')
                    }
                  }}
                >
                  <option value="">Select State</option>
                  {State.getStatesOfCountry(store.countryCode).map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>City <span className="text-red-500">*</span></Label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none"
                  value={store.city}
                  onChange={(e) => store.updateField('city', e.target.value)}
                  disabled={!store.stateCode}
                >
                  <option value="">Select City</option>
                  {City.getCitiesOfState(store.countryCode, store.stateCode).map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Street Address <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="15 Mobolaji bank, Anthony way"
                  value={store.address}
                  onChange={(e) => store.updateField('address', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Nearest Landmark/Area <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Near ikeja mall"
                  value={store.landmark}
                  onChange={(e) => store.updateField('landmark', e.target.value)}
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-zinc-600 text-sm">Guarantor details</h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Guarantor Full name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter guarantor's full name"
                    value={store.guarantorName}
                    onChange={(e) => store.updateField('guarantorName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter guarantor's email"
                    value={store.guarantorEmail}
                    onChange={(e) => store.updateField('guarantorEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter guarantor's phone number"
                    value={store.guarantorPhone}
                    onChange={(e) => store.updateField('guarantorPhone', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Relationship <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. Employer, Family Friend"
                    value={store.guarantorRelationship}
                    onChange={(e) => store.updateField('guarantorRelationship', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Place of Work <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter guarantor's workplace"
                    value={store.guarantorWorkPlace}
                    onChange={(e) => store.updateField('guarantorWorkPlace', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-zinc-600 text-sm">Bank Details</h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Account Name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Tob Wasiu"
                    className="bg-zinc-100"
                    value={store.accountName}
                    onChange={(e) => store.updateField('accountName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Select Bank <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <select
                      className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none appearance-none"
                      value={store.bankName}
                      onChange={(e) => {
                        const bank = banks.find((b: any) => b.name === e.target.value)
                        store.updateField('bankName', e.target.value)
                        store.updateField('bankCode', bank?.code || '')
                      }}
                      required
                    >
                      <option value="">{loadingBanks ? 'Loading banks...' : 'Choose your bank'}</option>
                      {banks.map((bank: any) => (
                        <option key={`${bank.code}-${bank.name}`} value={bank.name}>{bank.name}</option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Account Number <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter 10-digit account number"
                    maxLength={10}
                    value={store.accountNumber}
                    onChange={(e) => store.updateField('accountNumber', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-8">
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center relative shadow-sm">
                <div className="w-10 h-10 border-2 border-blue-700 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-3 border-2 border-blue-700" />
                </div>
                <HiOutlineCheckCircle className="absolute -right-2 -bottom-2 w-7 h-7 text-blue-700 bg-white rounded-full shadow-sm" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-neutral-700 leading-tight">
                  Verification in progress
                </h2>
                <p className="text-zinc-500 text-sm max-w-sm">
                  Your account is currently under review. Once verified, you'll be visible on the marketplace to start receiving jobs.
                </p>
              </div>
            </div>

            {/* Guarantor Management Section */}
            <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500">
                    <HiOutlineMail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Guarantor Email</p>
                    {isEditingEmail ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="email"
                          className="text-sm font-medium text-zinc-700 border-b border-blue-600 outline-none w-full bg-transparent"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-zinc-700 mt-0.5">{store.guarantorEmail || 'No email provided'}</p>
                    )}
                  </div>
                </div>

                {isEditingEmail ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingEmail(false)}
                      className="text-xs font-medium text-zinc-400 hover:text-zinc-600"
                    >
                      Cancel
                    </button>
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={handleUpdateGuarantorEmail}
                      disabled={isUpdatingGuarantor}
                    >
                      {isUpdatingGuarantor ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                ) : !isGuarantorVerified && (
                  <button
                    onClick={() => {
                      setTempEmail(store.guarantorEmail)
                      setIsEditingEmail(true)
                    }}
                    className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-blue-600 transition-colors"
                  >
                    <HiOutlinePencilAlt className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {isGuarantorVerified ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <HiOutlineCheckCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-green-700 leading-tight">Verified</p>
                      <p className="text-[10px] text-green-600">Your guarantor has successfully verified your profile.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-zinc-400 text-left leading-relaxed">
                      The guarantor has been contacted but yet to be verified. You can resend the verification email if they haven't received it.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full h-11 border-zinc-200 hover:border-blue-700 hover:text-blue-700 text-zinc-600 flex items-center justify-center gap-2 font-semibold"
                      onClick={handleResendVerification}
                      disabled={isResending}
                    >
                      <HiOutlineRefresh className={cn("w-4 h-4", isResending && "animate-spin")} />
                      {isResending ? 'Resending...' : 'Resend Verification Email'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="w-full py-3.5 px-6 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center">
              <p className="text-blue-700 font-semibold text-xs flex items-center gap-2">
                <HiOutlineClock className="w-4 h-4" />
                Please check back within 24 hours
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const isStepValid = () => {
    const step1Valid = store.specialty && store.categoryId && store.assignedServices.length > 0 && store.experience && store.aboutMe && store.idType && store.idNumber && store.idPhoto
    const step2Valid = store.state && store.city && store.address && store.landmark
    const step3Valid = store.guarantorName && store.guarantorEmail && store.guarantorPhone && store.guarantorRelationship && store.guarantorWorkPlace && store.accountName && store.bankName && store.bankCode && store.accountNumber

    if (store.currentStep === 1) return step1Valid
    if (store.currentStep === 2) return step1Valid && step2Valid
    if (store.currentStep === 3) return step1Valid && step2Valid && step3Valid
    return true
  }

  if (store.currentStep === 4) {
    return (
      <div className="fixed inset-0 z-[999] bg-white p-4 flex flex-col overflow-y-auto sm:relative sm:inset-auto sm:z-auto sm:w-full sm:max-w-2xl sm:mx-auto sm:p-8 sm:rounded-2xl sm:shadow-sm sm:border sm:border-zinc-200 sm:mt-10">
        {isAccountVerified ? (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-6 my-auto">
            <div className="w-20 h-20 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center shadow-sm">
              <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-700 leading-tight">Account Verified!</h2>
              <p className="text-zinc-500 text-sm max-w-sm">
                Your professional account has been verified and activated. You are now visible on the marketplace and can start receiving jobs.
              </p>
            </div>
            <div className="w-full py-3.5 px-6 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center">
              <p className="text-green-700 font-semibold text-xs flex items-center gap-2">
                <HiOutlineCheckCircle className="w-4 h-4" />
                Your account is active and ready
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto my-auto py-6">
            {renderStep()}
          </div>
        )}
        <LocationBlockedModal
          isOpen={isBlockedModalOpen}
          onClose={() => setIsBlockedModalOpen(false)}
          onRetry={() => {
            setIsBlockedModalOpen(false)
            handleUseGPS()
          }}
          isRetrying={isLocating}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col sm:relative sm:inset-auto sm:z-auto sm:w-full sm:max-w-2xl sm:mx-auto sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:overflow-hidden sm:shadow-sm sm:border sm:border-zinc-200 sm:mt-10">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-zinc-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700">Complete set up</h2>
          {store.currentStep > 1 && (
            <button
              onClick={() => store.prevStep()}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-neutral-700 font-semibold">{steps[store.currentStep - 1]}</h3>
            <p className="text-zinc-500 text-sm">
              {store.currentStep === 1 && "Tell us about your skillset and verify your experience."}
              {store.currentStep === 2 && "Provide the location where you will be working from."}
              {store.currentStep === 3 && "This is where we send your earnings, ensure the details match."}
            </p>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all",
                  s <= store.currentStep ? "bg-blue-700" : "bg-zinc-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div ref={contentRef} className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 overscroll-contain touch-pan-y">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-6 border-t border-zinc-100">
        <Button
          disabled={!isStepValid() || isPending}
          onClick={store.currentStep === 3 ? handleFinish : () => store.nextStep()}
          className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl transition-all"
        >
          {store.currentStep === 3 ? (isPending ? "Submitting..." : "Finish set up") : "Continue"}
        </Button>
      </div>
      <LocationBlockedModal
        isOpen={isBlockedModalOpen}
        onClose={() => setIsBlockedModalOpen(false)}
        onRetry={() => {
          setIsBlockedModalOpen(false)
          handleUseGPS()
        }}
        isRetrying={isLocating}
      />
    </div>
  )
}
