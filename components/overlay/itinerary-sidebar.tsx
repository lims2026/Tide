'use client'

import { Check, MapPin, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  categoryLabel,
  formatClock,
  formatDuration,
  getStatus,
  itinerary,
  tripMeta,
  type ItineraryEvent,
} from '@/lib/itinerary'
import { CategoryIcon } from './category-icon'

type Props = {
  now: number
  open: boolean
  onClose: () => void
}

export function ItinerarySidebar({ now, open, onClose }: Props) {
  const completed = itinerary.filter((e) => now >= e.end).length
  const progress = (completed / itinerary.length) * 100

  return (
    <aside
      id="itinerary-sidebar"
      aria-label="Itinerary"
      className={cn(
        'fixed inset-y-0 left-0 z-20 h-dvh w-full shrink-0 p-3 transition-[transform,opacity,visibility] duration-300 ease-out sm:w-[22rem] sm:p-4',
        'md:pointer-events-auto md:visible md:sticky md:top-0 md:translate-x-0 md:opacity-100',
        open
          ? 'pointer-events-auto visible translate-x-0 opacity-100'
          : 'pointer-events-none invisible -translate-x-6 opacity-0',
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <header className="flex flex-col gap-4 border-b border-white/10 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                {tripMeta.date} · {tripMeta.day}
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-white text-balance">
                {tripMeta.city} Itinerary
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-sm tabular-nums text-white">
                <span className="sr-only">Current trip time </span>
                {formatClock(now)}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              >
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Close itinerary</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Day progress</span>
              <span className="font-mono tabular-nums">
                {completed}/{itinerary.length} stops
              </span>
            </div>
            <div
              className="h-1 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label="Day progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <div
                className="h-full rounded-full bg-signal transition-[width] duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <ol className="flex-1 overflow-y-auto px-3 pt-4 pb-24 sm:pb-4 [scrollbar-width:thin] [scrollbar-color:rgb(255_255_255/0.15)_transparent]">
          {itinerary.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              now={now}
              isLast={index === itinerary.length - 1}
            />
          ))}
        </ol>
      </div>
    </aside>
  )
}

function TimelineItem({
  event,
  now,
  isLast,
}: {
  event: ItineraryEvent
  now: number
  isLast: boolean
}) {
  const status = getStatus(event, now)
  const isCurrent = status === 'current'
  const isDone = status === 'done'
  const progress = isCurrent ? ((now - event.start) / (event.end - event.start)) * 100 : 0

  return (
    <li
      className="relative flex gap-3"
      aria-current={isCurrent ? 'step' : undefined}
    >
      <div className="w-11 shrink-0 pt-3.5 text-right font-mono text-xs tabular-nums">
        <span className={cn(isCurrent ? 'text-signal' : isDone ? 'text-white/35' : 'text-white/70')}>
          {formatClock(event.start)}
        </span>
      </div>

      <div className="relative flex w-4 shrink-0 justify-center">
        {!isLast && (
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-6 bottom-0 w-px',
              isDone ? 'bg-signal/50' : 'bg-white/10',
            )}
          />
        )}
        <span
          aria-hidden="true"
          className={cn(
            'relative z-10 mt-4 flex size-4 items-center justify-center rounded-full border',
            isDone && 'border-signal/60 bg-signal/20',
            isCurrent && 'border-signal bg-signal shadow-[0_0_0_4px] shadow-signal/20',
            status === 'upcoming' && 'border-white/25 bg-slate-950',
          )}
        >
          {isDone && <Check className="size-2.5 text-signal" strokeWidth={3} />}
          {isCurrent && <span className="absolute inset-0 animate-ping rounded-full bg-signal/50" />}
        </span>
      </div>

      <div
        className={cn(
          'mb-2 min-w-0 flex-1 rounded-2xl border p-3 transition-colors',
          isCurrent
            ? 'border-white/15 bg-white/[0.08]'
            : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]',
        )}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/45">
          <CategoryIcon category={event.category} className="size-3" />
          <span>{categoryLabel[event.category]}</span>
          <span aria-hidden="true">·</span>
          <span className="normal-case tracking-normal">{formatDuration(event.end - event.start)}</span>
        </div>
        <h3
          className={cn(
            'mt-1 text-sm font-medium leading-snug text-pretty',
            isDone ? 'text-white/45 line-through decoration-white/20' : 'text-white',
          )}
        >
          {event.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-white/50">
          <MapPin className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{event.location}</span>
        </p>

        {isCurrent && (
          <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-signal transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </li>
  )
}
