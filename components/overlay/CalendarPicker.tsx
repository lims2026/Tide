'use client'

import { motion } from 'framer-motion'

/**
 * CalendarPicker renders the trip-day selector for the single-day overview.
 *
 * The date strip stays scrollable on narrow screens and inline on desktop.
 */
export function CalendarPicker({
  selectedDate,
  dates,
  onSelectDate,
}: {
  selectedDate: string
  dates: string[]
  onSelectDate: (date: string) => void
}) {
  return (
    <div className="pointer-events-auto z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-rose-200/80 bg-[#fffafc]/90 p-2.5 shadow-[0_16px_28px_rgba(205,110,147,0.12)] backdrop-blur-sm md:w-fit md:max-w-full md:rounded-[1.6rem] md:p-3">
      <div className="flex items-center justify-between gap-2 px-2 pb-2 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-pink-700 sm:text-[0.6rem] sm:tracking-[0.24em]">
        <span>Journal days</span>
        <span className="shrink-0">{dates.length} entries</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:pb-0">
        {dates.map((date) => {
          const isSelected = date === selectedDate
          const formatted = new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            weekday: 'short',
            month: 'short',
          }).format(new Date(`${date}T12:00:00`))

          return (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              aria-label={`Show itinerary for ${new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`))}`}
              aria-pressed={isSelected}
              className={`shrink-0 rounded-full border px-3 py-2.5 text-[0.64rem] font-semibold uppercase tracking-[0.1em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 ${
                isSelected
                  ? 'border-pink-500 bg-pink-600 text-white shadow-[0_10px_24px_rgba(219,102,149,0.32)]'
                  : 'border-pink-200 bg-white/70 text-pink-900 hover:bg-pink-50'
              }`}
            >
              {formatted}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
