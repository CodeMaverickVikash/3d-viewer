import type { HotspotData } from '../types'

type HotspotNavigatorProps = {
  hotspots: HotspotData[]
  activeHotspot: HotspotData | null
  onNavigate: (hotspot: HotspotData | null) => void
}

export default function HotspotNavigator({ hotspots, activeHotspot, onNavigate }: HotspotNavigatorProps) {
  const currentIndex = hotspots.findIndex((h) => h.id === activeHotspot?.id)

  const handleNext = () => {
    if (hotspots.length === 0) return

    if (currentIndex === -1) {
      // None active -> select first
      onNavigate(hotspots[0])
    } else if (currentIndex < hotspots.length - 1) {
      onNavigate(hotspots[currentIndex + 1])
    } else {
      // Loop back / deselect
      onNavigate(null)
    }
  }

  const label =
    currentIndex === -1
      ? 'Select Point'
      : `Point ${activeHotspot?.id}`

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <button
        onClick={handleNext}
        className="flex items-center gap-2 bg-[#2d3748] hover:bg-[#4a5568]
                   text-white text-sm font-semibold px-5 py-2.5
                   rounded-full shadow-lg transition-colors duration-150"
      >
        {label}
        <span className="text-base">{'>'}</span>
      </button>
    </div>
  )
}
