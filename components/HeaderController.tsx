'use client'

import type { ReactNode } from 'react'

/**
 * HeaderController renders the floating top bar for the itinerary.
 *
 * It includes the friendly app title, a live 12-hour clock, and the primary
 * button that jumps to the active activity card. The layout is intentionally
 * lightweight so it sits over the landmark artwork without stealing focus.
 */
export function HeaderController({
  clock,
  onJumpToCurrentActivity,
  children,
}: {
  /** Current local time rendered in 12-hour format, for example 02:30 PM. */
  clock: string
  /** Scrolls the viewport to the active quest card. */
  onJumpToCurrentActivity: () => void
  /** Optional custom content inserted under the floating header. */
  children?: ReactNode
}) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-[1.5rem] border border-emerald-200/80 bg-amber-50/90 px-4 py-3 shadow-[0_12px_30px_rgba(120,86,40,0.12)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-emerald-800">Larry&apos;s Tour Guide</span>
          </div>
          <div className="h-8 w-px bg-emerald-200" aria-hidden="true" />
          <div className="text-right">
            <p className="text-[0.6rem] uppercase tracking-[0.24em] text-emerald-700/80">Now</p>
            <p className="mt-0.5 text-lg font-semibold text-amber-700">{clock}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onJumpToCurrentActivity}
          className="pointer-events-auto animate-pulse rounded-full border border-rose-200 bg-amber-50/90 px-4 py-2.5 text-sm font-semibold tracking-[0.14em] text-rose-500 shadow-[0_8px_22px_rgba(251,113,133,0.18)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rose-400"
        >
          Current Activity
        </button>
      </div>
      {children}
    </header>
  )
}
