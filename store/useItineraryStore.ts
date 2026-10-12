'use client'

import { create } from 'zustand'
import type { Restaurant, StudySpot } from '@/lib/itinerary-data'

/**
 * Modal state for the itinerary info popovers.
 *
 * The app opens either a study-spot overview or a restaurant detail card. The
 * union keeps the modal logic explicit and easy to extend.
 */
export type ActiveModal =
  | { type: 'study'; data: StudySpot }
  | { type: 'restaurant'; data: Restaurant }
  | { type: 'none'; data: null }

export type BackgroundMode = 'current' | 'manual'

/**
 * Global state for the tourist passport journal UI.
 *
 * activeLandmarkId and backgroundLandmarkId determine the artwork shown behind the
 * trip timeline. currentLandmarkId tracks the true live activity while the app can
 * temporarily switch into a manual override when a user taps a tile.
 */
type ItineraryState = {
  /** The currently highlighted itinerary item matching the live schedule. */
  activeScheduleItemId: string | null
  /** The current live activity landmark that the time tracker resolves. */
  currentLandmarkId: string
  /** The background artwork currently being displayed. */
  backgroundLandmarkId: string
  /** The immediate visual landmark value used by the card list and background. */
  activeLandmarkId: string
  /** Whether the scene is tracking the live schedule or manually pinned to a tile. */
  backgroundMode: BackgroundMode
  /** Latest timestamp used for the live clock readout and schedule matching. */
  localTime: number
  /** The currently open detail modal, or null when no modal is visible. */
  activeModal: ActiveModal
  setActiveScheduleItem: (itemId: string) => void
  setActiveLandmarkId: (landmarkId: string) => void
  setCurrentActivityLandmarkId: (landmarkId: string) => void
  setManualBackground: (landmarkId: string) => void
  resetBackgroundToCurrent: () => void
  setLocalTime: (time: number) => void
  openStudyModal: (spot: StudySpot) => void
  openRestaurantModal: (restaurant: Restaurant) => void
  closeModal: () => void
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  activeScheduleItemId: null,
  currentLandmarkId: 'bigben',
  backgroundLandmarkId: 'bigben',
  activeLandmarkId: 'bigben',
  backgroundMode: 'current',
  localTime: Date.now(),
  activeModal: { type: 'none', data: null },
  setActiveScheduleItem: (activeScheduleItemId) => set({ activeScheduleItemId }),
  setActiveLandmarkId: (activeLandmarkId) => set({ activeLandmarkId, backgroundLandmarkId: activeLandmarkId }),
  setCurrentActivityLandmarkId: (landmarkId) =>
    set((state) => ({
      currentLandmarkId: landmarkId,
      activeLandmarkId: state.backgroundMode === 'current' ? landmarkId : state.activeLandmarkId,
      backgroundLandmarkId: state.backgroundMode === 'current' ? landmarkId : state.backgroundLandmarkId,
    })),
  setManualBackground: (landmarkId) =>
    set({
      activeLandmarkId: landmarkId,
      backgroundLandmarkId: landmarkId,
      backgroundMode: 'manual',
    }),
  resetBackgroundToCurrent: () =>
    set((state) => ({
      backgroundMode: 'current',
      activeLandmarkId: state.currentLandmarkId,
      backgroundLandmarkId: state.currentLandmarkId,
    })),
  setLocalTime: (localTime) => set({ localTime }),
  openStudyModal: (data) => set({ activeModal: { type: 'study', data } }),
  openRestaurantModal: (data) => set({ activeModal: { type: 'restaurant', data } }),
  closeModal: () => set({ activeModal: { type: 'none', data: null } }),
}))
