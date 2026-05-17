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

export interface MapMarker {
  lngLat: [number, number]
  color?: string
  label?: string
}

interface MapProps {
  viewport: MapViewport
  onViewportChange?: (viewport: MapViewport) => void
  markers?: MapMarker[]
  className?: string
}

export function Map({ viewport, onViewportChange, markers, className }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const isProgrammatic = useRef(false)
  const markerRefs = useRef<maplibregl.Marker[]>([])

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

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markerRefs.current.forEach(m => m.remove())
    markerRefs.current = []

    if (!markers?.length) return

    const waitForMap = () => {
      if (!map.isStyleLoaded()) { setTimeout(waitForMap, 100); return }
      markers.forEach(({ lngLat, color, label }) => {
        const el = document.createElement('div')
        el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color ?? '#1d4ed8'};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);`
        if (label) el.title = label
        const m = new maplibregl.Marker({ element: el }).setLngLat(lngLat).addTo(map)
        markerRefs.current.push(m)
      })
    }
    waitForMap()
  }, [markers])

  return <div ref={containerRef} className={className ?? 'w-full h-full'} />
}
