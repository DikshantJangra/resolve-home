'use client'

import React, { useEffect, useState } from 'react'
import Uppy from '@uppy/core'
import DashboardPlugin from '@uppy/dashboard'
import XHRUpload from '@uppy/xhr-upload'
import ImageEditor from '@uppy/image-editor'
import Dashboard from '@uppy/react/dashboard'
import { createPortal } from 'react-dom'
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"
import { toast } from 'sonner'



interface FileUploadProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: (result: any) => void
  uploadType?: 'image' | 'document' | 'any'
  multiple?: boolean
  maxFiles?: number
}

/**
 * Premium File Upload Component using Uppy
 * Fetches dynamic restrictions and endpoints from the backend
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  isOpen,
  onRequestClose,
  onSuccess,
  uploadType = 'image',
  multiple = false,
  maxFiles = 1,
}) => {
  const [mounted, setMounted] = useState(false)
  const [uppy, setUppy] = useState<Uppy | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    // Initialize Uppy with premium features
    const uppyInstance = new Uppy({
      id: `uppy-${uploadType}-${Math.random().toString(36).substring(7)}`,
      autoProceed: false,
      debug: true,
      restrictions: {
        maxNumberOfFiles: multiple ? maxFiles : 1,
      }
    })
      .use(ImageEditor, {
        id: 'ImageEditor',
        quality: 0.8,
        cropperOptions: {
          viewMode: 1,
          background: false,
          responsive: true,
          initialAspectRatio: 1,
        },
        actions: {
          revert: true,
          rotate: true,
          granularRotate: true,
          flip: true,
          zoomIn: true,
          zoomOut: true,
          cropSquare: true,
        },
      })

    // Fetch dynamic config from backend
    const fetchConfig = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.UPLOAD.CONFIG, {
          params: { type: uploadType, multiple, maxFiles }
        })
        
        if (response.data.success) {
          const { config } = response.data.data
          
          // Apply dynamic restrictions
          uppyInstance.setOptions({
            restrictions: config.restrictions
          })

          // Setup XHR Upload with backend endpoint
          if (!uppyInstance.getPlugin('XHRUpload')) {
            uppyInstance.use(XHRUpload, {
              endpoint: `${apiClient.defaults.baseURL || (typeof window !== 'undefined' ? window.location.origin : '')}${config.endpoint}`,
              formData: config.formData,
              fieldName: config.fieldName,
              headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
              },
            })
          } else {
            // If plugin already exists, update its options
            const xhrPlugin = uppyInstance.getPlugin('XHRUpload') as any
            if (xhrPlugin) {
              xhrPlugin.setOptions({
                endpoint: `${apiClient.defaults.baseURL || (typeof window !== 'undefined' ? window.location.origin : '')}${config.endpoint}`,
                fieldName: config.fieldName,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
              })
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch Uppy config:', error)
        toast.error('Failed to initialize uploader')
      }
    }

    if (isOpen) {
      fetchConfig()
    }

    uppyInstance.on('complete', (result) => {
      if (result.successful && result.successful.length > 0) {
        toast.success('Upload successful!')
        if (onSuccess) {
          onSuccess(result.successful)
        }
        setTimeout(() => onRequestClose(), 1000)
      }
      if (result.failed && result.failed.length > 0) {
        toast.error('Some uploads failed')
      }
    })

    setUppy(uppyInstance)

    return () => {
      uppyInstance.destroy()
    }
  }, [uploadType, multiple, maxFiles, onSuccess, onRequestClose, isOpen])

  useEffect(() => {
    if (isOpen) {
      console.log('FileUpload Debug: Uploader is open and portaling to body');
    }
  }, [isOpen]);

  if (!mounted || !uppy || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[999]">
      {/* Click-outside backdrop with super minimal blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onRequestClose}
      />
      
      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] px-4 z-[1000] animate-in fade-in zoom-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
          <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 className="text-sm font-semibold text-zinc-700">Upload {uploadType === 'image' ? 'Profile Picture' : 'Files'}</h3>
            <button 
              onClick={onRequestClose}
              className="text-zinc-400 hover:text-zinc-600 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Dashboard 
            uppy={uppy}
            width="100%"
            height={450}
            plugins={['ImageEditor']}
            theme="light"
            note={`Upload your ${uploadType} (Max ${multiple ? maxFiles : 1} file${multiple ? 's' : ''})`}
            proudlyDisplayPoweredByUppy={false}
            hideProgressDetails={false}
            className="resolve-home-uppy-dashboard"
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
