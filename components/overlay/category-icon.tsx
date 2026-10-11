import { BedDouble, Camera, Sparkles, TrainFront, UtensilsCrossed, type LucideProps } from 'lucide-react'
import type { EventCategory } from '@/lib/itinerary'

const icons = {
  food: UtensilsCrossed,
  experience: Sparkles,
  transit: TrainFront,
  sightseeing: Camera,
  stay: BedDouble,
} satisfies Record<EventCategory, React.ComponentType<LucideProps>>

export function CategoryIcon({ category, ...props }: { category: EventCategory } & LucideProps) {
  const Icon = icons[category]
  return <Icon aria-hidden="true" {...props} />
}
