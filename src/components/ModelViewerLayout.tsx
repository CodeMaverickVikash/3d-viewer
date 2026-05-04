import { useState, useRef } from 'react'
import Toolbar from './Toolbar'
import Scene from './Scene'
import type { HotspotData, ToolbarPosition, ViewerAPI } from '../types'

type ModelViewerLayoutProps = {
  hotspots?: HotspotData[]
  modelUrl: string
}

export default function ModelViewerLayout({ hotspots = [], modelUrl }: ModelViewerLayoutProps) {
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>('right')

  // Shared imperative API: Scene fills this, Toolbar reads it
  const viewerAPI = useRef<ViewerAPI>({})

  const containerClass =
    toolbarPosition === 'top'
      ? 'flex flex-col w-full h-screen bg-[#d1d1d1]'
      : toolbarPosition === 'left'
      ? 'flex flex-row w-full h-screen bg-[#d1d1d1]'
      : 'flex flex-row-reverse w-full h-screen bg-[#d1d1d1]'

  return (
    <div className={containerClass}>
      <Toolbar
        position={toolbarPosition}
        onPositionChange={setToolbarPosition}
        onToggleAutoRotate={() => viewerAPI.current.toggleAutoRotate?.()}
        viewerAPI={viewerAPI}
      />

      {/* Canvas + hotspots area */}
      <div className="relative flex-1 overflow-hidden">
        <Scene
          modelUrl={modelUrl}
          hotspots={hotspots}
          viewerAPI={viewerAPI}
        />
      </div>
    </div>
  )
}
