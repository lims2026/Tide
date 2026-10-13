import itineraryJson from '@/data/itinerary.json'
import studySpotsJson from '@/data/study_spots.json'
import restaurantsJson from '@/data/restaurants.json'

export const TRIP_START_DATE = '2026-10-14'
export const TRIP_END_DATE = '2026-10-27'

/**
 * A single scheduled stop in the trip itinerary.
 *
 * Each item contains the date, title, times, and the landmark image it should map
 * to when the user is browsing the journal or tracking the live schedule.
 */
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

/**
 * Detail data for a nearby study space and its quick-travel links.
 */
export type StudySpot = {
  id: string
  name: string
  distance: string
  address: string
  amenities: string[]
  mapsUrl: string
}

/**
 * Detail data for a restaurant or food stop on the trip.
 */
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

/**
 * Sorts itinerary items by UTC date and then by start time.
 *
 * This keeps the schedule consistent even if the source JSON is unordered or a
 * future export is not already chronological. The function preserves the original
 * hyperlink values by never modifying restaurant URLs.
 */
export function sortItineraryItems(items: ItineraryItem[]) {
  return [...items].sort((left, right) => {
    const dateComparison = left.date.localeCompare(right.date)
    if (dateComparison !== 0) return dateComparison

    return (left.startTime || '00:00').localeCompare(right.startTime || '00:00')
  })
}

export const itineraryItems = sortItineraryItems(itineraryJson.items as ItineraryItem[])
export const studySpots = studySpotsJson as StudySpot[]
export const restaurants = restaurantsJson.restaurants as Restaurant[]

/**
 * Finds the study-spot record matching the item reference in the itinerary.
 */
export const getStudySpot = (id?: string | null) => studySpots.find((spot) => spot.id === id)

/**
 * Finds the restaurant record matching the item reference in the itinerary.
 */
export const getRestaurant = (id?: string) => restaurants.find((restaurant) => restaurant.id === id)

/** Keep a study spot from being recommended on more than one itinerary card. */
export const uniqueStudySpotsByItemId = (() => {
  const usedSpotIds = new Set<string>()
  const assignments = new Map<string, StudySpot>()

  for (const item of itineraryItems) {
    if (!item.nearestStudySpotId || usedSpotIds.has(item.nearestStudySpotId)) continue
    const spot = getStudySpot(item.nearestStudySpotId)
    if (!spot) continue
    usedSpotIds.add(spot.id)
    assignments.set(item.id, spot)
  }

  return assignments
})()

export const getStudySpotForItem = (item: Pick<ItineraryItem, 'id'>) => uniqueStudySpotsByItemId.get(item.id)

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

/**
 * Converts a Date object to the UK-local fields used by the trip logic.
 */
export function getUKDateTime(date: Date) {
  const parts = Object.fromEntries(ukDateTimeFormatter.formatToParts(date).map(({ type, value }) => [type, value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    clock: new Intl.DateTimeFormat('en-US', { timeZone: UK_TIME_ZONE, hour: 'numeric', minute: '2-digit', hour12: true }).format(date),
  }
}

/**
 * Returns the title or first line of the activity text when a card needs a label.
 */
export function getItemDisplayTitle(item: Pick<ItineraryItem, 'title' | 'activity'>) {
  return item.title || item.activity.split('\n')[0] || 'Untitled activity'
}

/**
 * Returns the longer blurb shown in the expanded card details.
 */
export function getItemSummary(item: Pick<ItineraryItem, 'title' | 'activity'>) {
  const base = item.activity || ''
  return base.includes('\n') ? base.slice(base.indexOf('\n') + 1).trim() : base.trim()
}

/**
 * Converts a schedule string like HH:MM into minutes since midnight.
 */
function parseScheduleMinutes(startTime: string) {
  const [hours, minutes] = startTime.split(':').map(Number)
  return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0)
}

/**
 * Builds the correct map link for each itinerary item with fallbacks for study and restaurant data.
 */
export function getItemLocationUrl(item: Pick<ItineraryItem, 'id' | 'title' | 'activity'>, studySpot?: StudySpot | null, restaurant?: Restaurant | null) {
  const title = `${item.title} ${item.activity}`.toLowerCase()

  if (title.includes('heathrow') || title.includes('lhr')) {
    return 'https://www.google.com/maps/search/?api=1&query=London%20Heathrow%20Airport%20(LHR)'
  }

  if (title.includes('m&c') || title.includes('saatchi') || title.includes('golden square')) {
    return 'https://www.google.com/maps/search/?api=1&query=M%26C%20Saatchi%2C%2036%20Golden%20Square%2C%20London%20W1F%209EE'
  }

  if (title.includes('the grand brighton') || title.includes('grand hotel')) {
    return 'https://www.google.com/maps/search/?api=1&query=The%20Grand%20Brighton%2C%2097-99%20Kings%20Road%2C%20Brighton'
  }
  if (title.includes('holiday inn')) {
    return 'https://www.google.com/maps/search/?api=1&query=Holiday%20Inn%20Brighton%20Seafront'
  }
  if (title.includes('legends')) {
    return 'https://www.google.com/maps/search/?api=1&query=Legends%20Hotel%20%26%20Bar%2C%2031-34%20Marine%20Parade%2C%20Brighton'
  }
  if (title.includes('british museum')) {
    return 'https://www.google.com/maps/search/?api=1&query=The%20British%20Museum%2C%20Great%20Russell%20Street%2C%20London'
  }
  if (title.includes('natural history') || title.includes('v&a museum')) {
    return 'https://www.google.com/maps/search/?api=1&query=Natural%20History%20Museum%20and%20Victoria%20and%20Albert%20Museum%2C%20London'
  }
  if (title.includes('national gallery')) {
    return 'https://www.google.com/maps/search/?api=1&query=The%20National%20Gallery%2C%20Trafalgar%20Square%2C%20London'
  }

  if (restaurant?.mapsUrl) return restaurant.mapsUrl
  if (studySpot?.mapsUrl) return studySpot.mapsUrl
  return null
}

/**
 * Returns the external website link for places that need a direct resource or menu.
 */
export function getItemWebsiteUrl(item: Pick<ItineraryItem, 'id' | 'title' | 'activity'>, studySpot?: StudySpot | null, restaurant?: Restaurant | null) {
  const title = `${item.title} ${item.activity}`.toLowerCase()
  if (title.includes('m&c') || title.includes('saatchi') || title.includes('golden square') || title.includes('heathrow') || title.includes('lhr')) {
    return getItemLocationUrl(item, studySpot, restaurant)
  }
  return restaurant?.menuUrl || null
}

/**
 * Selects the latest scheduled activity at or before the current UK time, or the next upcoming one.
 */
export function getActiveScheduleItem(date: Date, items: ItineraryItem[] = itineraryItems): ItineraryItem | undefined {
  const { date: today, minutes: minutesNow } = getUKDateTime(date)
  const todaysItems = items.filter((item) => item.date === today)

  if (todaysItems.length) {
    const active = todaysItems.filter((item) => parseScheduleMinutes(item.startTime) <= minutesNow).at(-1)
    return active ?? todaysItems[0]
  }

  return items.find((item) => item.date > today) ?? items.at(-1)
}

/**
 * Groups itinerary items by date so the journal can render a passport-style day marker.
 */
export const itineraryDays = itineraryItems.reduce<{ date: string; title: string; items: ItineraryItem[] }[]>((days, item) => {
  const currentDay = days.at(-1)
  if (currentDay?.date === item.date) currentDay.items.push(item)
  else days.push({ date: item.date, title: item.dayTitle, items: [item] })
  return days
}, [])
