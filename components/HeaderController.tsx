'use client'

import type { ReactNode } from 'react'

/**
 * HeaderController renders the floating passport header for the trip journal.
 *
 * It shows the app title, the live clock in 12-hour format, and an action to
 * jump the viewport back to the current activity card.
 */
export function HeaderController({
  clock,
  onJumpToCurrentActivity,
  children,
}: {
  /** Live UK time formatted as 12-hour clock, for example 02:30 PM. */
  clock: string
  /** Scrolls the page to the active itinerary card. */
  onJumpToCurrentActivity: () => void
  /** Optional content rendered beneath the header bar. */
  children?: ReactNode
}) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="pointer-events-auto rounded-[1.5rem] border border-amber-600/40 bg-[#fdfbf7]/90 px-4 py-3 shadow-[0_12px_30px_rgba(57,39,18,0.09)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl tracking-[0.08em] text-slate-900">Larry&apos;s Tour Guide</span>
            <span className="hidden h-5 w-px bg-slate-300 sm:block" aria-hidden="true" />
            <div className="text-right">
              <p className="text-[0.58rem] uppercase tracking-[0.28em] text-slate-600">Now</p>
              <p className="mt-0.5 text-lg font-semibold tracking-tight text-indigo-950">{clock}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onJumpToCurrentActivity}
          className="pointer-events-auto rounded-full border border-amber-600/40 bg-[#fdfbf7]/90 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-950 shadow-[0_8px_20px_rgba(67,55,18,0.08)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-600"
        >
          Current Activity
        </button>
      </div>
      {children}
    </header>
  )
}
