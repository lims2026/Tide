import { ItineraryOverlay } from '@/components/overlay/itinerary-overlay'

export default function Page() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-slate-950">
      <div className="relative z-10 h-full w-full">
        <ItineraryOverlay />
      </div>
    </main>
  )
}
