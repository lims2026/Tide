'use client'

import { ArrowUpRight, ChevronDown, Clock, Coffee, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatClock,
  formatCountdown,
  formatDuration,
  getCurrentAndNext,
  itinerary,
} from '@/lib/itinerary'
import { CategoryIcon } from './category-icon'

type Props = {
  now: number
  expanded: boolean
  onToggle: () => void
}

export function NowNextCard({ now, expanded, onToggle }: Props) {
  const { current, next } = getCurrentAndNext(itinerary, now)
  const progress = current ? ((now - current.start) / (current.end - current.start)) * 100 : 0

  return (
    <section
      aria-label="Current and upcoming events"
      className="pointer-events-auto fixed inset-x-3 bottom-3 z-30 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[23rem]"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-2xl shadow-black/50 backdrop-blur-2xl">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls="now-next-body"
          className={cn(
            'flex w-full items-center justify-between gap-3 px-5 text-left transition-[padding] duration-300 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal',
            expanded ? 'pt-4 pb-0' : 'py-3.5',
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal/60" />
              <span className="relative size-2 rounded-full bg-signal" />
            </span>
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              Current Event
            </span>
            <span
              className={cn(
                'truncate text-sm font-medium text-white transition-opacity duration-300',
                expanded ? 'opacity-0' : 'opacity-100',
              )}
              aria-hidden={expanded}
            >
              <span aria-hidden="true" className="mr-2 text-white/30">
                ·
              </span>
              {current ? current.title : 'Free time'}
            </span>
          </span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronDown
              className={cn('size-4 transition-transform duration-300', !expanded && 'rotate-180')}
              aria-hidden="true"
            />
            <span className="sr-only">{expanded ? 'Collapse card' : 'Expand card'}</span>
          </span>
        </button>

        <div
          id="now-next-body"
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
          inert={!expanded}
        >
          <div className="overflow-hidden">
        <div className="px-5 pt-3 pb-4">
          {current ? (
            <div className="flex gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-signal/15 text-signal ring-1 ring-signal/30">
                <CategoryIcon category={current.category} className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold leading-snug text-white text-pretty">
                  {current.title}
                </h2>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-white/55">
                  <MapPin className="size-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{current.location}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white/70">
                <Coffee className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Free time</h2>
                <p className="mt-0.5 text-xs text-white/55">
                  {next ? 'Nothing scheduled until your next stop.' : "That's a wrap for today."}
                </p>
              </div>
            </div>
          )}

          {current && (
            <div className="mt-4">
              <div className="flex items-end justify-between font-mono text-xs tabular-nums">
                <span className="text-white/50">
                  {formatClock(current.start)} – {formatClock(current.end)}
                </span>
                <span className="text-white">
                  <span className="text-white/50">ends in </span>
                  {formatCountdown(current.end - now)}
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Current event progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-signal/70 to-signal transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

            <div className="border-t border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                Up Next
              </p>
              {next ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-white/75 ring-1 ring-white/10">
                    <CategoryIcon category={next.category} className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-white">{next.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs tabular-nums text-white/50">
                      <Clock className="size-3" aria-hidden="true" />
                      {formatClock(next.start)}
                      <span aria-hidden="true">·</span>
                      in {formatDuration(next.start - now)}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${next.title} ${next.location} Tokyo`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">Directions to {next.title}</span>
                  </a>
                </div>
              ) : (
                <p className="mt-2 text-sm text-white/60">No more events scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
