import itineraryJson from '@/data/itinerary.json'
import studySpotsJson from '@/data/study_spots.json'
import restaurantsJson from '@/data/restaurants.json'

export type ItineraryItem = {
  id: string
  date: string
  dayTitle: string
  time: string
  startTime: string
  activity: string
  landmarkId: string
  nearestStudySpotId: string | null
  restaurantId?: string
}

export type StudySpot = {
  id: string
  name: string
  distance: string
  address: string
  amenities: string[]
  mapsUrl: string
}

export type Restaurant = {
  id: string
  name: string
  meal: string
  day: string
  note: string
  address: string
  menuUrl: string
  mapsUrl: string
  gps_xyz?: { x: number; y: number; z: number; unit: string }
}

export const itineraryItems = itineraryJson.items as ItineraryItem[]
export const studySpots = studySpotsJson as StudySpot[]
export const restaurants = restaurantsJson.restaurants as Restaurant[]

export const getStudySpot = (id: string | null) => studySpots.find((spot) => spot.id === id)
export const getRestaurant = (id?: string) => restaurants.find((restaurant) => restaurant.id === id)

const localDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Select the latest scheduled activity at or before local time, or the next upcoming one. */
export function getActiveScheduleItem(date: Date): ItineraryItem | undefined {
  const today = localDateKey(date)
  const todaysItems = itineraryItems.filter((item) => item.date === today)
  const minutesNow = date.getHours() * 60 + date.getMinutes()
  if (todaysItems.length) {
    return todaysItems.filter((item) => {
      const [hours, minutes] = item.startTime.split(':').map(Number)
      return hours * 60 + minutes <= minutesNow
    }).at(-1) ?? todaysItems[0]
  }
  return itineraryItems.find((item) => item.date > today) ?? itineraryItems.at(-1)
}
