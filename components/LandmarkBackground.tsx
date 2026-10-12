'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useItineraryStore } from '@/store/useItineraryStore' // Adjust path if needed

// Map your landmark IDs to their exact WebP filename paths
const LANDMARK_IMAGES: Record<string, string> = {
  bigben: '/images/landmarks/bigben.webp',
  windsor: '/images/landmarks/windsorcastle.webp',
  brighton: '/images/landmarks/brightonpier.webp',
  canal: '/images/landmarks/canal.webp',
  museum: '/images/landmarks/britishmuseum.webp',
  pavilion: '/images/landmarks/brightonpavilion.webp',
  apartment: '/images/landmarks/apartment.webp',
}

export function LandmarkBackground() {
  const activeLandmarkId = useItineraryStore((state) => state.activeLandmarkId)
  const imageSrc = LANDMARK_IMAGES[activeLandmarkId] || LANDMARK_IMAGES['bigben']

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLandmarkId}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="relative w-[85%] h-[85%] max-w-[700px] max-h-[700px]"
        >
          <Image
            src={imageSrc}
            alt={`Isometric view of ${activeLandmarkId}`}
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