import { useState, useRef, useEffect } from 'react'
import Toolbar from './Toolbar'
import Scene from './Scene'
import ModelViewerDevScene from './ModelViewerDevScene'
import type { HotspotData, ToolbarPosition, ViewerAPI, ViewerRenderer } from '../types'
import Loader from './Loader'

type ModelViewerLayoutProps = {
  hotspots?: HotspotData[]
  modelUrl: string
  renderer?: ViewerRenderer
}

export default function ModelViewerLayout({
  hotspots = [],
  modelUrl,
  renderer = 'react-three-fiber',
}: ModelViewerLayoutProps) {
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
      {renderer === 'react-three-fiber' && <Loader />}
      <Toolbar
        position={toolbarPosition}
        onPositionChange={setToolbarPosition}
        onToggleAutoRotate={() => viewerAPI.current.toggleAutoRotate?.()}
        viewerAPI={viewerAPI}
      />

      {/* Canvas + hotspots area */}
      <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden">
        {renderer === 'model-viewer' ? (
          <ModelViewerDevScene
            modelUrl={modelUrl}
            hotspots={hotspots}
            viewerAPI={viewerAPI}
          />
        ) : (
          <Scene
            modelUrl={modelUrl}
            hotspots={hotspots}
            viewerAPI={viewerAPI}
          />
        )}
      </div>
    </div>
  )
}
