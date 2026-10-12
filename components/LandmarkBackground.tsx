'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useItineraryStore } from '@/store/useItineraryStore'

// Map your landmark IDs to their exact WebP filename paths
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

}

export function LandmarkBackground() {
  const activeLandmarkId = useItineraryStore((state) => state.activeLandmarkId)
  const imageSrc = LANDMARK_IMAGES[activeLandmarkId] ?? LANDMARK_IMAGES.bigben

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={imageSrc}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 0.88, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="relative h-[80vh] w-[88vw] max-w-[900px]"
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
