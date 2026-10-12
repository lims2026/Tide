import { ItineraryOverlay } from '@/components/overlay/itinerary-overlay'

/**
 * Route entry point for the tourist passport screen.
 *
 * The page itself is intentionally minimal so the overlay and journal styling can
 * own the full presentation without extra chrome.
 */
export default function Page() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#f6f0e0]">
      <div className="relative z-10 h-full w-full">
        <ItineraryOverlay />
      </div>
    </main>
  )
}
