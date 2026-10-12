'use client'

import { useCallback, useEffect } from 'react'
import { Activity } from 'lucide-react'
import { getActiveScheduleItem, getUKDateTime, itineraryDays } from '@/lib/itinerary-data'
import { LandmarkBackground } from '@/components/LandmarkBackground'
import { ItineraryCard } from '@/components/ItineraryCard'
import { useItineraryStore } from '@/store/useItineraryStore'
import { ItineraryModal } from './itinerary-modal'

export function ItineraryOverlay() {
  const setLocalTime = useItineraryStore((state) => state.setLocalTime)
  const setActiveScheduleItem = useItineraryStore((state) => state.setActiveScheduleItem)
  const setActiveLandmarkId = useItineraryStore((state) => state.setActiveLandmarkId)
  const localTime = useItineraryStore((state) => state.localTime)

  const jumpToCurrentActivity = useCallback((shouldScroll = true) => {
    const now = new Date()
    setLocalTime(now.getTime())
    const current = getActiveScheduleItem(now)
    if (!current) return
    setActiveScheduleItem(current.id)
    if (shouldScroll) {
      setActiveLandmarkId(current.landmarkId)
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-itinerary-id="${current.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [setActiveLandmarkId, setActiveScheduleItem, setLocalTime])

  useEffect(() => {
    jumpToCurrentActivity(true)
    const timer = window.setInterval(() => jumpToCurrentActivity(false), 60_000)
    return () => window.clearInterval(timer)
  }, [jumpToCurrentActivity])

  const clock = localTime ? getUKDateTime(new Date(localTime)).clock : '--:--'

  return (
    <div className="relative h-full w-full">
      <LandmarkBackground />
      <button type="button" onClick={() => jumpToCurrentActivity(true)} className="fixed top-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-4 py-2.5 text-xs font-medium text-white shadow-lg shadow-black/20 backdrop-blur-xl transition hover:border-white/35 hover:bg-slate-900/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <Activity className="size-4 text-red-300" aria-hidden="true" />Current Activity
      </button>
      <main aria-label="Trip itinerary" className="relative z-10 h-full overflow-y-auto scroll-smooth px-4 py-20 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-12">
          <header className="mb-8 text-center text-white drop-shadow-lg">
            <p className="text-xs uppercase tracking-[0.25em] text-white/65">14–27 October 2026</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">London & Brighton itinerary</h1>
            <p className="mt-2 text-sm text-white/60">Current UK time {clock}</p>
          </header>
          {itineraryDays.map((day) => (
            <section key={day.date} className="flex w-full flex-col items-center gap-4" aria-labelledby={`day-${day.date}`}>
              <header id={`day-${day.date}`} className="sticky top-3 z-20 w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-950/75 px-5 py-3 text-white shadow-lg backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">{new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${day.date}T12:00:00`))}</p>
                <h2 className="mt-1 text-sm font-semibold sm:text-base">{day.title}</h2>
              </header>
              {day.items.map((item, index) => <ItineraryCard key={item.id} item={item} index={index} />)}
            </section>
          ))}
        </div>
      </main>
      <ItineraryModal />
    </div>
  )
}
