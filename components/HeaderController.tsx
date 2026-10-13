'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Music2 } from 'lucide-react'
import { playSurpriseSound } from '@/lib/sounds'
import { useItineraryStore } from '@/store/useItineraryStore'

const SECRET_WINDOW_MS = 3_000

/**
 * HeaderController renders the floating passport header for the trip journal.
 *
 * It shows the app title, the live clock in 12-hour format, and quick actions to
 * jump back to the live card, toggle focus mode, or control the lo-fi track.
 */
export function HeaderController({
  clock,
  onJumpToCurrentActivity,
  onToggleFocusMode,
  focusMode,
  children,
}: {
  clock: string
  onJumpToCurrentActivity: () => void
  onToggleFocusMode: () => void
  focusMode: boolean
  children?: ReactNode
}) {
  const lofiRef = useRef<HTMLAudioElement | null>(null)
  const [lofiOn, setLofiOn] = useState(false)
  const [showDeveloperReset, setShowDeveloperReset] = useState(false)
  const focusToggleTimesRef = useRef<number[]>([])
  const titleClickCountRef = useRef(0)
  const lastTitleClickRef = useRef(0)
  const resetAppProgress = useItineraryStore((state) => state.resetAppProgress)

  const openDeveloperReset = () => {
    if (showDeveloperReset) return
    setShowDeveloperReset(true)
    playSurpriseSound()
  }

  const handleFocusToggle = () => {
    const now = Date.now()
    focusToggleTimesRef.current = [...focusToggleTimesRef.current, now].filter(
      (timestamp) => now - timestamp <= SECRET_WINDOW_MS,
    )
    if (focusToggleTimesRef.current.length >= 4) {
      focusToggleTimesRef.current = []
      openDeveloperReset()
    }
    onToggleFocusMode()
  }

  const handleTitleClick = () => {
    const now = Date.now()
    titleClickCountRef.current = now - lastTitleClickRef.current <= SECRET_WINDOW_MS
      ? titleClickCountRef.current + 1
      : 1
    lastTitleClickRef.current = now
    if (titleClickCountRef.current >= 5) {
      titleClickCountRef.current = 0
      openDeveloperReset()
    }
  }

  const handleDeveloperReset = () => {
    resetAppProgress()
    setShowDeveloperReset(false)
    window.location.reload()
  }

  useEffect(() => {
    const audio = new Audio('/audio/lofi.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'none'
    const handleError = () => setLofiOn(false)
    audio.addEventListener('error', handleError)
    lofiRef.current = audio

    return () => {
      audio.pause()
      audio.removeEventListener('error', handleError)
      lofiRef.current = null
    }
  }, [])

  const toggleLofi = () => {
    const audio = lofiRef.current
    if (!audio) return

    if (lofiOn) {
      audio.pause()
      audio.currentTime = 0
      setLofiOn(false)
      return
    }

    void audio.play().then(() => setLofiOn(true)).catch(() => setLofiOn(false))
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-2.5 md:gap-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="pointer-events-auto flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-600/40 bg-[#fdfbf7]/90 px-3 py-2 shadow-[0_12px_30px_rgba(57,39,18,0.09)] backdrop-blur-sm sm:px-4 sm:py-3 md:w-auto md:rounded-[1.5rem]">
            <button
              type="button"
              aria-label="Larry's Tour Guide"
              onClick={handleTitleClick}
              className="truncate bg-transparent p-0 text-left font-display text-base tracking-[0.06em] text-slate-900 sm:text-xl sm:tracking-[0.08em]"
            >
              Larry&apos;s Tour Guide
            </button>
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
              onClick={handleFocusToggle}
              className="shrink-0 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-pink-800 shadow-[0_8px_20px_rgba(67,55,18,0.08)] transition hover:-translate-y-0.5 hover:bg-pink-100 sm:px-4 sm:py-2.5 sm:text-[0.68rem] sm:tracking-[0.14em]"
            >
              Focus {focusMode ? 'On' : 'Off'}
            </button>
            <button
              type="button"
              onClick={toggleLofi}
              aria-pressed={lofiOn}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] shadow-[0_8px_20px_rgba(67,55,18,0.08)] transition hover:-translate-y-0.5 sm:px-4 sm:py-2.5 sm:text-[0.68rem] sm:tracking-[0.14em] ${lofiOn ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-slate-300 bg-white/80 text-slate-700 hover:bg-slate-100'}`}
            >
              <Music2 className="mr-1.5 inline size-3.5" aria-hidden="true" />Lo-Fi: {lofiOn ? 'On' : 'Off'}
            </button>
          </nav>
        </div>
      </div>

      {children && (
        <div className="pointer-events-auto mx-auto mt-2.5 flex w-full max-w-6xl justify-center md:mt-3">
          {children}
        </div>
      )}

      {showDeveloperReset && typeof document !== 'undefined' && createPortal(
        <div className="pointer-events-auto fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="developer-reset-title"
            className="w-full max-w-sm rounded-2xl border border-amber-600/35 bg-[#fdfbf7] p-5 text-indigo-950 shadow-[0_24px_70px_rgba(35,27,18,0.24)] sm:rounded-[1.5rem] sm:p-6"
          >
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-600">🔒 Dev Only</p>
            <h2 id="developer-reset-title" className="mt-2 font-display text-xl">Developer Reset</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Return the guide to its first visit and replay the intro.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeveloperReset(false)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDeveloperReset}
                className="rounded-full border border-rose-700 bg-rose-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-rose-800"
              >
                Reset App &amp; Replay Intro
              </button>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </header>
  )
}
