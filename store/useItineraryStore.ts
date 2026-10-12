'use client'

import { create } from 'zustand'
import type { Restaurant, StudySpot } from '@/lib/itinerary-data'

/**
 * Modal state union for the itinerary detail popovers.
 *
 * The app supports two lightweight modal views: a study-spot card and a
 * restaurant menu panel. Keeping the union explicit makes the UI logic easy to
 * extend without awkward null checks.
 */
export type ActiveModal =
  | { type: 'study'; data: StudySpot }
  | { type: 'restaurant'; data: Restaurant }
  | { type: 'none'; data: null }

/**
 * Global state for the itinerary overlay.
 *
 * activeLandmarkId controls the background image behind the itinerary, while
 * activeScheduleItemId highlights the current quest card in the list. localTime
 * stores the latest live clock value used by the top bar and schedule matcher.
 */
type ItineraryState = {
  /** The current landmark artwork visible behind the trip list. */
  activeLandmarkId: string
  /** The currently active itinerary item ID matching the live schedule. */
  activeScheduleItemId: string | null
  /** Latest client time used for the live time display and schedule checks. */
  localTime: number
  /** The currently open detail modal, or null when no modal is visible. */
  activeModal: ActiveModal
  setActiveScheduleItem: (itemId: string) => void
  setActiveLandmarkId: (landmarkId: string) => void
  setLocalTime: (time: number) => void
  openStudyModal: (spot: StudySpot) => void
  openRestaurantModal: (restaurant: Restaurant) => void
  closeModal: () => void
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  activeLandmarkId: 'bigben',
  activeScheduleItemId: null,
  localTime: Date.now(),
  activeModal: { type: 'none', data: null },
  setActiveScheduleItem: (activeScheduleItemId) => set({ activeScheduleItemId }),
  setActiveLandmarkId: (activeLandmarkId) => set({ activeLandmarkId }),
  setLocalTime: (localTime) => set({ localTime }),
  openStudyModal: (data) => set({ activeModal: { type: 'study', data } }),
  openRestaurantModal: (data) => set({ activeModal: { type: 'restaurant', data } }),
  closeModal: () => set({ activeModal: { type: 'none', data: null } }),
}))
