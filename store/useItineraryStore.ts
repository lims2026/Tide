'use client'

import { create } from 'zustand'
import type { ItineraryItem, Restaurant, StudySpot } from '@/lib/itinerary-data'

export type ActiveModal =
  | { type: 'study'; data: StudySpot }
  | { type: 'restaurant'; data: Restaurant }
  | { type: 'none'; data: null }

type ItineraryState = {
  activeLandmarkId: string
  activeScheduleItemId: string | null
  localTime: number
  activeModal: ActiveModal
  setActiveScheduleItem: (item: ItineraryItem) => void
  setLocalTime: (time: number) => void
  openStudyModal: (spot: StudySpot) => void
  openRestaurantModal: (restaurant: Restaurant) => void
  closeModal: () => void
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  activeLandmarkId: 'bigben',
  activeScheduleItemId: null,
  localTime: 0,
  activeModal: { type: 'none', data: null },
  setActiveScheduleItem: (item) => set({ activeScheduleItemId: item.id, activeLandmarkId: item.landmarkId }),
  setLocalTime: (localTime) => set({ localTime }),
  openStudyModal: (data) => set({ activeModal: { type: 'study', data } }),
  openRestaurantModal: (data) => set({ activeModal: { type: 'restaurant', data } }),
  closeModal: () => set({ activeModal: { type: 'none', data: null } }),
}))
