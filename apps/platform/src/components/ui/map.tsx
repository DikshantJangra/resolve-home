'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export interface MapViewport {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

interface MapProps {
  viewport: MapViewport
  onViewportChange?: (viewport: MapViewport) => void
  className?: string
}

export function Map({ viewport, onViewportChange, className }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const isProgrammatic = useRef(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: viewport.center,
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('moveend', () => {
      if (isProgrammatic.current) { isProgrammatic.current = false; return }
      if (!onViewportChange) return
      const c = map.getCenter()
      onViewportChange({
        center: [c.lng, c.lat],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      })
    })

    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    isProgrammatic.current = true
    map.jumpTo({
      center: viewport.center,
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
    })
  }, [viewport])

  return <div ref={containerRef} className={className ?? 'w-full h-full'} />
}
