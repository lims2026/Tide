import Image from 'next/image'
import { ItineraryOverlay } from '@/components/overlay/itinerary-overlay'

export default function Page() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#0b0f1a]">
      <Image
        src="/images/tokyo-dusk.png"
        alt="Aerial view of Tokyo at dusk with Tokyo Tower glowing in the distance"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/30"
      />
      <ItineraryOverlay />
    </main>
  )
}
