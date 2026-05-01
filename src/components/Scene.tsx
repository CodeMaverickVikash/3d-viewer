import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import Model from './Model'
import Hotspot from './Hotspot'
import CameraController from './CameraController'
import type { MutableRefObject } from 'react'
import type { HotspotData, ViewerAPI } from '../types'

export default function Scene({
  modelUrl,
  hotspots,
  activeHotspot,
  onHotspotClick,
  autoRotate,
  viewerAPI,
}: {
  modelUrl: string
  hotspots: HotspotData[]
  activeHotspot: HotspotData | null
  onHotspotClick: (hotspot: HotspotData | null) => void
  autoRotate: boolean
  viewerAPI: MutableRefObject<ViewerAPI>
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ background: '#d1d1d1', width: '100%', height: '100%' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />

      {/* Imperative camera API exposed to outside */}
      <CameraController viewerAPI={viewerAPI} autoRotate={autoRotate} />

      <Suspense fallback={null}>
        <Model url={modelUrl} />

        {hotspots.map((hs) => (
          <Hotspot
            key={hs.id}
            hotspot={hs}
            isActive={activeHotspot?.id === hs.id}
            onClick={() =>
              onHotspotClick(activeHotspot?.id === hs.id ? null : hs)
            }
          />
        ))}
      </Suspense>
    </Canvas>
  )
}
