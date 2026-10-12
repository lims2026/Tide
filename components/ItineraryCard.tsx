'use client'

import { useEffect } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { getRestaurant, getStudySpot, type ItineraryItem } from '@/lib/itinerary-data'
import { useItineraryStore } from '@/store/useItineraryStore'

export function ItineraryCard({ item, index }: { item: ItineraryItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.5 })
  const setActiveLandmarkId = useItineraryStore((state) => state.setActiveLandmarkId)
  const isActive = useItineraryStore((state) => state.activeScheduleItemId === item.id)
  const openStudyModal = useItineraryStore((state) => state.openStudyModal)
  const openRestaurantModal = useItineraryStore((state) => state.openRestaurantModal)
  const studySpot = getStudySpot(item.nearestStudySpotId)
  const restaurant = getRestaurant(item.restaurantId)

  useEffect(() => {
    if (inView) setActiveLandmarkId(item.landmarkId)
  }, [inView, item.landmarkId, setActiveLandmarkId])

  const dateLabel = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${item.date}T12:00:00`))

  return (
    <article ref={ref} data-itinerary-id={item.id} aria-current={isActive ? 'step' : undefined} className={`w-full max-w-2xl rounded-3xl border p-5 text-white shadow-2xl backdrop-blur-md transition-[border-color,background-color,box-shadow] sm:p-7 ${isActive ? 'border-red-400 bg-slate-950/75 ring-2 ring-red-500/70 shadow-red-950/40' : 'border-white/15 bg-slate-950/45'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
        <span className="font-mono tabular-nums text-amber-100">{item.time}</span>
        <time dateTime={`${item.date}T${item.startTime}`}>{dateLabel}</time>
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-snug sm:text-xl">{item.activity.split('\n')[0]}</h2>
      {item.activity.includes('\n') && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/70">{item.activity.slice(item.activity.indexOf('\n') + 1)}</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        {studySpot && <button type="button" onClick={() => openStudyModal(studySpot)} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><BookOpen className="size-4" aria-hidden="true" />Study spot</button>}
        {restaurant && <button type="button" onClick={() => openRestaurantModal(restaurant)} aria-label={`Open ${restaurant.name} menu details`} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ExternalLink className="size-4" aria-hidden="true" />Menu</button>}
      </div>
      <span className="sr-only">Stop {index + 1}</span>
    </article>
  )
}
