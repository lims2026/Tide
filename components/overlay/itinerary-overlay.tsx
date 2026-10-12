'use client'

import { useEffect } from 'react'
import { getActiveScheduleItem, itineraryItems } from '@/lib/itinerary-data'
import { LandmarkBackground } from '@/components/LandmarkBackground'
import { ItineraryCard } from '@/components/ItineraryCard'
import { useItineraryStore } from '@/store/useItineraryStore'
import { ItineraryModal } from './itinerary-modal'

export function ItineraryOverlay() {
  const setLocalTime = useItineraryStore((state) => state.setLocalTime)
  const setActiveScheduleItem = useItineraryStore((state) => state.setActiveScheduleItem)

  useEffect(() => {
    const updateTime = () => setLocalTime(Date.now())
    updateTime()
    const timer = window.setInterval(updateTime, 60_000)
    return () => window.clearInterval(timer)
  }, [setLocalTime])

  useEffect(() => {
    const current = getActiveScheduleItem(new Date())
    if (!current) return
    setActiveScheduleItem(current)
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-itinerary-id="${current.id}"]`)?.scrollIntoView({ block: 'center' })
    })
  }, [setActiveScheduleItem]) // Set the time-aware default once; scrolling takes control after mount.

  const localTime = useItineraryStore((state) => state.localTime)

  return (
    <div className="relative h-full w-full">
      <LandmarkBackground />
      <main aria-label="Trip itinerary" className="relative z-10 h-full overflow-y-auto scroll-smooth px-4 py-[12vh] sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <header className="mb-8 text-center text-white drop-shadow-lg">
            <p className="text-xs uppercase tracking-[0.25em] text-white/65">14–27 October 2026</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">London & Brighton itinerary</h1>
            <p className="mt-2 text-sm text-white/60">{itineraryItems.length} scheduled moments · Local time {new Date(localTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </header>
          {itineraryItems.map((item, index) => <ItineraryCard key={item.id} item={item} index={index} />)}
        </div>
      </main>
      <ItineraryModal />
    </div>
  )
}
