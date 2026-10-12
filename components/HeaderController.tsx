'use client'

import type { ReactNode } from 'react'

export function HeaderController({
  clock,
  onJumpToCurrentActivity,
  children,
}: {
  clock: string
  onJumpToCurrentActivity: () => void
  children?: ReactNode
}) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-amber-200/15 bg-slate-950/55 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.55)] backdrop-blur-xl">
          <div className="flex size-9 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-[0.6rem] font-bold tracking-[0.22em] text-amber-100">
            LT
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-amber-200/60">Local Time</p>
            <p className="mt-0.5 text-xl font-semibold tracking-tight text-white">{clock}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onJumpToCurrentActivity}
          className="pointer-events-auto rounded-full border border-amber-200/20 bg-slate-950/60 px-4 py-2.5 text-sm font-medium tracking-[0.18em] text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:border-amber-200/35 hover:bg-slate-900/75 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-300"
        >
          Current Activity
        </button>
      </div>
      {children}
    </header>
  )
}
