'use client'

import { motion } from 'framer-motion'

/**
 * CalendarPicker renders the trip-day selector for the single-day overview.
 *
 * The journal is designed to show one date at a time so the user can focus on a
 * specific itinerary chapter without scrolling through the entire trip.
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
    <div className="z-10 w-full max-w-2xl rounded-[1.6rem] border border-rose-200/80 bg-[#fffafc]/90 p-3 shadow-[0_16px_28px_rgba(205,110,147,0.12)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 px-2 pb-2 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-pink-700">
        <span>Journal days</span>
        <span>{dates.length} entries</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {dates.map((date) => {
          const isSelected = date === selectedDate
          const formatted = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          }).format(new Date(`${date}T12:00:00`))

          return (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`rounded-full border px-3 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.12em] transition ${
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
