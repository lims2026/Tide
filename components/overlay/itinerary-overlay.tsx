'use client'

import { useCallback, useEffect } from 'react'
import { getActiveScheduleItem, getLocalDateTime, itineraryDays } from '@/lib/itinerary-data'
import { HeaderController } from '@/components/HeaderController'
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
    setActiveLandmarkId(current.landmarkId)

    if (shouldScroll) {
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

  const clock = localTime ? getLocalDateTime(new Date(localTime)).clock : '--:--'

  return (
    <div className="relative h-full w-full">
      <LandmarkBackground />
      <HeaderController clock={clock} onJumpToCurrentActivity={() => jumpToCurrentActivity(true)} />

      <main aria-label="Trip itinerary" className="relative z-10 h-full overflow-y-auto scroll-smooth px-4 pb-24 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
          <header className="w-full max-w-2xl text-left text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-slate-950/45 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.32em] text-amber-100/80 backdrop-blur-xl">
              Journey Ledger
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Larry&apos;s Tour Guide</h1>
          </header>

          {itineraryDays.map((day) => (
            <section key={day.date} className="flex w-full flex-col items-center gap-4" aria-labelledby={`day-${day.date}`}>
              <header id={`day-${day.date}`} className="sticky top-3 z-20 w-full max-w-2xl rounded-2xl border border-amber-200/10 bg-slate-950/65 px-5 py-3 text-white shadow-[0_12px_30px_rgba(2,6,23,0.45)] backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.22em] text-amber-100/70">
                  {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${day.date}T12:00:00`))}
                </p>
                <h2 className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-slate-100">{day.title}</h2>
              </header>

              {day.items.map((item, index) => (
                <ItineraryCard key={item.id} item={item} index={index} />
              ))}
            </section>
          ))}
        </div>
      </main>

      <ItineraryModal />
    </div>
  )
}
