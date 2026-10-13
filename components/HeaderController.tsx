'use client'

import type { ReactNode } from 'react'

/**
 * HeaderController renders the floating passport header for the trip journal.
 *
 * It shows the app title, the live clock in 12-hour format, and quick actions to
 * jump back to the live card, toggle focus mode, or reset the story state.
 */
export function HeaderController({
  clock,
  onJumpToCurrentActivity,
  onToggleFocusMode,
  onResetAppProgress,
  focusMode,
  children,
}: {
  clock: string
  onJumpToCurrentActivity: () => void
  onToggleFocusMode: () => void
  onResetAppProgress: () => void
  focusMode: boolean
  children?: ReactNode
}) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-2.5 md:gap-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="pointer-events-auto flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-600/40 bg-[#fdfbf7]/90 px-3 py-2 shadow-[0_12px_30px_rgba(57,39,18,0.09)] backdrop-blur-sm sm:px-4 sm:py-3 md:w-auto md:rounded-[1.5rem]">
            <span className="truncate font-display text-base tracking-[0.06em] text-slate-900 sm:text-xl sm:tracking-[0.08em]">Larry&apos;s Tour Guide</span>
            <span className="h-6 w-px shrink-0 bg-slate-300" aria-hidden="true" />
            <div className="shrink-0 text-right">
              <p className="text-[0.55rem] uppercase tracking-[0.24em] text-slate-600">Now</p>
              <p className="mt-0.5 text-base font-semibold tracking-tight text-indigo-950 sm:text-lg">{clock}</p>
            </div>
          </div>

          <nav aria-label="Trip controls" className="pointer-events-auto -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:justify-end md:overflow-visible md:px-0 md:pb-0">
            <button
              type="button"
              onClick={onJumpToCurrentActivity}
              className="shrink-0 rounded-full border border-amber-600/40 bg-[#fdfbf7]/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-indigo-950 shadow-[0_8px_20px_rgba(67,55,18,0.08)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:px-4 sm:py-2.5 sm:text-[0.68rem] sm:tracking-[0.14em]"
            >
              Current Activity
            </button>
            <button
              type="button"
              onClick={onToggleFocusMode}
              className="shrink-0 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-pink-800 shadow-[0_8px_20px_rgba(67,55,18,0.08)] transition hover:-translate-y-0.5 hover:bg-pink-100 sm:px-4 sm:py-2.5 sm:text-[0.68rem] sm:tracking-[0.14em]"
            >
              Focus {focusMode ? 'On' : 'Off'}
            </button>
            <button
              type="button"
              onClick={onResetAppProgress}
              className="shrink-0 rounded-full border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-[0_8px_20px_rgba(67,55,18,0.08)] transition hover:-translate-y-0.5 hover:bg-slate-100 sm:px-4 sm:py-2.5 sm:text-[0.68rem] sm:tracking-[0.14em]"
            >
              Reset
            </button>
          </nav>
        </div>
      </div>

      {children && (
        <div className="pointer-events-auto mx-auto mt-2.5 flex w-full max-w-6xl justify-center md:mt-3">
          {children}
        </div>
      )}
    </header>
  )
}
