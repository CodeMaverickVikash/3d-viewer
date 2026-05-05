import { useState } from 'react'
import ModelViewerLayout from "./components/ModelViewerLayout"
import type { HotspotData, ViewerRenderer } from "./types"

const THREE_FIBER_HOTSPOTS: HotspotData[] = [
  {
    id: 1,
    position: [0.9, 0.28, 0.1],
    title: 'North Pole',
    text: 'The north pole attracts nearby iron filings strongly.',
  },
  {
    id: 2,
    position: [0.9, -0.28, 0.1],
    title: 'South Pole',
    text: 'Opposite polarity to the north pole.',
  },
]

const MODEL_VIEWER_HOTSPOTS: HotspotData[] = [
  {
    id: 1,
    position: [0, 1.1, 0.28],
    title: 'Viewer Head',
    text: 'A local glTF asset rendered by the Google model-viewer web component.',
  },
  {
    id: 2,
    position: [0.62, 0.28, 0.12],
    title: 'Control Rail',
    text: 'Native camera controls, AR support, and HTML annotations come from model-viewer.',
  },
  {
    id: 3,
    position: [0.62, 0.28, -0.45],
    title: 'Base Detail',
    text: 'The same toolbar drives model-viewer camera orbit, zoom, reset, and rotation.',
  },
]

const DEMOS: Record<ViewerRenderer, {
  label: string
  modelUrl: string
  hotspots: HotspotData[]
}> = {
  'react-three-fiber': {
    label: 'R3F Demo',
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    hotspots: THREE_FIBER_HOTSPOTS,
  },
  'model-viewer': {
    label: 'modelviewer.dev',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    hotspots: MODEL_VIEWER_HOTSPOTS,
  },
}

export default function App() {
  const [activeDemo, setActiveDemo] = useState<ViewerRenderer>('react-three-fiber')
  const demo = DEMOS[activeDemo]

  return (
    <div className="relative h-dvh w-full">
      <div className="absolute left-3 top-3 z-[60] flex rounded-lg bg-[#2d3748]/95 p-1 shadow-xl backdrop-blur-sm">
        {(Object.keys(DEMOS) as ViewerRenderer[]).map((renderer) => (
          <button
            key={renderer}
            type="button"
            onClick={() => setActiveDemo(renderer)}
            className={`h-9 px-3 text-sm font-semibold transition ${
              activeDemo === renderer
                ? 'rounded-md bg-blue-500 text-white'
                : 'rounded-md text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {DEMOS[renderer].label}
          </button>
        ))}
      </div>

      <ModelViewerLayout
        key={activeDemo}
        renderer={activeDemo}
        hotspots={demo.hotspots}
        modelUrl={demo.modelUrl}
      />
    </div>
  )
}
