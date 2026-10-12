import Image from 'next/image'
import { ItineraryOverlay } from '@/components/overlay/itinerary-overlay'

export default function Page() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-slate-950">
      {/* High-quality background image or regional backdrop */}
      <Image
        src="/images/london-dusk.jpg" // Place your preferred background in public/images/
        alt="London city sky line at dusk"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />

      {/* Subtle overlay gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/80"
      />

      {/* Main Itinerary Overlay UI */}
      <div className="relative z-10 h-full w-full">
        <ItineraryOverlay />
      </div>
    </main>
  )
}