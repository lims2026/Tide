export type EventCategory = 'food' | 'experience' | 'transit' | 'sightseeing' | 'stay'

export type ItineraryEvent = {
  id: string
  title: string
  location: string
  category: EventCategory
  /** Minutes from midnight */
  start: number
  /** Minutes from midnight */
  end: number
}

export type EventStatus = 'done' | 'current' | 'upcoming'

const t = (h: number, m = 0) => h * 60 + m

export const tripMeta = {
  city: 'Tokyo',
  day: 'Day 2',
  date: 'Sun, Oct 11',
}

export const itinerary: ItineraryEvent[] = [
  { id: 'breakfast', title: 'Breakfast at Tsukiji Outer Market', location: 'Chuo City', category: 'food', start: t(7, 30), end: t(8, 30) },
  { id: 'teamlab', title: 'teamLab Planets', location: 'Toyosu, Koto City', category: 'experience', start: t(9), end: t(11) },
  { id: 'yurikamome', title: 'Yurikamome Line to Shimbashi', location: 'Toyosu → Shimbashi', category: 'transit', start: t(11, 30), end: t(12, 15) },
  { id: 'sushi', title: 'Omakase lunch at Kyubey', location: 'Ginza 8-chome', category: 'food', start: t(12, 45), end: t(14, 15) },
  { id: 'meiji', title: 'Meiji Jingu & Omotesando walk', location: 'Shibuya City', category: 'sightseeing', start: t(14, 30), end: t(16, 30) },
  { id: 'shibuya-sky', title: 'Sunset at Shibuya Sky', location: 'Shibuya Scramble Square', category: 'sightseeing', start: t(17), end: t(18, 30) },
  { id: 'yokocho', title: 'Dinner in Omoide Yokocho', location: 'Nishi-Shinjuku', category: 'food', start: t(19, 30), end: t(21, 30) },
  { id: 'hotel', title: 'Return to Park Hyatt', location: 'Nishi-Shinjuku 3-chome', category: 'stay', start: t(22), end: t(22, 30) },
]

export const categoryLabel: Record<EventCategory, string> = {
  food: 'Food',
  experience: 'Experience',
  transit: 'Transit',
  sightseeing: 'Sightseeing',
  stay: 'Stay',
}

export function getStatus(event: ItineraryEvent, now: number): EventStatus {
  if (now >= event.end) return 'done'
  if (now >= event.start) return 'current'
  return 'upcoming'
}

export function getCurrentAndNext(events: ItineraryEvent[], now: number) {
  const current = events.find((e) => now >= e.start && now < e.end) ?? null
  const next = events.find((e) => e.start > now) ?? null
  return { current, next }
}

export function formatClock(minutes: number) {
  const total = Math.floor(minutes) % (24 * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatDuration(minutes: number) {
  const total = Math.max(0, Math.round(minutes))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatCountdown(minutes: number) {
  const totalSeconds = Math.max(0, Math.floor(minutes * 60))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
