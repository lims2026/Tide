/**
 * Shared time and schedule helpers used by the itinerary timeline.
 *
 * These utilities centralize the logic for formatting live clock values,
 * interpreting schedule start times, and selecting the current quest item.
 * Keeping this logic in one place makes it easier to test and customize as
 * the itinerary grows or moves to a different local timezone.
 */

import type { ItineraryItem } from '@/lib/itinerary-data'

const UK_TIME_ZONE = 'Europe/London'

/**
 * Converts a Date into the UK-local date and clock information used by the app.
 *
 * This intentionally uses Europe/London rather than the browser locale so the
 * itinerary always matches the trip schedule even when the user is travelling.
 */
export function getUKDateTime(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value]),
  )

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    clock: new Intl.DateTimeFormat('en-US', {
      timeZone: UK_TIME_ZONE,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date),
  }
}

/**
 * Converts an itinerary "HH:MM" string into a number of minutes since midnight.
 *
 * This allows the app to compare the current time to each item's scheduled time
 * without relying on brittle string comparisons.
 */
export function parseScheduleMinutes(startTime: string) {
  const [hours, minutes] = startTime.split(':').map(Number)
  return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0)
}

/**
 * Returns the item whose start time is most recent at the current moment.
 *
 * If no item has started yet for the day, the function falls back to the first
 * item of that date. If there are no items for the current UK date, it returns
 * the next upcoming item or the final item in the itinerary.
 */
export function getActiveScheduleItem(date: Date, itineraryItems: ItineraryItem[]) {
  const { date: today, minutes: minutesNow } = getUKDateTime(date)
  const todaysItems = itineraryItems.filter((item) => item.date === today)

  if (todaysItems.length) {
    const active = todaysItems
      .filter((item) => parseScheduleMinutes(item.startTime) <= minutesNow)
      .at(-1)

    return active ?? todaysItems[0]
  }

  return itineraryItems.find((item) => item.date > today) ?? itineraryItems.at(-1)
}
