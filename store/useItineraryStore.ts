'use client'

import { create } from 'zustand'
import type { Restaurant, StudySpot } from '@/lib/itinerary-data'

const TRIP_START_DATE = '2026-10-14'
const POEM_INDEX_KEY = 'larrys-tour-guide-poem-index'
const SELECTED_DATE_KEY = 'larrys-tour-guide-selected-date'
const WELCOME_SEEN_KEY = 'larrys_guide_welcome_seen'

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
export type ExcitementChoice = 'see-me' | 'super' | null

/**
 * Global state for the tourist passport journal UI.
 *
 * The app tracks the live current activity, supports a manual tile override, and
 * persists the poem index and selected date so the field journal feels personal.
 */
type ItineraryState = {
  activeScheduleItemId: string | null
  currentLandmarkId: string
  backgroundLandmarkId: string
  activeLandmarkId: string
  backgroundMode: BackgroundMode
  selectedDate: string
  focusMode: boolean
  showSplash: boolean
  excitementChoice: ExcitementChoice
  poemIndex: number
  localTime: number
  activeModal: ActiveModal
  setActiveScheduleItem: (itemId: string) => void
  setActiveLandmarkId: (landmarkId: string) => void
  setCurrentActivityLandmarkId: (landmarkId: string) => void
  setManualBackground: (landmarkId: string) => void
  resetBackgroundToCurrent: () => void
  setLocalTime: (time: number) => void
  setSelectedDate: (date: string) => void
  setFocusMode: (value: boolean) => void
  toggleFocusMode: () => void
  setShowSplash: (value: boolean) => void
  setExcitementChoice: (choice: ExcitementChoice) => void
  setPoemIndex: (index: number) => void
  resetAppProgress: () => void
  openStudyModal: (spot: StudySpot) => void
  openRestaurantModal: (restaurant: Restaurant) => void
  closeModal: () => void
}

/**
 * Stores a string value in localStorage when the browser is available.
 */
function persistState(key: string, value: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value)
  }
}

/**
 * Resets the chapter index, trip date, and journal mood back to the first page.
 */
export function resetAppProgress() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(POEM_INDEX_KEY)
    window.localStorage.removeItem(SELECTED_DATE_KEY)
    window.localStorage.removeItem(WELCOME_SEEN_KEY)
  }
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  activeScheduleItemId: null,
  currentLandmarkId: 'bigben',
  backgroundLandmarkId: 'bigben',
  activeLandmarkId: 'bigben',
  backgroundMode: 'current',
  selectedDate: typeof window !== 'undefined' ? window.localStorage.getItem(SELECTED_DATE_KEY) || TRIP_START_DATE : TRIP_START_DATE,
  focusMode: false,
  showSplash: true,
  excitementChoice: null,
  poemIndex: typeof window !== 'undefined' ? Number(window.localStorage.getItem(POEM_INDEX_KEY) || '0') : 0,
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
  setSelectedDate: (selectedDate) => {
    persistState(SELECTED_DATE_KEY, selectedDate)
    set({ selectedDate })
  },
  setFocusMode: (focusMode) => set({ focusMode }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  setShowSplash: (showSplash) => set({ showSplash }),
  setExcitementChoice: (excitementChoice) => set({ excitementChoice }),
  setPoemIndex: (poemIndex) => {
    persistState(POEM_INDEX_KEY, String(poemIndex))
    set({ poemIndex })
  },
  resetAppProgress: () => {
    resetAppProgress()

    set({
      activeScheduleItemId: null,
      currentLandmarkId: 'bigben',
      poemIndex: 0,
      selectedDate: TRIP_START_DATE,
      backgroundMode: 'current',
      activeLandmarkId: 'bigben',
      backgroundLandmarkId: 'bigben',
      showSplash: true,
      excitementChoice: null,
      focusMode: false,
      activeModal: { type: 'none', data: null },
      localTime: Date.now(),
    })
  },
  openStudyModal: (data) => set({ activeModal: { type: 'study', data } }),
  openRestaurantModal: (data) => set({ activeModal: { type: 'restaurant', data } }),
  closeModal: () => set({ activeModal: { type: 'none', data: null } }),
}))

if (typeof window !== 'undefined') {
  ;(window as Window & { resetAppProgress?: () => void }).resetAppProgress = resetAppProgress
}
