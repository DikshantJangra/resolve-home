'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineIdentification,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineExternalLink
} from 'react-icons/hi'
import { cn, Button, Skeleton, formatImageUrl } from "@resolve/ui"
import { useAdminPendingEngineerById, useAdminApproveEngineer, useAdminRejectEngineer, useCategories, useAdminVerifyGuarantor } from '@/hooks/api-hooks'
import { toast } from 'sonner'

export default function VerificationDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: engineer, isLoading, error } = useAdminPendingEngineerById(id as string)
  const { data: categories } = useCategories()

  React.useEffect(() => {
    if (engineer) {
      console.log('[VerificationDetail] Full Engineer Object:', engineer);
      const gKeys = Object.keys(engineer).filter(k => k.toLowerCase().includes('guar'));
      console.log('[VerificationDetail] All "Guar" related keys found:', gKeys);
      gKeys.forEach(k => console.log(`[VerificationDetail] Value of ${k}:`, (engineer as any)[k]));
    }
  }, [engineer]);



  const { mutate: approveEngineer, isPending: isApproving } = useAdminApproveEngineer()
  const { mutate: rejectEngineer, isPending: isRejecting } = useAdminRejectEngineer()
  const { mutate: verifyGuarantor, isPending: isVerifyingGuarantor } = useAdminVerifyGuarantor()
  const isVerifying = isApproving || isRejecting || isVerifyingGuarantor

  // Helper to find category name from ID
  const getCategoryName = (categoryId: string) => {
    if (!categories || !Array.isArray(categories)) return categoryId
    const category = categories.find((c: any) =>
      c.id === categoryId ||
      c._id === categoryId ||
      String(c.id) === String(categoryId) ||
      String(c._id) === String(categoryId)
    )
    return category?.name || categoryId
  }

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionNote, setRejectionNote] = useState('')

  const handleAction = (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !isRejectModalOpen) {
      setIsRejectModalOpen(true)
      return
    }

    // Try to find the most specific ID (engineer profile ID)
    const action = status === 'approved' ? approveEngineer : rejectEngineer
    const payload = status === 'approved' ? { id: targetId as string } : { id: targetId as string, note: rejectionNote }

    console.log(`[VerificationDetail] Performing ${status} action on ID:`, targetId);

    action(payload as any, {
      onSuccess: () => {
        toast.success(`Engineer ${status === 'approved' ? 'approved' : 'rejected'} successfully`)
        setIsRejectModalOpen(false)
        setRejectionNote('')
        router.push('/verification')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto animate-pulse">
        <div className="h-6 w-48 bg-zinc-200 rounded" />
        <div className="h-20 w-full bg-stone-50 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-white rounded-xl" />
          <div className="h-96 bg-white rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !engineer) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <HiOutlineExclamationCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">Failed to load engineer details</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  // Robust data extraction
  // The data might be in engineer.user, engineer.engineerProfile, or engineer itself
  const user = engineer.user || (engineer.email ? engineer : {});
  const profile = engineer.engineerProfile || engineer.profile || engineer.engineer || {};
  const guarantor = engineer.guarantor || profile.guarantor || {};
  const location = engineer.location || profile.location || engineer.location || {};
  const idVerification = engineer.idVerification || profile.idVerification || {};

  const displayData = {
    name: engineer.fullName || engineer.name || user.fullName || user.name || profile.name || 'N/A',
    email: engineer.email || user.email || profile.email || 'N/A',
    phone: engineer.phoneNumber || engineer.phone || user.phoneNumber || user.phone || profile.phone || 'N/A',
    category: engineer.primarySpecialty || profile.primarySpecialty || getCategoryName(engineer.category || profile.category) || 'N/A',
    experience: engineer.yearsOfExperience || profile.yearsOfExperience || engineer.experience || profile.experience || 'N/A',
    address: engineer.address || location.streetAddress || profile.address || 'N/A',
    city: engineer.city || location.city || profile.city || 'N/A',
    state: engineer.state || location.state || profile.state || 'N/A',
    bvn: engineer.idNumber || engineer.bvn || profile.idNumber || profile.bvn || idVerification.bvn || 'N/A',
    idType: engineer.idType || profile.idType || idVerification.type || 'BVN',
    documentUrl: profile.idDocument || profile.documentUrl || idVerification.documentUrl || idVerification.document || profile.idVerification?.documentUrl || engineer.idDocument || engineer.documentUrl || null,
    guarantorName: guarantor.name || guarantor.fullName || profile.guarantorName || engineer.guarantorName || (Array.isArray(engineer.guarantors) ? engineer.guarantors[0]?.name : 'N/A'),
    guarantorPhone: guarantor.phone || guarantor.phoneNumber || profile.guarantorPhone || engineer.guarantorPhone || (Array.isArray(engineer.guarantors) ? engineer.guarantors[0]?.phone : 'N/A'),
    guarantorEmail: guarantor.email || profile.guarantorEmail || engineer.guarantorEmail || (Array.isArray(engineer.guarantors) ? engineer.guarantors[0]?.email : 'N/A'),
    guarantorRelationship: guarantor.relationship || profile.relationship || engineer.guarantorRelationship || (Array.isArray(engineer.guarantors) ? engineer.guarantors[0]?.relationship : 'N/A'),
    guarantorWorkPlace: guarantor.workPlace || guarantor.placeOfWork || profile.placeOfWork || engineer.guarantorWorkPlace || (Array.isArray(engineer.guarantors) ? engineer.guarantors[0]?.workPlace : 'N/A'),

    isGuarantorVerified: !!(profile.guarantorVerification?.verified || profile.isGuarantorVerified || engineer.isGuarantorVerified || profile.guarantorVerified || engineer.guarantorVerified || user.isGuarantorVerified)
  };

  // Enhanced Debugging
  React.useEffect(() => {
    if (engineer) {
      console.log('[VerificationDetail] >>> FULL ENGINEER OBJECT:', engineer);
      console.log('[VerificationDetail] >>> EXTRACTED PROFILE:', profile);
      console.log('[VerificationDetail] >>> DOCUMENT URL ATTEMPT:', displayData.documentUrl);
      
      // Specifically check for any document-like keys in profile
      const docKeys = Object.keys(profile).filter(k => k.toLowerCase().includes('doc') || k.toLowerCase().includes('id'));
      console.log('[VerificationDetail] Potential Doc/ID keys in profile:', docKeys);
      docKeys.forEach(k => console.log(`[VerificationDetail] profile[${k}] =`, (profile as any)[k]));
    }
  }, [engineer, profile, displayData.documentUrl]);



  console.log('[VerificationDetail] Computed Display Data:', displayData);

    const rawDocUrl = displayData.documentUrl;
    const documentUrl = (rawDocUrl && rawDocUrl !== 'null' && rawDocUrl !== 'undefined') ? rawDocUrl : null;

    const targetId = (engineer?.engineerProfile?.id || engineer?.profile?.id || engineer?.id || id) as string

    const canApprove = displayData.isGuarantorVerified && !isVerifying;

    return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors group"
      >
        <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium font-inter">Back to verification requests</span>
      </button>

      {/* Profile Header */}
      <div className="bg-stone-50 rounded-2xl border border-zinc-300 p-5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl border-2 border-blue-700">
            {displayData.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-neutral-700 text-lg font-semibold font-plus-jakarta">{displayData.name}</h2>
              {engineer.status === 'approved' && <HiOutlineCheckCircle className="text-blue-700 w-4 h-4" />}
            </div>
            <p className="text-zinc-500 text-sm font-normal font-inter">{displayData.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button
            disabled={!canApprove}
            onClick={() => handleAction('approved')}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
            title={displayData.isGuarantorVerified ? "Approve" : "Guarantor verification pending"}
          >
            <HiOutlineCheckCircle className="w-6 h-6" />
          </button>
          <button
            disabled={isVerifying}
            onClick={() => handleAction('rejected')}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
            title="Reject"
          >
            <HiOutlineXCircle className="w-6 h-6" />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
            title="Flag"
          >
            <HiOutlineExclamationCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Information Details */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-zinc-300 p-6 flex flex-col gap-6 shadow-sm">
          <h3 className="text-neutral-700 text-lg font-semibold font-inter flex items-center gap-2">
            <HiOutlineIdentification className="text-blue-700" />
            Information Details
          </h3>

          <div className="flex flex-col gap-5">
            <InfoRow label="Full Name" value={displayData.name} icon={<HiOutlineIdentification />} />
            <InfoRow
              label="Category"
              value={displayData.category}
              icon={<HiOutlineBriefcase />}
            />
            <InfoRow label="Phone Number" value={displayData.phone} icon={<HiOutlinePhone />} />
            <InfoRow label="Email Address" value={displayData.email} icon={<HiOutlineMail />} />
            <InfoRow label="Experience" value={displayData.experience} icon={<HiOutlineClock />} />
            <InfoRow
              label="Home Address"
              value={`${displayData.address}, ${displayData.city}`}
              icon={<HiOutlineLocationMarker />}
            />
            <InfoRow label="BVN" value={displayData.bvn} icon={<HiOutlineShieldCheck />} />
          </div>
        </div>

        {/* Guarantor Information */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-zinc-300 p-6 flex flex-col gap-6 shadow-sm">
          <h3 className="text-neutral-700 text-lg font-semibold font-inter flex items-center gap-2">
            <HiOutlineShieldCheck className="text-blue-700" />
            Guarantor Information
          </h3>

          <div className="flex flex-col gap-5">
            <InfoRow label="Guarantor Name" value={displayData.guarantorName} />
            <InfoRow label="Phone Number" value={displayData.guarantorPhone} />
            <InfoRow label="Email Address" value={displayData.guarantorEmail} />
            <InfoRow label="Relationship" value={displayData.guarantorRelationship} />
            <InfoRow label="Place of Work" value={displayData.guarantorWorkPlace} />

            {!displayData.isGuarantorVerified ? (
              <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
                <HiOutlineExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm font-medium font-inter leading-relaxed flex-1">
                  The guarantor has been contacted but yet to be verified via automated email.
                </p>
                <button
                  onClick={() => verifyGuarantor(targetId, {
                    onSuccess: () => toast.success('Guarantor verified successfully')
                  })}
                  disabled={isVerifyingGuarantor}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  {isVerifyingGuarantor ? 'Verifying...' : (
                    <>
                      <HiOutlineCheckCircle className="w-4 h-4" />
                      Verify Now
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
                <HiOutlineCheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm font-medium font-inter leading-relaxed">
                  The guarantor has been contacted.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Documents */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-zinc-300 p-6 flex flex-col gap-6 shadow-sm">
          <h3 className="text-neutral-700 text-lg font-semibold font-inter flex items-center gap-2">
            <HiOutlineDocumentText className="text-blue-700" />
            Verification Documents
          </h3>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-500 font-inter">Identity Document ({displayData.idType})</p>

            {documentUrl ? (
              <div className="relative group rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 aspect-video flex items-center justify-center">
                {documentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                  <img
                    src={formatImageUrl(documentUrl)}
                    alt="ID Document"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <HiOutlineDocumentText className="w-16 h-16 text-zinc-300" />
                    <span className="text-sm font-medium text-zinc-500">Document (PDF/Other)</span>
                    <a 
                      href={formatImageUrl(documentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <HiOutlineExternalLink className="w-4 h-4" />
                      View Document
                    </a>
                  </div>
                )}

                {documentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={formatImageUrl(documentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full text-zinc-900 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <HiOutlineExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-200 border-dashed p-8 flex flex-col items-center justify-center gap-2 text-zinc-400">
                <HiOutlineDocumentText className="w-10 h-10" />
                <span className="text-sm font-medium">No document uploaded</span>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">ID Type</span>
                <span className="text-neutral-700 font-medium">{displayData.idType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">ID Number</span>
                <span className="text-neutral-700 font-medium">{displayData.bvn}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">BVN Verified</span>
                <span className={cn(
                  "font-medium",
                  engineer.idVerification?.status === 'verified' ? "text-green-600" : "text-amber-600"
                )}>
                  {engineer.idVerification?.status === 'verified' ? 'Yes' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-stone-50">
              <h3 className="text-xl font-bold text-neutral-700">Reject Professional</h3>
              <button 
                onClick={() => setIsRejectModalOpen(false)} 
                className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
              >
                <HiOutlineXCircle className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Rejection Note</label>
                <textarea 
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Explain why this professional is being rejected..."
                  className="w-full h-32 p-4 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-inter resize-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => handleAction('rejected')}
                  disabled={!rejectionNote.trim() || isRejecting}
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/10"
                >
                  {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="w-full h-12 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1 group">
      <div className="flex items-center gap-2">
        {icon && <span className="text-zinc-400 group-hover:text-blue-600 transition-colors">{icon}</span>}
        <span className="text-neutral-700 text-sm font-normal font-inter">{label}</span>
      </div>
      <span className="text-neutral-700 text-sm font-medium font-inter text-right truncate max-w-[180px]">{value}</span>
    </div>
  )
}

