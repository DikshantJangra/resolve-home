'use client'

import React, { useEffect, useState } from 'react'
import Uppy from '@uppy/core'
import DashboardPlugin from '@uppy/dashboard'
import XHRUpload from '@uppy/xhr-upload'
import ImageEditor from '@uppy/image-editor'
import Dashboard from '@uppy/react/dashboard'
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
  const [uppy, setUppy] = useState<Uppy | null>(null)

  useEffect(() => {
    // Initialize Uppy with premium features
    const uppyInstance = new Uppy({
      id: `uppy-${uploadType}`,
      autoProceed: false,
      debug: process.env.NODE_ENV === 'development',
      restrictions: {
        maxNumberOfFiles: multiple ? maxFiles : 1,
        // These will be overridden by the config from backend
      }
    })
      .use(ImageEditor, {
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
  }, [uploadType, multiple, maxFiles, onSuccess, onRequestClose])

  if (!uppy || !isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
      {/* Click-outside backdrop with super minimal blur */}
      <div 
        className="absolute inset-0 pointer-events-auto bg-black/10 backdrop-blur-[2px]" 
        onClick={onRequestClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-[100000] pointer-events-auto w-full max-w-[600px] px-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
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
    </div>
  )
}
