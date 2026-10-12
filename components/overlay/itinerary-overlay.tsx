'use client'

import { useCallback, useEffect } from 'react'
import { itineraryDays, itineraryItems } from '@/lib/itinerary-data'
import { getActiveScheduleItem, getUKDateTime } from '@/lib/timeUtils'
import { HeaderController } from '@/components/HeaderController'
import { LandmarkBackground } from '@/components/LandmarkBackground'
import { ItineraryCard } from '@/components/ItineraryCard'
import { useItineraryStore } from '@/store/useItineraryStore'
import { ItineraryModal } from './itinerary-modal'

/**
 * ItineraryOverlay owns the live trip clock and the insider field-journal layout.
 *
 * It resolves the active itinerary item from the current UK time, updates the
 * active schedule card, and coordinates the background with the live current
 * activity or the brief tile override state.
 */
export function ItineraryOverlay() {
  const setLocalTime = useItineraryStore((state) => state.setLocalTime)
  const setActiveScheduleItem = useItineraryStore((state) => state.setActiveScheduleItem)
  const setCurrentActivityLandmarkId = useItineraryStore((state) => state.setCurrentActivityLandmarkId)
  const resetBackgroundToCurrent = useItineraryStore((state) => state.resetBackgroundToCurrent)
  const localTime = useItineraryStore((state) => state.localTime)

  /**
   * Finds the schedule item that matches the current UK time and updates the
   * active state along with the background image. If the user wants to scroll to
   * the current card, this helper will center it in view.
   */
  const jumpToCurrentActivity = useCallback((shouldScroll = true) => {
    const now = new Date()
    setLocalTime(now.getTime())
    const current = getActiveScheduleItem(now, itineraryItems)
    if (!current) return

    setActiveScheduleItem(current.id)
    setCurrentActivityLandmarkId(current.landmarkId)
    resetBackgroundToCurrent()

    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-itinerary-id="${current.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [resetBackgroundToCurrent, setActiveScheduleItem, setCurrentActivityLandmarkId, setLocalTime])

  /**
   * Refresh the current activity on mount and then every 60 seconds to keep the
   * live tracker aligned with time changes.
   */
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
          <header className="w-full max-w-2xl rounded-[1.75rem] border border-amber-600/35 bg-[#fdfbf7]/90 p-5 shadow-[0_16px_36px_rgba(58,44,20,0.08)] backdrop-blur-sm">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-600">Field journal</p>
            <h1 className="mt-2 font-display text-3xl tracking-[0.08em] text-indigo-950 sm:text-5xl">Larry&apos;s Tour Guide</h1>
          </header>

          {itineraryDays.map((day) => (
            <section key={day.date} className="flex w-full flex-col items-center gap-4" aria-labelledby={`day-${day.date}`}>
              <header
                id={`day-${day.date}`}
                className="sticky top-3 z-20 flex w-full max-w-2xl items-center justify-between gap-3 rounded-full border border-amber-600/35 bg-[#fdfbf7]/90 px-5 py-3 text-indigo-950 shadow-[0_10px_24px_rgba(58,44,20,0.08)] backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-full border border-amber-600/40 bg-amber-100 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-amber-800">
                    Passport
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-600">
                    {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${day.date}T12:00:00`))}
                  </p>
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-950">{day.title}</h2>
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
