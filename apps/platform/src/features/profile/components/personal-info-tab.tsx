'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Button, Input, Label, Textarea } from "@resolve/ui"
import { useUpdateBioAddress, useUpdateEngineerLocation } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlinePencilAlt, HiOutlineCheck, HiOutlineLocationMarker } from 'react-icons/hi'
import { Country, State, City } from 'country-state-city'

interface PersonalInfoTabProps {
  fullName: string
  email: string
  phone: string
  country: string
  state: string
  city: string
  address: string
  latitude?: number
  longitude?: number
  bio: string
  role?: string
  hasEngineerProfile?: boolean
}

const selectClass = "w-full h-10 px-3 rounded-md border border-zinc-200 text-sm text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"

export const PersonalInfoTab = ({
  fullName,
  email,
  phone,
  country: initialCountry,
  state: initialState,
  city: initialCity,
  address: initialAddress,
  latitude: initialLatitude,
  longitude: initialLongitude,
  bio: initialBio,
  role,
  hasEngineerProfile = false,
}: PersonalInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [formData, setFormData] = useState({
    country: initialCountry || '',
    state: initialState || '',
    city: initialCity || '',
    homeAddress: initialAddress || '',
    bio: initialBio || '',
    latitude: initialLatitude || undefined as number | undefined,
    longitude: initialLongitude || undefined as number | undefined
  })

  const updateMutation = useUpdateBioAddress()
  const updateLocationMutation = useUpdateEngineerLocation()

  console.log('--- PERSONAL INFO TAB RENDER ---', {
    props: { initialCountry, initialState, initialCity, initialAddress, initialBio, initialLatitude, initialLongitude, role, hasEngineerProfile },
    formData,
    isEditing
  })

  // Sync form state when profile data is refetched (e.g. after a successful save)
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        country: initialCountry || '',
        state: initialState || '',
        city: initialCity || '',
        homeAddress: initialAddress || '',
        bio: initialBio || '',
        latitude: initialLatitude || undefined,
        longitude: initialLongitude || undefined,
      })
    }
  }, [initialCountry, initialState, initialCity, initialAddress, initialBio, initialLatitude, initialLongitude])

  const countries = useMemo(() => Country.getAllCountries(), [])
  const states = useMemo(
    () => formData.country ? State.getStatesOfCountry(formData.country) : [],
    [formData.country]
  )
  const cities = useMemo(
    () => formData.country && formData.state
      ? City.getCitiesOfState(formData.country, formData.state)
      : [],
    [formData.country, formData.state]
  )

  const handleCountryChange = (countryCode: string) => {
    setFormData(prev => ({ ...prev, country: countryCode, state: '', city: '' }))
  }

  const handleStateChange = (stateCode: string) => {
    setFormData(prev => ({ ...prev, state: stateCode, city: '' }))
  }

  const getCountryName = (code: string) => Country.getCountryByCode(code)?.name || code
  const getStateName = (countryCode: string, stateCode: string) =>
    State.getStateByCodeAndCountry(stateCode, countryCode)?.name || stateCode

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // Query free OpenStreetMap Nominatim reverse geocoder
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`
          )
          const data = await response.json()
          
          if (data && data.address) {
            const addr = data.address
            const countryCode = addr.country_code ? addr.country_code.toUpperCase() : ''
            
            let stateCode = ''
            if (countryCode) {
              const stateList = State.getStatesOfCountry(countryCode)
              const stateName = addr.state || addr.region || ''
              const matchedState = stateList.find(
                s => s.name.toLowerCase().includes(stateName.toLowerCase()) || 
                     stateName.toLowerCase().includes(s.name.toLowerCase())
              )
              stateCode = matchedState ? matchedState.isoCode : ''
            }

            const city = addr.city || addr.town || addr.village || addr.suburb || ''
            const street = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || data.display_name || ''

            setFormData(prev => ({
              ...prev,
              country: countryCode,
              state: stateCode,
              city: city,
              homeAddress: street,
              latitude,
              longitude
            }))
            
            toast.success("Location autodetected and filled successfully!")
          } else {
            setFormData(prev => ({ ...prev, latitude, longitude }))
            toast.success(`GPS coordinates detected: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error)
          setFormData(prev => ({ ...prev, latitude, longitude }))
          toast.success(`GPS coordinates detected: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        let errMsg = "Failed to retrieve location"
        if (error.code === error.PERMISSION_DENIED) {
          errMsg = "Location permission denied"
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errMsg = "Location position unavailable"
        } else if (error.code === error.TIMEOUT) {
          errMsg = "Location request timed out"
        }
        toast.error(errMsg)
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleSave = async () => {
    const isWorker = role === 'worker' || role === 'Work as a Professional' || role === 'engineer'
    
    console.log('--- PERSONAL INFO TAB SAVE ---', {
      bio: formData.bio,
      homeAddress: {
        country: formData.country,
        state: formData.state,
        city: formData.city,
        street: formData.homeAddress,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      isWorker,
      hasEngineerProfile
    })

    try {
      // Save bio and address info to user profile
      await updateMutation.mutateAsync({
        bio: formData.bio,
        homeAddress: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
          street: formData.homeAddress,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }
      })

      // If pro/worker AND has an existing engineer record, also sync live GPS coordinates
      if (isWorker && hasEngineerProfile && formData.latitude !== undefined && formData.longitude !== undefined) {
        console.log('--- SYNCING LIVE ENGINEER LOCATION ---', {
          latitude: formData.latitude,
          longitude: formData.longitude
        })
        await updateLocationMutation.mutateAsync({
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      }

      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (err: any) {
      console.error("Save error:", err)
      toast.error(err?.response?.data?.error || 'Failed to update profile')
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* GPS Autocomplete Panel */}
          <div className="col-span-full">
            <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-800 text-sm font-semibold flex items-center gap-1.5 font-['Inter']">
                  <HiOutlineLocationMarker className="w-5 h-5 text-blue-700" />
                  GPS Location Autocomplete
                </span>
                <span className="text-zinc-500 text-xs leading-normal font-['Inter']">
                  Automatically fetch your current GPS coordinates to instantly geocode and autofill your profile country, state, city, and street address.
                </span>
                {formData.latitude && formData.longitude && (
                  <span className="text-[10px] text-blue-800 bg-blue-50 border border-blue-100 font-mono px-2 py-0.5 rounded w-fit mt-1.5">
                    Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </span>
                )}
              </div>
              <Button
                type="button"
                onClick={handleGetGPS}
                isLoading={isLocating}
                variant="outline"
                className="text-xs h-9 border-zinc-200 text-zinc-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 shrink-0 font-semibold rounded-xl"
              >
                {isLocating ? "Getting Location..." : "Use Current GPS"}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 opacity-60">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Full name</Label>
            <div className="text-neutral-700 text-sm font-normal">{fullName}</div>
          </div>
          <div className="space-y-1.5 opacity-60">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Email address</Label>
            <div className="text-neutral-700 text-sm font-normal">{email}</div>
          </div>
          <div className="space-y-1.5 opacity-60">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Phone number</Label>
            <div className="text-neutral-700 text-sm font-normal">{phone}</div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Country</Label>
            <select
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">State</Label>
            <select
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              disabled={!formData.country}
              className={selectClass}
            >
              <option value="">Select state</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">City</Label>
            {cities.length > 0 ? (
              <select
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                disabled={!formData.state}
                className={selectClass}
              >
                <option value="">Select city</option>
                {cities.map((city, i) => (
                  <option key={i} value={city.name}>{city.name}</option>
                ))}
              </select>
            ) : (
              <Input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Enter city"
                className="h-10 border-zinc-200"
              />
            )}
          </div>
          <div className="col-span-full space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Home address</Label>
            <Input
              value={formData.homeAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, homeAddress: e.target.value }))}
              className="h-10 border-zinc-200"
            />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="min-h-[120px] border-zinc-200"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-100">
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            isLoading={updateMutation.isPending || updateLocationMutation.isPending}
            className="bg-blue-700 text-white"
          >
            <HiOutlineCheck className="mr-2 w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-all"
        title="Edit Profile"
      >
        <HiOutlinePencilAlt className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Full name</label>
          <div className="text-neutral-700 text-sm font-normal">{fullName}</div>
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Email address</label>
          <div className="text-neutral-700 text-sm font-normal">{email}</div>
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Phone number</label>
          <div className="text-neutral-700 text-sm font-normal">{phone}</div>
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Country</label>
          <div className="text-neutral-700 text-sm font-normal">
            {initialCountry ? getCountryName(initialCountry) : 'Not provided'}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">State</label>
          <div className="text-neutral-700 text-sm font-normal">
            {initialState ? getStateName(initialCountry, initialState) : 'Not provided'}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">City</label>
          <div className="text-neutral-700 text-sm font-normal">{initialCity || 'Not provided'}</div>
        </div>
        <div className="col-span-full space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Home address</label>
          <div className="text-neutral-700 text-sm font-normal">{initialAddress || 'No primary address set'}</div>
        </div>
        {initialLatitude && initialLongitude && (
          <div className="col-span-full space-y-1.5 bg-blue-50/40 rounded-xl p-3 border border-blue-100 flex items-center gap-2 text-blue-800 text-xs">
            <HiOutlineLocationMarker className="w-4 h-4 text-blue-600 shrink-0 animate-pulse" />
            <span>GPS Coordinates: <strong>{initialLatitude.toFixed(6)}, {initialLongitude.toFixed(6)}</strong> (Verified auto-coordinates)</span>
          </div>
        )}
        <div className="col-span-full space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Bio</label>
          <div className="text-slate-900 text-sm font-normal leading-relaxed">
            {initialBio || 'No bio provided.'}
          </div>
        </div>
      </div>
    </div>
  )
}
