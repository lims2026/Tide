'use client'

import { useEffect } from 'react'
import { ExternalLink, MapPin, Utensils, Wifi, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useItineraryStore } from '@/store/useItineraryStore'

/**
 * ItineraryModal renders the compact detail card for a study spot or restaurant.
 *
 * The modal intentionally keeps descriptions short and actionable while still
 * exposing the external map/menu links already needed by tourists on the move.
 */
export function ItineraryModal() {
  const modal = useItineraryStore((state) => state.activeModal)
  const closeModal = useItineraryStore((state) => state.closeModal)
  const isOpen = modal.type !== 'none'

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeModal, isOpen])

  return (
    <AnimatePresence>
      {modal.type !== 'none' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="itinerary-modal-title"
            className="w-full max-w-md rounded-3xl border border-amber-600/30 bg-[#fdfbf7] p-6 text-indigo-950 shadow-[0_22px_40px_rgba(44,32,18,0.14)]"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                  {modal.type === 'study' ? 'Nearby study spot' : 'Restaurant'}
                </p>
                <h2 id="itinerary-modal-title" className="mt-2 font-display text-2xl tracking-[0.06em] text-indigo-950">
                  {modal.data.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close popup"
                className="rounded-full p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {modal.type === 'study' ? (
              <>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {modal.data.distance} away
                </p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Amenities">
                  {modal.data.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs text-indigo-900"
                    >
                      <Wifi className="size-3" aria-hidden="true" />
                      {amenity}
                    </li>
                  ))}
                </ul>
                <a
                  href={modal.data.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-900"
                >
                  <MapPin className="size-4" aria-hidden="true" />
                  Directions
                </a>
              </>
            ) : (
              <>
                <p className="mt-4 flex items-center gap-2 text-sm capitalize text-slate-700">
                  <Utensils className="size-4" aria-hidden="true" />
                  {modal.data.meal}
                  {modal.data.day ? ` · ${modal.data.day}` : ''}
                </p>
                {modal.data.note && <p className="mt-3 text-sm leading-relaxed text-slate-700">{modal.data.note}</p>}
                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href={modal.data.menuUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-900"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    View menu
                  </a>
                  <a
                    href={modal.data.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100"
                  >
                    <MapPin className="size-4" aria-hidden="true" />
                    Directions
                  </a>
                </div>
              </>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
