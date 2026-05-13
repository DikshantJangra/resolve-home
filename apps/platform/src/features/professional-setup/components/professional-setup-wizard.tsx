'use client'

import React from 'react'
import { useProfessionalSetupStore } from '@/store/professional-setup-store'
import { Button, Input, Label } from "@resolve/ui"
import { HiOutlineChevronLeft, HiOutlineCheckCircle, HiOutlinePlus, HiOutlineTrash, HiOutlineDocumentText } from 'react-icons/hi'
import { useCategories, useUpdateEngineerProfile, useNigerianBanks } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { cn } from "@resolve/ui"
import { apiClient, ENDPOINTS } from "@resolve/api"
import { Country, State, City } from 'country-state-city'
import { HiChevronDown } from 'react-icons/hi'

export const ProfessionalSetupWizard = ({ onComplete, initialStep }: { onComplete: () => void, initialStep?: number }) => {
  const store = useProfessionalSetupStore()
  const { data: categories } = useCategories()
  const { data: banks = [], isLoading: loadingBanks } = useNigerianBanks()
  const { mutate: updateProfile, isPending } = useUpdateEngineerProfile()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isLocating, setIsLocating] = React.useState(false)

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

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
        toast.error("Location access denied or unavailable.")
      }
    )
  }

  React.useEffect(() => {
    if (initialStep) {
      store.setStep(initialStep)
    }
  }, [initialStep])

  React.useEffect(() => {
    // Prevent scrolling when the setup wizard is active
    const originalBodyOverflow = window.getComputedStyle(document.body).overflow
    const originalHtmlOverflow = window.getComputedStyle(document.documentElement).overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [])

  // Sanity check for experience enum
  React.useEffect(() => {
    const validRanges = ['1-3', '4-7', '8-12', '13+']
    if (store.experience && !validRanges.includes(store.experience)) {
      console.log('Resetting invalid experience value:', store.experience)
      store.updateField('experience', '')
    }
  }, [store.experience])
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
      toast.error('Upload failed, please try again')
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
      yearsOfExperience: store.experience,
      idType: store.idType,
      idNumber: store.idNumber,
      idDocument: store.idPhoto,
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
      guarantor: {
        name: store.guarantorName,
        email: store.guarantorEmail,
      }
    }

    console.log('[SetupWizard] Submitting payload:', payload)

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Verification submitted successfully!")
        store.setStep(4)
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to submit verification")
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
                  onChange={(e) => store.updateField('categoryId', e.target.value)}
                >
                  <option value="">Select your category</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

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
                <Label>Select ID type <span className="text-red-500">*</span></Label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 text-sm focus:border-blue-700 outline-none"
                  value={store.idType}
                  onChange={(e) => store.updateField('idType', e.target.value)}
                >
                  <option value="">Select ID type (NIN, BVN, Passport)</option>
                  <option value="NIN">NIN</option>
                  <option value="BVN">BVN</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>ID Number <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="000 000 000 000"
                  value={store.idNumber}
                  onChange={(e) => store.updateField('idNumber', e.target.value)}
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
                          <svg className="w-4 h-4 animate-spin text-blue-700" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
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
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-12">
            <div className="space-y-8 flex flex-col items-center">
              <div className="w-14 h-14 bg-white border-2 border-zinc-200 rounded-xl flex items-center justify-center relative">
                <div className="w-12 h-12 border-2 border-zinc-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-3 border-2 border-zinc-600" />
                </div>
                <HiOutlineCheckCircle className="absolute -right-2 -bottom-2 w-6 h-6 text-blue-700 bg-white rounded-full" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-neutral-700 leading-tight">
                  Verification in progress
                </h2>
                <p className="text-zinc-600 text-base max-w-sm">
                  Your account is currently under review. Once verified, you'll be visible on the marketplace to start receiving jobs.
                </p>
              </div>
            </div>

            <div className="w-full py-4 px-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center">
              <p className="text-blue-700 font-medium text-sm">
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
    const step1Valid = store.specialty && store.categoryId && store.experience && store.idType && store.idNumber && store.idPhoto
    const step2Valid = store.state && store.city && store.address && store.landmark
    const step3Valid = store.guarantorName && store.guarantorEmail && store.accountName && store.bankName && store.bankCode && store.accountNumber

    if (store.currentStep === 1) return step1Valid
    if (store.currentStep === 2) return step1Valid && step2Valid
    if (store.currentStep === 3) return step1Valid && step2Valid && step3Valid
    return true
  }

  if (store.currentStep === 4) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-zinc-200 mt-10">
        {renderStep()}
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white flex flex-col min-h-screen sm:min-h-[600px] rounded-none sm:rounded-2xl overflow-hidden shadow-sm border-0 sm:border border-zinc-200 mt-0 sm:mt-10">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-zinc-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700">Complete set up</h2>
          <button
            onClick={() => store.prevStep()}
            className="flex items-center gap-2 text-blue-700"
            disabled={store.currentStep === 1}
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
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
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar">
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
    </div>
  )
}
