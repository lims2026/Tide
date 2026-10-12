'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import quotesJson from '@/data/quotes.json'
import { useItineraryStore } from '@/store/useItineraryStore'

const QUOTES = quotesJson as Array<{ id: number; poem: string }>

/**
 * QuoteSplash shows the pink welcome overlay for the trip.
 *
 * On every load we read the next verse index from localStorage so the user sees a
 * fresh love poem in sequence. Clicking either option keeps the experience warm and
 * playful while surfacing the cute reaction modal.
 */
export function QuoteSplash() {
  const showSplash = useItineraryStore((state) => state.showSplash)
  const poemIndex = useItineraryStore((state) => state.poemIndex)
  const setPoemIndex = useItineraryStore((state) => state.setPoemIndex)
  const setShowSplash = useItineraryStore((state) => state.setShowSplash)
  const setExcitementChoice = useItineraryStore((state) => state.setExcitementChoice)
  const [reactionVisible, setReactionVisible] = useState(false)

  const poem = useMemo(() => QUOTES[poemIndex % QUOTES.length], [poemIndex])

  useEffect(() => {
    if (!showSplash) {
      setReactionVisible(false)
    }
  }, [showSplash])

  const advancePoem = () => {
    setPoemIndex((poemIndex + 1) % QUOTES.length)
  }

  const handleChoice = (choice: 'see-me' | 'super') => {
    setExcitementChoice(choice)
    setShowSplash(false)
    advancePoem()
    setReactionVisible(true)
  }

  if (!showSplash && !reactionVisible) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#f9dfe8]/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              className="w-full max-w-xl rounded-[2rem] border border-pink-200 bg-gradient-to-br from-[#fff7fb] via-[#fff0f6] to-[#ffe4ef] p-6 shadow-[0_30px_80px_rgba(163,63,112,0.23)]"
            >
              <div className="flex items-center justify-between gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-pink-700">
                <span>Love note</span>
                <span>Verse {poemIndex + 1} / {QUOTES.length}</span>
              </div>

              <p className="mt-6 text-2xl leading-relaxed text-pink-950 sm:text-3xl">{poem.poem}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleChoice('see-me')}
                  className="flex-1 rounded-full border border-pink-300 bg-white/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-pink-800 transition hover:bg-pink-50"
                >
                  I&apos;m so excited
                </button>
                <button
                  type="button"
                  onClick={() => handleChoice('super')}
                  className="flex-1 rounded-full bg-pink-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(219,102,149,0.26)] transition hover:bg-pink-500"
                >
                  This is adorable
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reactionVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#2b1121]/30 p-4"
          >
            <div className="rounded-[2rem] border border-pink-200 bg-white px-8 py-6 text-center shadow-[0_20px_60px_rgba(57,19,40,0.26)]">
              <p className="font-display text-3xl tracking-[0.08em] text-pink-900">Me too baby &lt;3!</p>
              <button
                type="button"
                onClick={() => setReactionVisible(false)}
                className="mt-5 rounded-full bg-pink-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                Keep wandering
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
