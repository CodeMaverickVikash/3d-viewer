import { Canvas } from '@react-three/fiber'
import { Suspense, memo } from 'react'
import { Environment } from '@react-three/drei'
import Model from './Model'
import Hotspot from './Hotspot'
import CameraController from './CameraController'
import type { MutableRefObject } from 'react'
import type { HotspotData, ViewerAPI } from '../types'

const Scene = memo(function Scene({
  modelUrl,
  hotspots,
  viewerAPI,
}: {
  modelUrl: string
  hotspots: HotspotData[]
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
      <CameraController viewerAPIRef={viewerAPI} />

      <Suspense fallback={null}>
        <Model url={modelUrl} />

        {hotspots.map((hs) => (
          <Hotspot
            key={hs.id}
            hotspot={hs}
          />
        ))}
      </Suspense>
    </Canvas>
  )
})

export default Scene
