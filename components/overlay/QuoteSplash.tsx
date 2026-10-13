'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import quotesJson from '@/data/quotes.json'
import { useItineraryStore } from '@/store/useItineraryStore'
import { playExcitedSound, playPoemSound } from '@/lib/sounds'

const QUOTES = quotesJson as Array<{ id: number; poem: string }>
const WELCOME_SEEN_KEY = 'larrys_guide_welcome_seen'

/**
 * QuoteSplash renders a multi-step pink splash intro:
 *
 * - First Visit: Card 1 (Welcome & Choice) -> Card 2 ("Me too baby <3!") -> Card 3 (Poem of the Day)
 * - Subsequent Loads: Skips Cards 1 & 2 directly to Card 3 (Poem of the Day) with auto-incrementing verse index.
 */
export function QuoteSplash() {
  const showSplash = useItineraryStore((state) => state.showSplash)
  const poemIndex = useItineraryStore((state) => state.poemIndex)
  const setPoemIndex = useItineraryStore((state) => state.setPoemIndex)
  const setShowSplash = useItineraryStore((state) => state.setShowSplash)
  const setExcitementChoice = useItineraryStore((state) => state.setExcitementChoice)

  // Step 1: Welcome | Step 2: "Me too baby" | Step 3: Poem of the day
  const [step, setStep] = useState<1 | 2 | 3>(3)
  const [selectedChoice, setSelectedChoice] = useState<'see-me' | 'super' | null>(null)

  const poem = useMemo(() => QUOTES[poemIndex % QUOTES.length], [poemIndex])

  /** Determine initial card step based on first-time visit history */
  useEffect(() => {
    if (!showSplash) {
      return
    }

    if (typeof window !== 'undefined') {
      const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY)
      if (!hasSeenWelcome) {
        setStep(1)
      } else {
        setStep(3)
      }
    }
  }, [showSplash])

  /** Card 1 -> Card 2 */
  const handleSelectChoice = (choice: 'see-me' | 'super') => {
    playExcitedSound()
    setSelectedChoice(choice)
    setExcitementChoice(choice)
    setStep(2)
  }

  /** Card 2 -> Card 3 (Marks welcome cards as seen forever) */
  const handleProceedToPoem = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true')
    }
    setStep(3)
  }

  /** Card 3 -> Close Splash & Advance Poetry Counter for Next Load */
  const handleFinishSplash = () => {
    playPoemSound()
    setPoemIndex((poemIndex + 1) % QUOTES.length)
    setShowSplash(false)
  }

  if (!showSplash) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="splash-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-[#f9dfe8]/85 p-4 backdrop-blur-md"
      >
        {/* CARD 1: FIRST VISIT WELCOME & CHOICE */}
        {step === 1 && (
          <motion.div
            key="card-1"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-xl rounded-[2rem] border border-pink-200 bg-gradient-to-br from-[#fff7fb] via-[#fff0f6] to-[#ffe4ef] p-6 shadow-[0_30px_80px_rgba(163,63,112,0.23)] sm:p-8"
          >
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-pink-700">
              Special Delivery
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold leading-snug text-pink-950 sm:text-3xl">
              Welcome to London baby, I&apos;m so excited to see you!
            </h1>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                data-sfx="custom"
                onClick={() => handleSelectChoice('see-me')}
                className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  selectedChoice === 'see-me'
                    ? 'border-pink-500 bg-pink-100/80 shadow-md'
                    : 'border-pink-200 bg-white/80 hover:border-pink-400 hover:bg-pink-50'
                }`}
              >
                <span className="text-sm font-medium text-pink-900">
                  Click here if you&apos;re excited to see me too
                </span>
                <span className="size-4 rounded-full border-2 border-pink-400 group-hover:border-pink-600" />
              </button>

              <button
                type="button"
                data-sfx="custom"
                onClick={() => handleSelectChoice('super')}
                className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  selectedChoice === 'super'
                    ? 'border-pink-500 bg-pink-100/80 shadow-md'
                    : 'border-pink-200 bg-white/80 hover:border-pink-400 hover:bg-pink-50'
                }`}
              >
                <span className="text-sm font-medium text-pink-900">
                  Click here if you&apos;re super excited to see me
                </span>
                <span className="size-4 rounded-full border-2 border-pink-400 group-hover:border-pink-600" />
              </button>
            </div>
          </motion.div>
        )}

        {/* CARD 2: FIRST VISIT REACTION MODAL */}
        {step === 2 && (
          <motion.div
            key="card-2"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm rounded-[2rem] border border-pink-200 bg-white px-8 py-8 text-center shadow-[0_20px_60px_rgba(57,19,40,0.26)]"
          >
            <p className="font-display text-3xl font-bold tracking-[0.05em] text-pink-900">
              Me too baby &lt;3!
            </p>
            <button
              type="button"
              onClick={handleProceedToPoem}
              className="mt-6 w-full rounded-full bg-pink-600 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-pink-500"
            >
              See today&apos;s love note &rarr;
            </button>
          </motion.div>
        )}

        {/* CARD 3: POEM OF THE DAY (DISPLAYED ON EVERY RELOAD) */}
        {step === 3 && (
          <motion.div
            key="card-3"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-xl rounded-[2rem] border border-pink-200 bg-gradient-to-br from-[#fff7fb] via-[#fff0f6] to-[#ffe4ef] p-6 shadow-[0_30px_80px_rgba(163,63,112,0.23)] sm:p-8"
          >
            <div className="flex items-center justify-between gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-pink-700">
              <span>Daily Love Note</span>
              <span>Verse {poemIndex + 1} / {QUOTES.length}</span>
            </div>

            <p className="mt-6 text-xl leading-relaxed text-pink-950 sm:text-2xl">
              {poem.poem}
            </p>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleFinishSplash}
                className="w-full rounded-full bg-pink-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_22px_rgba(219,102,149,0.26)] transition hover:bg-pink-500 sm:w-auto"
              >
                Open Tour Guide &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
