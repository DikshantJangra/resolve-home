'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { HiOutlineLocationMarker, HiChevronDown, HiOutlineHome, HiOutlineLightningBolt, HiOutlineMap } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button, Input, Label, cn } from "@resolve/ui"
import { useUserProfile } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { Country, State, City } from 'country-state-city'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { LocationBlockedModal } from '@/components/shared/location-blocked-modal'

export const LocationStep = () => {
  const { location, setLocation, setStep, priority } = useBookingStore()
  const { data: profile } = useUserProfile()
  const isEmergency = priority === 'Emergency'
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    country: location?.country || 'Nigeria',
    countryCode: location?.countryCode || 'NG',
    state: location?.state || '',
    stateCode: '',
    city: location?.city || '',
    streetAddress: location?.streetAddress || '',
    landmark: location?.landmark || '',
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
  })

  // Set initial state code if state name exists
  useEffect(() => {
    if (formData.state && !formData.stateCode) {
      const states = State.getStatesOfCountry('NG')
      const matched = states.find(s => s.name === formData.state)
      if (matched) {
        setFormData(prev => ({ ...prev, stateCode: matched.isoCode }))
      }
    }
  }, [])

  const nigerianStates = useMemo(() =>
    formData.countryCode ? State.getStatesOfCountry(formData.countryCode) : [],
    [formData.countryCode]
  )
  const citiesOfState = useMemo(() =>
    (formData.countryCode && formData.stateCode) ? City.getCitiesOfState(formData.countryCode, formData.stateCode) : [],
    [formData.countryCode, formData.stateCode]
  )

  const NIGERIAN_STATES = [
    "Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Ogun", "Enugu", "Edo", "Kaduna", "Delta",
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Ebonyi", "Ekiti", "Gombe", "Imo", "Jigawa", "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa",
    "Niger", "Ondo", "Osun", "Plateau", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ]

  const LAGOS_AREAS = ["Ikeja", "Lekki", "Victoria Island", "Ajah", "Surulere", "Yaba", "Maryland", "Ikoyi", "Magodo", "Ikorodu"]
  const ABUJA_AREAS = ["Wuse", "Garki", "Maitama", "Asokoro", "Gwarinpa", "Jabi", "Central Business District"]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleStateChange = (stateCode: string) => {
    const state = nigerianStates.find(s => s.isoCode === stateCode)
    if (state) {
      setFormData(prev => ({
        ...prev,
        state: state.name,
        stateCode: state.isoCode,
        city: '' // Reset city when state changes
      }))
    }
  }

  const handleUseHomeAddress = () => {
    const addr = profile?.user?.homeAddress || profile?.homeAddress || profile?.bioAddress || profile?.address;

    if (addr) {
      const countryCode = addr.country || 'NG'
      const states = State.getStatesOfCountry(countryCode)
      const matchedState = states.find(s =>
        s.name.toLowerCase() === (addr.state || '').toLowerCase() ||
        s.isoCode === addr.state
      )
      const countryObj = Country.getCountryByCode(countryCode)

      setFormData({
        country: countryObj?.name || addr.country || 'Nigeria',
        countryCode,
        state: matchedState?.name || addr.state || '',
        stateCode: matchedState?.isoCode || '',
        city: addr.city || '',
        streetAddress: addr.street || addr.streetAddress || addr.address || '',
        landmark: addr.landmark || addr.nearestLandmark || '',
        latitude: addr.latitude || 0,
        longitude: addr.longitude || 0,
      })
    }
  }

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    // Check permission state first
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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()

          if (data && data.address) {
            const { state, city, town, village, road, neighbourhood, suburb, county, country_code } = data.address
            const detectedCountryCode = (country_code || 'NG').toUpperCase()

            const states = State.getStatesOfCountry(detectedCountryCode)
            const rawState = (state || county || '').replace(/ State$/i, '').trim()
            const matchedState = states.find(s =>
              s.name.toLowerCase() === rawState.toLowerCase() ||
              s.name.toLowerCase().includes(rawState.toLowerCase()) ||
              rawState.toLowerCase().includes(s.name.toLowerCase())
            )

            const country = Country.getCountryByCode(detectedCountryCode)
            // Use the most specific place name available for city
            const rawCity = (city || town || county || village || suburb || neighbourhood || '').replace(/ (City|LGA|Local Government Area)$/i, '').trim()

            setFormData(prev => ({
              ...prev,
              country: country?.name || prev.country,
              countryCode: detectedCountryCode,
              state: matchedState?.name || rawState,
              stateCode: matchedState?.isoCode || '',
              city: rawCity,
              streetAddress: road || neighbourhood || suburb || data.display_name.split(',')[0] || '',
              landmark: '',
              latitude,
              longitude,
            }))
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
        console.error("Geolocation error:", error.code, error.message)
        if (error.code === 1) { // Location access denied
          setIsBlockedModalOpen(true)
        } else {
          let message = "Failed to get your location."
          if (error.code === 2) message = "Location unavailable. Please try again or enter manually."
          else if (error.code === 3) message = "Location request timed out. Please try again."
          toast.error(message)
        }
      }
    )
  }

  const [isLocating, setIsLocating] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const [currentGPS, setCurrentGPS] = useState<[number, number] | null>(null)

  // Get current GPS for map default center
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentGPS([pos.coords.longitude, pos.coords.latitude]),
      () => { }
    )
  }, [])

  // Init map when shown
  useEffect(() => {
    if (!showMap || !mapContainerRef.current || mapRef.current) return

    // Priority: saved coords → current GPS → Lagos default
    const center: [number, number] =
      (formData.longitude && formData.latitude)
        ? [formData.longitude, formData.latitude]
        : currentGPS
          ? currentGPS
          : [3.3792, 6.5244]

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center,
      zoom: 14,
    })

    const marker = new maplibregl.Marker({ draggable: true, color: '#1d4ed8' })
      .setLngLat(center)
      .addTo(map)

    marker.on('dragend', async () => {
      const { lng, lat } = marker.getLngLat()
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
      // Reverse geocode
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        const data = await res.json()
        if (data?.address) {
          const { road, neighbourhood, suburb, city, town, village, state, country_code } = data.address
          const detectedCC = (country_code || 'NG').toUpperCase()
          const states = State.getStatesOfCountry(detectedCC)
          const cleanState = (state || '').replace(/ State$/i, '')
          const matched = states.find(s => s.name.toLowerCase().includes(cleanState.toLowerCase()) || cleanState.toLowerCase().includes(s.name.toLowerCase()))
          const country = Country.getCountryByCode(detectedCC)
          setFormData(prev => ({
            ...prev,
            country: country?.name || prev.country,
            countryCode: detectedCC,
            state: matched?.name || cleanState,
            stateCode: matched?.isoCode || '',
            city: (city || town || village || suburb || '').replace(/ (City|LGA)$/i, ''),
            streetAddress: road || neighbourhood || prev.streetAddress,
            latitude: lat,
            longitude: lng,
          }))
          toast.success('Address updated from pin')
        }
      } catch { }
    })

    // Click to move marker
    map.on('click', (e) => {
      marker.setLngLat(e.lngLat)
      marker.fire('dragend')
    })

    mapRef.current = map
    markerRef.current = marker
    return () => { map.remove(); mapRef.current = null; markerRef.current = null }
  }, [showMap])

  // Update marker when coords change externally
  useEffect(() => {
    if (markerRef.current && formData.latitude && formData.longitude) {
      markerRef.current.setLngLat([formData.longitude, formData.latitude])
      mapRef.current?.flyTo({ center: [formData.longitude, formData.latitude], zoom: 15 })
    }
  }, [formData.latitude, formData.longitude])

  const isFormValid = formData.state.trim() && formData.city.trim() && formData.streetAddress.trim() && formData.landmark.trim()
  const handleContinue = async () => {
    // 1. Check if profile is complete (check both root and nested user object)
    const name = profile?.name || profile?.user?.name;
    const email = profile?.email || profile?.user?.email;
    const phone = profile?.phone || profile?.user?.phone || profile?.phoneNumber;

    const isProfileComplete = !!(name && email && phone);

    if (!isProfileComplete) {
      toast.error("Please complete your profile (name, email, phone) before booking", {
        description: "You can update these details in your settings.",
        action: {
          label: "Go to Settings",
          onClick: () => window.location.href = '/settings'
        }
      });
      return;
    }

    // 2. Validate scheduling
    const { scheduledDate, scheduledTime } = useBookingStore.getState();
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select both a date and time for the service.");
      return;
    }

    // 3. Validate date is in the future (standard bookings only)
    if (!isEmergency) {
      const bookingDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
      if (bookingDateTime <= new Date()) {
        toast.error('Booking date must be in the future. Please select a future date and time.')
        return
      }
    }

    setLocation(formData)
    setStep(5)
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-0">
      <div className="flex-1 px-5 pt-8 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="flex flex-col justify-start items-start gap-8 pb-10">

          {isEmergency && (
            <div className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <HiOutlineLightningBolt className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-blue-900 text-sm font-semibold">Emergency Priority Set</p>
                <p className="text-blue-800 text-xs leading-relaxed">
                  We've automatically scheduled your service for <span className="font-bold">Today</span> within the next <span className="font-bold">60 minutes</span>.
                  Our nearest professional is being alerted for immediate response.
                </p>
              </div>
            </div>
          )}

          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="flex gap-3 w-full">
              <button
                onClick={handleUseGPS}
                disabled={isLocating}
                className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <HiOutlineLocationMarker className={cn("w-4 h-4 shrink-0", isLocating && "animate-pulse")} />
                {isLocating ? "Getting..." : "Use GPS"}
              </button>
              <button
                onClick={() => setShowMap(v => !v)}
                className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <HiOutlineMap className="w-4 h-4 shrink-0" />
                {showMap ? 'Hide map' : 'Pick on map'}
              </button>
            </div>

            {(profile?.user?.homeAddress || profile?.homeAddress || profile?.bioAddress || profile?.address) && (
              <button
                onClick={handleUseHomeAddress}
                className="self-stretch inline-flex justify-center items-center gap-2 py-2 text-blue-700 text-sm font-medium underline hover:text-blue-800 transition-colors"
              >
                <HiOutlineHome className="w-5 h-5" />
                Use my home address
              </button>
            )}
          </div>

          {/* Map picker */}
          {showMap && (
            <div className="w-full flex flex-col gap-2">
              <p className="text-zinc-500 text-xs">Drag the pin or tap the map to set your exact location.</p>
              <div ref={mapContainerRef} className="w-full h-52 rounded-xl overflow-hidden border border-zinc-200" />
              {formData.latitude !== 0 && (
                <p className="text-zinc-400 text-[10px]">
                  📍 {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                </p>
              )}
            </div>
          )}

          <div className="w-full flex flex-col justify-start items-start gap-6">
            {/* Country */}
            <div className="w-full flex flex-col justify-start items-start gap-1.5">
              <div className="w-full inline-flex justify-start items-start gap-0.5">
                <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Country</Label>
                <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
              </div>
              <div className="w-full relative">
                <select
                  value={formData.countryCode}
                  onChange={(e) => {
                    const country = Country.getCountryByCode(e.target.value)
                    if (country) {
                      setFormData(prev => ({
                        ...prev,
                        country: country.name,
                        countryCode: country.isoCode,
                        state: '',
                        stateCode: '',
                        city: ''
                      }))
                    }
                  }}
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-600 focus:border-blue-700 outline-none appearance-none cursor-pointer"
                >
                  {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                  ))}
                </select>
                <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State */}
              <div className="w-full flex flex-col justify-start items-start gap-1.5">
                <div className="w-full inline-flex justify-start items-start gap-0.5">
                  <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">State</Label>
                  <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
                </div>
                <div className="w-full relative">
                  <select
                    value={formData.stateCode}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-600 focus:border-blue-700 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select State</option>
                    {nigerianStates.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                    ))}
                  </select>
                  <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div className="w-full flex flex-col justify-start items-start gap-1.5">
                <div className="w-full inline-flex justify-start items-start gap-0.5">
                  <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">City / Area</Label>
                  <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
                </div>
                {/* Show text input when GPS set a city not in the dropdown */}
                {formData.city && formData.city !== 'Other' && !citiesOfState.find(c => c.name === formData.city) ? (
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="City / Area"
                    className="w-full h-12 border-zinc-300 focus:border-blue-700"
                  />
                ) : (
                  <div className="w-full relative">
                    <select
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      disabled={!formData.stateCode}
                      className="w-full h-12 px-4 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-600 focus:border-blue-700 outline-none appearance-none cursor-pointer disabled:bg-zinc-50"
                    >
                      <option value="">Select City / Area</option>
                      {citiesOfState.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                      {formData.stateCode && <option value="Other">Other...</option>}
                    </select>
                    <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            {/* Manual City Entry if "Other" is selected */}
            {formData.city === 'Other' && (
              <div className="self-stretch flex flex-col justify-start items-start gap-1.5 animate-in fade-in slide-in-from-top-2">
                <Input
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter your specific area"
                  className="w-full h-12"
                />
              </div>
            )}

            {/* Street Address */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
              <div className="self-stretch inline-flex justify-start items-start gap-0.5">
                <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Street Address</Label>
                <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
              </div>
              <Input
                value={formData.streetAddress}
                onChange={(e) => handleChange('streetAddress', e.target.value)}
                placeholder="Enter Street Address"
                className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5"
              />
            </div>

            {/* Landmark */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
              <div className="self-stretch inline-flex justify-start items-start gap-0.5">
                <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Nearest Landmark/Area</Label>
                <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
              </div>
              <Input
                value={formData.landmark}
                onChange={(e) => handleChange('landmark', e.target.value)}
                placeholder="e.g Near ikeja mall"
                className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5"
              />
            </div>

            {/* Date & Time */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full flex flex-col justify-start items-start gap-1.5">
                <div className="w-full inline-flex justify-start items-start gap-0.5">
                  <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Date</Label>
                  <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
                </div>
                <Input
                  type="date"
                  disabled={isEmergency}
                  min={new Date().toISOString().split('T')[0]}
                  value={useBookingStore.getState().scheduledDate || ''}
                  onChange={(e) => useBookingStore.getState().setScheduledDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5 disabled:bg-zinc-50"
                />
              </div>
              <div className="w-full flex flex-col justify-start items-start gap-1.5">
                <div className="w-full inline-flex justify-start items-start gap-0.5">
                  <Label className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Time</Label>
                  <span className="text-red-600 text-sm font-medium font-['Inter'] leading-5">*</span>
                </div>
                <div className="relative w-full">
                  <Input
                    type={isEmergency ? "text" : "time"}
                    disabled={isEmergency}
                    value={useBookingStore.getState().scheduledTime || ''}
                    onChange={(e) => useBookingStore.getState().setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-stone-300 border-none focus:outline-blue-700 text-zinc-600 text-sm font-normal font-['Inter'] leading-5 disabled:bg-zinc-50 disabled:text-blue-700 disabled:font-bold"
                  />
                  {isEmergency && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full font-bold">
                      AUTO-SET
                    </span>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className="p-5 mt-auto bg-white border-t border-zinc-100">
        <button
          disabled={!isFormValid}
          onClick={handleContinue}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-between items-center transition-all ${!isFormValid ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
            }`}
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Continue</div>
        </button>
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

