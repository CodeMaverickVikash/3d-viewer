import { useState, useRef, useEffect } from 'react'
import Toolbar from './Toolbar'
import Scene from './Scene'
import type { HotspotData, ToolbarPosition, ViewerAPI } from '../types'
import Loader from './Loader'

type ModelViewerLayoutProps = {
  hotspots?: HotspotData[]
  modelUrl: string
}

export default function ModelViewerLayout({ hotspots = [], modelUrl }: ModelViewerLayoutProps) {
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>(
    () => (typeof window !== 'undefined' && window.innerWidth < 768) ? 'bottom' : 'right'
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => {
      setToolbarPosition(e.matches ? 'bottom' : 'right')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Shared imperative API: Scene fills this, Toolbar reads it
  const viewerAPI = useRef<ViewerAPI>({})

  const containerClass =
    toolbarPosition === 'top'
      ? 'relative flex flex-col w-full h-dvh bg-[#d1d1d1]'
      : toolbarPosition === 'bottom'
      ? 'relative flex flex-col-reverse w-full h-dvh bg-[#d1d1d1]'
      : toolbarPosition === 'left'
      ? 'relative flex flex-row w-full h-dvh bg-[#d1d1d1]'
      : 'relative flex flex-row-reverse w-full h-dvh bg-[#d1d1d1]'

  return (
    <div className={containerClass}>
      <Loader />
      <Toolbar
        position={toolbarPosition}
        onPositionChange={setToolbarPosition}
        onToggleAutoRotate={() => viewerAPI.current.toggleAutoRotate?.()}
        viewerAPI={viewerAPI}
      />

      {/* Canvas + hotspots area */}
      <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden">
        <Scene
          modelUrl={modelUrl}
          hotspots={hotspots}
          viewerAPI={viewerAPI}
        />
      </div>
    </div>
  )
}
