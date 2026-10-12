import itineraryJson from '@/data/itinerary.json'
import studySpotsJson from '@/data/study_spots.json'
import restaurantsJson from '@/data/restaurants.json'

export type ItineraryItem = {
  id: string
  date: string
  dayTitle: string
  time: string
  startTime: string
  title: string
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

const LOCAL_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

export function getLocalDateTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const minutes = date.getHours() * 60 + date.getMinutes()

  return {
    date: `${year}-${month}-${day}`,
    minutes,
    clock: LOCAL_TIME_FORMATTER.format(date),
  }
}

export function getItemDisplayTitle(item: Pick<ItineraryItem, 'title' | 'activity'>) {
  return item.title || item.activity.split('\n')[0] || 'Untitled activity'
}

export function getItemSummary(item: Pick<ItineraryItem, 'title' | 'activity'>) {
  const base = item.activity || ''
  return base.includes('\n') ? base.slice(base.indexOf('\n') + 1).trim() : base.trim()
}

function parseScheduleMinutes(startTime: string) {
  const [hours, minutes] = startTime.split(':').map(Number)
  return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0)
}

export function getItemLocationUrl(item: Pick<ItineraryItem, 'id' | 'title' | 'activity'>, studySpot?: StudySpot | null, restaurant?: Restaurant | null) {
  const title = `${item.title} ${item.activity}`.toLowerCase()

  if (title.includes('heathrow') || title.includes('lhr')) {
    return 'https://www.google.com/maps/search/?api=1&query=London%20Heathrow%20Airport%20(LHR)'
  }

  if (title.includes('m&c') || title.includes('saatchi') || title.includes('golden square')) {
    return 'https://www.google.com/maps/search/?api=1&query=M%26C%20Saatchi%2C%2036%20Golden%20Square%2C%20London%20W1F%209EE'
  }

  if (restaurant?.mapsUrl) return restaurant.mapsUrl
  if (studySpot?.mapsUrl) return studySpot.mapsUrl
  return null
}

export function getItemWebsiteUrl(item: Pick<ItineraryItem, 'id' | 'title' | 'activity'>, studySpot?: StudySpot | null, restaurant?: Restaurant | null) {
  const title = `${item.title} ${item.activity}`.toLowerCase()
  if (title.includes('m&c') || title.includes('saatchi') || title.includes('golden square') || title.includes('heathrow') || title.includes('lhr')) {
    return getItemLocationUrl(item, studySpot, restaurant)
  }
  return restaurant?.menuUrl || studySpot?.mapsUrl || null
}

/** Select the latest scheduled activity at or before local time, or the next upcoming one. */
export function getActiveScheduleItem(date: Date): ItineraryItem | undefined {
  const { date: today, minutes: minutesNow } = getLocalDateTime(date)
  const todaysItems = itineraryItems.filter((item) => item.date === today)

  if (todaysItems.length) {
    const active = todaysItems.filter((item) => parseScheduleMinutes(item.startTime) <= minutesNow).at(-1)
    return active ?? todaysItems[0]
  }

  return itineraryItems.find((item) => item.date > today) ?? itineraryItems.at(-1)
}

export const itineraryDays = itineraryItems.reduce<{ date: string; title: string; items: ItineraryItem[] }[]>((days, item) => {
  const currentDay = days.at(-1)
  if (currentDay?.date === item.date) currentDay.items.push(item)
  else days.push({ date: item.date, title: item.dayTitle, items: [item] })
  return days
}, [])
