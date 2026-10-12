'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useItineraryStore } from '@/store/useItineraryStore'

/**
 * Maps each itinerary landmark ID to its artwork file.
 *
 * These IDs are intentionally stored in the itinerary data so the visual scene
 * always matches the story beat for the active card. We keep the mapping here so
 * the background can be swapped without altering the itinerary schema.
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
}

/**
 * LandmarkBackground renders the live scene behind the itinerary.
 *
 * It subscribes to the active landmark ID from Zustand, then cross-fades to the
 * matching artwork using Framer Motion. This creates a polished transition as the
 * user scrolls through the trip and the current quest changes.
 */
export function LandmarkBackground() {
  const activeLandmarkId = useItineraryStore((state) => state.activeLandmarkId)
  const imageSrc = LANDMARK_IMAGES[activeLandmarkId] ?? LANDMARK_IMAGES.bigben

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={imageSrc}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 0.9, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.42, ease: 'easeInOut' }}
          className="relative h-[80vh] w-[88vw] max-w-[900px] drop-shadow-[0_30px_55px_rgba(60,38,15,0.16)]"
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
