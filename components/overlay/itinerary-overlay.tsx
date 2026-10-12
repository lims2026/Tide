'use client'

import { useCallback, useEffect } from 'react'
import { itineraryDays, itineraryItems } from '@/lib/itinerary-data'
import { getActiveScheduleItem, getUKDateTime } from '@/lib/timeUtils'
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
    const current = getActiveScheduleItem(now, itineraryItems)
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

  const clock = localTime ? getUKDateTime(new Date(localTime)).clock : '--:--'

  return (
    <div className="relative h-full w-full">
      <LandmarkBackground />
      <HeaderController clock={clock} onJumpToCurrentActivity={() => jumpToCurrentActivity(true)} />

      <main aria-label="Trip itinerary" className="relative z-10 h-full overflow-y-auto scroll-smooth px-4 pb-24 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
          <header className="w-full max-w-2xl rounded-[1.75rem] border border-emerald-200/70 bg-amber-50/90 p-5 shadow-[0_16px_36px_rgba(120,86,40,0.12)] backdrop-blur-md">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-emerald-700/80">Cozy journey</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-800 sm:text-5xl">Larry&apos;s Tour Guide</h1>
          </header>

          {itineraryDays.map((day) => (
            <section key={day.date} className="flex w-full flex-col items-center gap-4" aria-labelledby={`day-${day.date}`}>
              <header id={`day-${day.date}`} className="sticky top-3 z-20 w-full max-w-2xl rounded-2xl border border-emerald-200/70 bg-amber-50/90 px-5 py-3 text-emerald-900 shadow-[0_10px_24px_rgba(120,86,40,0.1)] backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-700/80">
                  {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${day.date}T12:00:00`))}
                </p>
                <h2 className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-emerald-900">{day.title}</h2>
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
