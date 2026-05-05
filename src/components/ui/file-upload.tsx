'use client'

import React, { useEffect, useState } from 'react'
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import XHRUpload from '@uppy/xhr-upload'
import ImageEditor from '@uppy/image-editor'
import DashboardModal from '@uppy/react/dashboard-modal'
import apiClient from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
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
      .use(Dashboard, {
        inline: false,
        trigger: null,
        proudlyDisplayPoweredByUppy: false,
        hideProgressDetails: false,
        closeModalOnClickOutside: true,
        theme: 'light',
        note: `Upload your ${uploadType} (Max ${multiple ? maxFiles : 1} file${multiple ? 's' : ''})`,
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
          uppyInstance.use(XHRUpload, {
            endpoint: `${apiClient.defaults.baseURL}${config.endpoint}`,
            formData: config.formData,
            fieldName: config.fieldName,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            },
          })
        }
      } catch (error) {
        console.error('Failed to fetch Uppy config:', error)
        toast.error('Failed to initialize uploader')
      }
    }

    fetchConfig()

    uppyInstance.on('complete', (result) => {
      if (result.successful && result.successful.length > 0) {
        toast.success('Upload successful!')
        onSuccess?.(result.successful)
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

  if (!uppy) return null

  return (
    <DashboardModal
      uppy={uppy}
      open={isOpen}
      onRequestClose={onRequestClose}
      plugins={['ImageEditor']}
      className="resolve-home-uppy"
    />
  )
}
