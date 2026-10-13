'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, ChevronDown, MapPin, ScrollText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  getItemDisplayTitle,
  getItemLocationUrl,
  getItemSummary,
  getItemWebsiteUrl,
  getRestaurant,
  getStudySpot,
  type ItineraryItem,
} from '@/lib/itinerary-data'
import { useItineraryStore } from '@/store/useItineraryStore'

/**
 * ItineraryCard represents one stop in the interactive tourist passport timeline.
 *
 * Background Control Rules:
 * - Clicking a card expands/collapses it AND sets backgroundMode to 'manual',
 *   instantly displaying this card's item.landmarkId background asset.
 * - Auto-reset: A 10-second timer returns the background back to 'current' mode
 *   unless the user continues interacting.
 */
export function ItineraryCard({ item, index }: { item: ItineraryItem; index: number }) {
  const isActive = useItineraryStore((state) => state.activeScheduleItemId === item.id)
  const setManualBackground = useItineraryStore((state) => state.setManualBackground)
  const resetBackgroundToCurrent = useItineraryStore((state) => state.resetBackgroundToCurrent)
  const openStudyModal = useItineraryStore((state) => state.openStudyModal)
  const openRestaurantModal = useItineraryStore((state) => state.openRestaurantModal)

  const [expanded, setExpanded] = useState(false)
  const pinTimeoutRef = useRef<number | null>(null)

  const studySpot = getStudySpot(item.nearestStudySpotId)
  const restaurant = getRestaurant(item.restaurantId)
  const locationUrl = getItemLocationUrl(item, studySpot, restaurant)
  const websiteUrl = getItemWebsiteUrl(item, studySpot, restaurant)
  const summary = getItemSummary(item)
  const title = getItemDisplayTitle(item)

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${item.date}T12:00:00`))

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`2024-01-01T${item.startTime}:00`))

  /** Clear pending background reset timeout on unmount */
  useEffect(() => {
    return () => {
      if (pinTimeoutRef.current) {
        window.clearTimeout(pinTimeoutRef.current)
      }
    }
  }, [])

  /** Explicitly pin this tile's landmark ID to the background store */
  const handleCardClick = () => {
    const nextExpandedState = !expanded
    setExpanded(nextExpandedState)

    // Switch background to this tile's landmark
    setManualBackground(item.landmarkId)

    // Clear any existing timer
    if (pinTimeoutRef.current) {
      window.clearTimeout(pinTimeoutRef.current)
    }

    // After 10 seconds, drift back to live tracking mode
    pinTimeoutRef.current = window.setTimeout(() => {
      resetBackgroundToCurrent()
    }, 10000)
  }

  const onActionClick = (event: React.MouseEvent<HTMLElement>, callback?: () => void) => {
    event.stopPropagation()
    callback?.()
  }

  return (
    <motion.article
      layout
      data-itinerary-id={item.id}
      aria-current={isActive ? 'step' : undefined}
      onClick={handleCardClick}
      className={`group relative w-full max-w-2xl cursor-pointer rounded-[1.6rem] border p-4 text-indigo-950 transition-all duration-200 sm:p-5 ${
        isActive
          ? 'border-amber-600 bg-[#fdfbf7] shadow-[0_0_22px_rgba(217,119,6,0.35)] ring-2 ring-amber-500/40'
          : 'border-amber-600/25 bg-[#fdfbf7]/90 shadow-[0_14px_28px_rgba(72,55,22,0.09)] hover:border-amber-500/50 hover:bg-[#fdfbf7]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-slate-700">
            <time dateTime={`${item.date}T${item.startTime}`}>{formattedTime}</time>
          </div>
          <h2 className="mt-2 font-display text-lg leading-snug tracking-[0.05em] text-indigo-950 sm:text-xl">
            {title}
          </h2>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-slate-600">{dateLabel}</p>
        </div>

        <button
          type="button"
          aria-label={expanded ? 'Collapse activity details' : 'Expand activity details'}
          onClick={(event) => {
            event.stopPropagation()
            handleCardClick()
          }}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-amber-600/30 bg-white text-slate-800 shadow-[0_8px_18px_rgba(76,58,20,0.08)] transition hover:border-amber-500 hover:bg-amber-50"
        >
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {locationUrl && (
          <a
            href={locationUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-50 px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-indigo-950 transition hover:bg-amber-100"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            Map
          </a>
        )}

        {websiteUrl && !restaurant && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-slate-800 transition hover:bg-slate-100"
          >
            <ScrollText className="size-3.5" aria-hidden="true" />
            Website
          </a>
        )}

        {studySpot && (
          <button
            type="button"
            onClick={(event) => onActionClick(event, () => openStudyModal(studySpot))}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-indigo-900 transition hover:bg-indigo-100"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Info
          </button>
        )}

        {restaurant && (
          <button
            type="button"
            onClick={(event) => onActionClick(event, () => openRestaurantModal(restaurant))}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-emerald-800 transition hover:bg-emerald-100"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Info
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && summary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-[1.2rem] border border-amber-600/25 bg-white/85 p-3 text-sm leading-relaxed text-indigo-950/80">
              <p>{summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="sr-only">Stop {index + 1}</span>
    </motion.article>
  )
}