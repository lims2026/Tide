'use client'

import { useEffect } from 'react'
import { BookOpen, ExternalLink, Utensils } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { getRestaurant, getStudySpot, type ItineraryItem } from '@/lib/itinerary-data'
import { useItineraryStore } from '@/store/useItineraryStore'

export function ItineraryCard({ item, index }: { item: ItineraryItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.5 })
  const setActiveScheduleItem = useItineraryStore((state) => state.setActiveScheduleItem)
  const isActive = useItineraryStore((state) => state.activeScheduleItemId === item.id)
  const openStudyModal = useItineraryStore((state) => state.openStudyModal)
  const openRestaurantModal = useItineraryStore((state) => state.openRestaurantModal)
  const studySpot = getStudySpot(item.nearestStudySpotId)
  const restaurant = getRestaurant(item.restaurantId)

  useEffect(() => {
    if (inView) setActiveScheduleItem(item)
  }, [inView, item, setActiveScheduleItem])

  const dateLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${item.date}T12:00:00`))

  return (
    <article ref={ref} data-itinerary-id={item.id} aria-current={isActive ? 'step' : undefined} className={`w-full max-w-2xl rounded-3xl border p-5 text-white shadow-2xl backdrop-blur-md transition-colors sm:p-7 ${isActive ? 'border-amber-200/50 bg-slate-950/65 ring-1 ring-amber-200/20' : 'border-white/15 bg-slate-950/45'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
        <time dateTime={`${item.date}T${item.startTime}`}>{dateLabel}</time>
        <span className="font-mono tabular-nums text-amber-100">{item.time}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-snug sm:text-xl">{item.activity.split('\n')[0]}</h2>
      {item.activity.includes('\n') && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/70">{item.activity.slice(item.activity.indexOf('\n') + 1)}</p>}
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/40">{item.dayTitle}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {studySpot && <button type="button" onClick={() => openStudyModal(studySpot)} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><BookOpen className="size-4" aria-hidden="true" />Study spot</button>}
        {restaurant && <button type="button" onClick={() => openRestaurantModal(restaurant)} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Utensils className="size-4" aria-hidden="true" />Restaurant</button>}
        {restaurant && <a href={restaurant.menuUrl} target="_blank" rel="noreferrer" aria-label={`Open ${restaurant.name} menu search in a new tab`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"><ExternalLink className="size-3.5" aria-hidden="true" />Menu</a>}
      </div>
      <span className="sr-only">Stop {index + 1}</span>
    </article>
  )
}
