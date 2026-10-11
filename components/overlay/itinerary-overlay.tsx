'use client'

import { useState } from 'react'
import { ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTripClock } from '@/hooks/use-trip-clock'
import { ItinerarySidebar } from './itinerary-sidebar'
import { NowNextCard } from './now-next-card'

export type ActiveOverlay = 'itinerary' | 'card' | null

export function ItineraryOverlay() {
  const now = useTripClock()
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>('card')

  const toggle = (target: Exclude<ActiveOverlay, null>) =>
    setActiveOverlay((current) => (current === target ? null : target))

  const itineraryOpen = activeOverlay === 'itinerary'

  return (
    <div className="pointer-events-none absolute inset-0 flex">
      <ItinerarySidebar
        now={now}
        open={itineraryOpen}
        onClose={() => setActiveOverlay(null)}
      />

      <button
        type="button"
        onClick={() => toggle('itinerary')}
        aria-controls="itinerary-sidebar"
        aria-expanded={itineraryOpen}
        tabIndex={itineraryOpen ? -1 : 0}
        className={cn(
          'fixed top-4 left-4 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-xl transition-all duration-300 ease-out md:hidden',
          itineraryOpen
            ? 'pointer-events-none -translate-y-2 opacity-0'
            : 'pointer-events-auto translate-y-0 opacity-100',
        )}
      >
        <ListOrdered className="size-4" aria-hidden="true" />
        Itinerary
      </button>

      <NowNextCard
        now={now}
        expanded={activeOverlay === 'card'}
        onToggle={() => toggle('card')}
      />
    </div>
  )
}
