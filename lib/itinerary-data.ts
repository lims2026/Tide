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
  nearestStudySpotId?: string
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

export const getStudySpot = (id?: string | null) => studySpots.find((spot) => spot.id === id)
export const getRestaurant = (id?: string) => restaurants.find((restaurant) => restaurant.id === id)

const UK_TIME_ZONE = 'Europe/London'
const ukDateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: UK_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function getUKDateTime(date: Date) {
  const parts = Object.fromEntries(ukDateTimeFormatter.formatToParts(date).map(({ type, value }) => [type, value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    clock: new Intl.DateTimeFormat('en-GB', { timeZone: UK_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date),
  }
}

/** Select the latest scheduled activity at or before local time, or the next upcoming one. */
export function getActiveScheduleItem(date: Date): ItineraryItem | undefined {
  const { date: today, minutes: minutesNow } = getUKDateTime(date)
  const todaysItems = itineraryItems.filter((item) => item.date === today)
  if (todaysItems.length) {
    return todaysItems.filter((item) => {
      const [hours, minutes] = item.startTime.split(':').map(Number)
      return hours * 60 + minutes <= minutesNow
    }).at(-1) ?? todaysItems[0]
  }
  return itineraryItems.find((item) => item.date > today) ?? itineraryItems.at(-1)
}

export const itineraryDays = itineraryItems.reduce<{ date: string; title: string; items: ItineraryItem[] }[]>((days, item) => {
  const currentDay = days.at(-1)
  if (currentDay?.date === item.date) currentDay.items.push(item)
  else days.push({ date: item.date, title: item.dayTitle, items: [item] })
  return days
}, [])
