'use client'

import { useEffect, useState } from 'react'
import { BookOpen, ChevronDown, ExternalLink, MapPin } from 'lucide-react'
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

export function ItineraryCard({ item, index }: { item: ItineraryItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.5 })
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
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${item.date}T12:00:00`))

  useEffect(() => {
    if (inView) setActiveLandmarkId(item.landmarkId)
  }, [inView, item.landmarkId, setActiveLandmarkId])

  const onActionClick = (event: React.MouseEvent<HTMLElement>, callback?: () => void) => {
    event.stopPropagation()
    callback?.()
  }

  return (
    <article
      ref={ref}
      data-itinerary-id={item.id}
      aria-current={isActive ? 'step' : undefined}
      onClick={() => setExpanded((value) => !value)}
      className={`group w-full max-w-2xl cursor-pointer rounded-[1.6rem] border p-4 text-white shadow-[0_20px_40px_rgba(2,6,23,0.38)] backdrop-blur-xl transition-all duration-200 sm:p-5 ${
        isActive
          ? 'border-red-400/80 bg-slate-950/80 ring-2 ring-red-500/70 shadow-[0_0_0_1px_rgba(254,202,202,0.18),0_0_28px_rgba(239,68,68,0.18)]'
          : 'border-amber-200/10 bg-slate-950/45 hover:border-amber-200/20 hover:bg-slate-950/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-amber-100/80">
            <span className="inline-flex size-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" aria-hidden="true" />
            <time dateTime={`${item.date}T${item.startTime}`}>{item.time}</time>
          </div>
          <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">{title}</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/50">{dateLabel}</p>
        </div>

        <button
          type="button"
          aria-label={expanded ? 'Collapse activity details' : 'Expand activity details'}
          onClick={(event) => {
            event.stopPropagation()
            setExpanded((value) => !value)
          }}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-amber-200/20 bg-amber-200/5 text-amber-100/80 transition hover:border-amber-200/30 hover:bg-amber-200/10"
        >
          <ChevronDown className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {locationUrl && (
          <a
            href={locationUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/5 px-2.5 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.15em] text-amber-100 transition hover:border-amber-100/40 hover:bg-amber-100/10"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            Location
          </a>
        )}

        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200/20 bg-sky-200/5 px-2.5 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.15em] text-sky-100 transition hover:border-sky-200/35 hover:bg-sky-200/10"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Website
          </a>
        )}

        {studySpot && (
          <button
            type="button"
            onClick={(event) => onActionClick(event, () => openStudyModal(studySpot))}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-200/5 px-2.5 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.15em] text-emerald-100 transition hover:border-emerald-200/35 hover:bg-emerald-200/10"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Study Spot
          </button>
        )}

        {restaurant && (
          <button
            type="button"
            onClick={(event) => onActionClick(event, () => openRestaurantModal(restaurant))}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-violet-200/5 px-2.5 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.15em] text-violet-100 transition hover:border-violet-200/35 hover:bg-violet-200/10"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Menu
          </button>
        )}
      </div>

      {expanded && summary && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-amber-200/10 bg-slate-900/40 p-3 text-sm leading-relaxed text-slate-200/80">
          <p>{summary}</p>
        </div>
      )}

      <span className="sr-only">Stop {index + 1}</span>
    </article>
  )
}
