'use client'

import { useEffect } from 'react'
import { ExternalLink, MapPin, Utensils, Wifi, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useItineraryStore } from '@/store/useItineraryStore'

export function ItineraryModal() {
  const modal = useItineraryStore((state) => state.activeModal)
  const closeModal = useItineraryStore((state) => state.closeModal)
  const isOpen = modal.type !== 'none'

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeModal, isOpen])

  return <AnimatePresence>
    {modal.type !== 'none' && <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal() }}>
      <motion.section role="dialog" aria-modal="true" aria-labelledby="itinerary-modal-title" className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 text-white shadow-2xl" initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">{modal.type === 'study' ? 'Nearby study spot' : 'Restaurant'}</p><h2 id="itinerary-modal-title" className="mt-2 text-2xl font-semibold">{modal.data.name}</h2></div><button type="button" onClick={closeModal} aria-label="Close popup" className="rounded-full p-2 text-white/65 hover:bg-white/10 hover:text-white"><X className="size-5" aria-hidden="true" /></button></div>
        {modal.type === 'study' ? <>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/70"><MapPin className="size-4 shrink-0" aria-hidden="true" />{modal.data.address}</p><p className="mt-2 text-sm text-white/70">{modal.data.distance} away</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Amenities">{modal.data.amenities.map((amenity) => <li key={amenity} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/85"><Wifi className="size-3" aria-hidden="true" />{amenity}</li>)}</ul>
          <a href={modal.data.mapsUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white/85"><MapPin className="size-4" aria-hidden="true" />Directions</a>
        </> : <>
          <p className="mt-4 flex items-center gap-2 text-sm capitalize text-white/70"><Utensils className="size-4" aria-hidden="true" />{modal.data.meal}{modal.data.day ? ` · ${modal.data.day}` : ''}</p><p className="mt-2 text-sm text-white/70">{modal.data.address}</p>{modal.data.note && <p className="mt-3 text-sm text-white/70">{modal.data.note}</p>}
          <a href={modal.data.menuUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white/85"><ExternalLink className="size-4" aria-hidden="true" />View menu</a>
          <a href={modal.data.mapsUrl} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white/10"><MapPin className="size-4" aria-hidden="true" />Directions</a>
        </>}
      </motion.section>
    </motion.div>}
  </AnimatePresence>
}
