'use client'

import { useCallback, useEffect } from 'react'
import { CalendarPicker } from '@/components/overlay/CalendarPicker'
import { QuoteSplash } from '@/components/overlay/QuoteSplash'
import { AudioFeedback } from '@/components/AudioFeedback'
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
  const setCurrentActivityLandmarkId = useItineraryStore((state) => state.setCurrentActivityLandmarkId)
  const resetBackgroundToCurrent = useItineraryStore((state) => state.resetBackgroundToCurrent)
  const setSelectedDate = useItineraryStore((state) => state.setSelectedDate)
  const selectedDate = useItineraryStore((state) => state.selectedDate)
  const focusMode = useItineraryStore((state) => state.focusMode)
  const toggleFocusMode = useItineraryStore((state) => state.toggleFocusMode)
  const localTime = useItineraryStore((state) => state.localTime)

  /**
   * Updates live time & background.
   * Note: Only syncs `selectedDate` on initial load/manual jump, not during automatic ticks.
   */
  const jumpToCurrentActivity = useCallback((shouldScroll = true) => {
    const now = new Date()
    setLocalTime(now.getTime())
    const current = getActiveScheduleItem(now, itineraryItems)
    if (!current) return

    setActiveScheduleItem(current.id)
    setCurrentActivityLandmarkId(current.landmarkId)
    resetBackgroundToCurrent()

    // Only force-change the date on initial load or manual Jump to Current clicks!
    if (shouldScroll) {
      setSelectedDate(current.date)
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-itinerary-id="${current.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [resetBackgroundToCurrent, setActiveScheduleItem, setCurrentActivityLandmarkId, setLocalTime, setSelectedDate])

  useEffect(() => {
    jumpToCurrentActivity(true)
    const timer = window.setInterval(() => jumpToCurrentActivity(false), 60_000)
    return () => window.clearInterval(timer)
  }, [jumpToCurrentActivity])

  // Extract all unique dates from itineraryDays
  const dayDates = itineraryDays.map((day) => day.date)

  // Find selected day matching exact string (e.g. "2026-10-15")
  const selectedDay = itineraryDays.find((day) => day.date === selectedDate) || itineraryDays[0]

  const clock = localTime ? getUKDateTime(new Date(localTime)).clock : '--:--'

  return (
    <div className="relative h-full w-full">
      <LandmarkBackground />
      <AudioFeedback />
      
      <HeaderController
        clock={clock}
        focusMode={focusMode}
        onJumpToCurrentActivity={() => jumpToCurrentActivity(true)}
        onToggleFocusMode={toggleFocusMode}
      >
        {!focusMode && (
          <div className="mx-auto mt-4 flex w-full max-w-6xl justify-center px-4 sm:px-6">
            <CalendarPicker
              selectedDate={selectedDate}
              dates={dayDates}
              onSelectDate={(date) => setSelectedDate(date)}
            />
          </div>
        )}
      </HeaderController>

      <QuoteSplash />

      {!focusMode && (
        <main aria-label="Trip itinerary" className="relative z-10 h-full overflow-y-auto scroll-smooth px-4 pb-24 pt-64 sm:px-8 md:pt-52">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
            <header className="w-full max-w-2xl rounded-2xl border border-amber-600/35 bg-[#fdfbf7]/90 p-4 shadow-[0_16px_36px_rgba(58,44,20,0.08)] backdrop-blur-sm md:rounded-[1.75rem] md:p-8">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-600">Baby&apos;s Schedule</p>
              <h1 className="mt-2 font-display text-2xl tracking-[0.06em] text-indigo-950 sm:text-3xl md:text-5xl md:tracking-[0.08em]">Welcome to London</h1>
            </header>

            {selectedDay && (
              <section key={selectedDay.date} className="flex w-full flex-col items-center gap-4" aria-labelledby={`day-${selectedDay.date}`}>
                <header
                  id={`day-${selectedDay.date}`}
                  className="sticky top-3 z-20 flex w-full max-w-2xl flex-col items-start gap-1.5 rounded-2xl border border-amber-600/35 bg-[#fdfbf7]/90 px-4 py-3 text-indigo-950 shadow-[0_10px_24px_rgba(58,44,20,0.08)] backdrop-blur-sm md:flex-row md:items-center md:justify-between md:gap-3 md:rounded-[1.75rem] md:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600 sm:text-[10px] sm:tracking-[0.22em]">
                      {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${selectedDay.date}T12:00:00`))}
                    </p>
                  </div>
                  <h2 className="w-full text-xs font-semibold uppercase tracking-[0.08em] text-indigo-950 sm:text-sm md:w-auto md:text-right md:tracking-[0.12em]">{selectedDay.title}</h2>
                </header>

                {selectedDay.items.map((item, index) => (
                  <ItineraryCard key={item.id} item={item} index={index} />
                ))}
              </section>
            )}
          </div>
        </main>
      )}

      <ItineraryModal />
    </div>
  )
}
