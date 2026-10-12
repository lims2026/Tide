'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, ChevronDown, MapPin, ScrollText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
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
 * ItineraryCard represents one scheduled quest or activity in the timeline.
 *
 * The card keeps a compact default state for quick scanning but expands with a
 * smooth Framer Motion reveal to show the short activity blurb when the user
 * interacts with it. It also updates the active landmark background as it comes
 * into view and drives the current quest highlight styling.
 */
export function ItineraryCard({ item, index }: { item: ItineraryItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.45 })
  const setActiveLandmarkId = useItineraryStore((state) => state.setActiveLandmarkId)
  const isActive = useItineraryStore((state) => state.activeScheduleItemId === item.id)
  const openStudyModal = useItineraryStore((state) => state.openStudyModal)
  const openRestaurantModal = useItineraryStore((state) => state.openRestaurantModal)
  const [expanded, setExpanded] = useState(false)

  const studySpot = getStudySpot(item.nearestStudySpotId)
  const restaurant = getRestaurant(item.restaurantId)
  const locationUrl = getItemLocationUrl(item, studySpot, restaurant)
  const websiteUrl = getItemWebsiteUrl(item, studySpot, restaurant)
  const summary = getItemSummary(item)
  const title = getItemDisplayTitle(item)
  const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(
    new Date(`${item.date}T12:00:00`),
  )
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`2024-01-01T${item.startTime}:00`))

  /** When the card becomes visible, update the landmark scene behind the itinerary. */
  useEffect(() => {
    if (inView) setActiveLandmarkId(item.landmarkId)
  }, [inView, item.landmarkId, setActiveLandmarkId])

  /**
   * Common handler for action buttons so the card toggle does not fire when a
   * user taps a map or menu action.
   */
  const onActionClick = (event: React.MouseEvent<HTMLElement>, callback?: () => void) => {
    event.stopPropagation()
    callback?.()
  }

  return (
    <motion.article
      ref={ref}
      layout
      data-itinerary-id={item.id}
      aria-current={isActive ? 'step' : undefined}
      onClick={() => setExpanded((value) => !value)}
      className={`group w-full max-w-2xl cursor-pointer rounded-[1.6rem] border-4 bg-amber-50/90 p-4 text-emerald-900 shadow-[0_14px_28px_rgba(120,86,40,0.12)] transition-all duration-200 sm:p-5 ${
        isActive
          ? 'border-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.5)]'
          : 'border-amber-200/80 hover:border-emerald-300/90'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-emerald-700/80">
            <time dateTime={`${item.date}T${item.startTime}`}>{formattedTime}</time>
          </div>
          <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-emerald-900 sm:text-xl">{title}</h2>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-emerald-700/75">{dateLabel}</p>
        </div>

        <button
          type="button"
          aria-label={expanded ? 'Collapse activity details' : 'Expand activity details'}
          onClick={(event) => {
            event.stopPropagation()
            setExpanded((value) => !value)
          }}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white/70 text-emerald-700 shadow-[0_8px_18px_rgba(16,185,129,0.09)] transition hover:border-emerald-300 hover:bg-white"
        >
          <ChevronDown className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {locationUrl && (
          <a
            href={locationUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-emerald-800 transition hover:bg-emerald-200"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            Map
          </a>
        )}

        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-amber-800 transition hover:bg-amber-200"
          >
            <ScrollText className="size-3.5" aria-hidden="true" />
            Website
          </a>
        )}

        {studySpot && (
          <button
            type="button"
            onClick={(event) => onActionClick(event, () => openStudyModal(studySpot))}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-cyan-700 transition hover:bg-cyan-100"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Study
          </button>
        )}

        {restaurant && (
          <button
            type="button"
            onClick={(event) => onActionClick(event, () => openRestaurantModal(restaurant))}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-violet-700 transition hover:bg-violet-100"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Menu
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
            <div className="mt-4 rounded-[1.2rem] border border-rose-200 bg-white/70 p-3 text-sm leading-relaxed text-emerald-900/80">
              <p>{summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="sr-only">Stop {index + 1}</span>
    </motion.article>
  )
}
