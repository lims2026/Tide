'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useItineraryStore } from '@/store/useItineraryStore'

/**
 * Maps clean itinerary landmark IDs to the matching background artwork file.
 */
const LANDMARK_IMAGES: Record<string, string> = {
  bigben: '/images/landmarks/bigben.webp',
  britishmuseum: '/images/landmarks/britishmuseum.webp',
  museum: '/images/landmarks/britishmuseum.webp',
  windsorcastle: '/images/landmarks/windsorcastle.webp',
  windsor: '/images/landmarks/windsorcastle.webp',
  brightonpier: '/images/landmarks/brightonpier.webp',
  brighton: '/images/landmarks/brightonpier.webp',
  canal: '/images/landmarks/canal.webp',
  brightonpavilion: '/images/landmarks/brightonpavilion.webp',
  pavilion: '/images/landmarks/brightonpavilion.webp',
  apartment: '/images/landmarks/apartment.webp',
  airport: '/images/landmarks/airport.webp',
  departureairport: '/images/landmarks/departureairport.webp',
  britishrestaurantpub: '/images/landmarks/britishrestaurantpub.webp',
  cafe: '/images/landmarks/cafe.webp',
  clubbing: '/images/landmarks/clubbing.webp',
  cookingatapartment: '/images/landmarks/cookingatapartment.webp',
  frenchrestaurant: '/images/landmarks/frenchrestaurant.webp',
  seafoodrestaurant: '/images/landmarks/seafoodrestaurant.webp',
  steakrestaurant: '/images/landmarks/steakrestaurant.webp',
  movieatapartment: '/images/landmarks/movieatapartment.webp',
  thegrandbrighton: '/images/landmarks/thegrandbrighton.webp',
  holidayinn: '/images/landmarks/holidayinn.webp',
  gym: '/images/landmarks/gym.webp',
  clothshopping: '/images/landmarks/clothshopping.webp',
  afternoontea: '/images/landmarks/afternoontea.webp',
  seaside: '/images/landmarks/brightonpier.webp',
  icl: '/images/landmarks/icl.webp',
}

export function LandmarkBackground() {
  const backgroundLandmarkId = useItineraryStore((state) => state.backgroundLandmarkId) || 'bigben'

  // Clean up the ID by removing any accidental '.webp' or file extensions sent from JSON
  const cleanId = backgroundLandmarkId.replace(/\.[^/.]+$/, '').toLowerCase()
  const imageSrc = LANDMARK_IMAGES[cleanId] ?? LANDMARK_IMAGES.bigben

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={imageSrc}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 0.9, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.42, ease: 'easeInOut' }}
          className="relative h-[80vh] w-[88vw] max-w-[900px] drop-shadow-[0_30px_55px_rgba(62,42,18,0.18)]"
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-contain opacity-90"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}