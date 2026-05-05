import '@google/model-viewer/dist/model-viewer.min.js'
import { memo, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import type { ModelViewerElement } from '@google/model-viewer'
import type { HotspotData, ViewerAPI } from '../types'
import Loader from './Loader'

type ModelViewerDevSceneProps = {
  modelUrl: string
  hotspots: HotspotData[]
  viewerAPI: MutableRefObject<ViewerAPI>
}

const DEFAULT_CAMERA_ORBIT = '0deg 75deg auto'
const DEFAULT_CAMERA_TARGET = 'auto'
const DEFAULT_FIELD_OF_VIEW = 'auto'
const ORBIT_STEP = Math.PI / 10
const PHI_STEP = Math.PI / 14
const MIN_PHI = 0.25
const MAX_PHI = Math.PI - 0.25

function setOrbit(
  viewer: ModelViewerElement | null,
  next: (orbit: ReturnType<ModelViewerElement['getCameraOrbit']>) => {
    theta: number
    phi: number
    radius: number
  },
) {
  if (!viewer) return

  const orbit = next(viewer.getCameraOrbit())
  viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius}m`
  viewer.jumpCameraToGoal()
}

const ModelViewerDevScene = memo(function ModelViewerDevScene({
  modelUrl,
  hotspots,
  viewerAPI,
}: ModelViewerDevSceneProps) {
  const modelViewerRef = useRef<ModelViewerElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const viewer = modelViewerRef.current
    if (!viewer) return

    viewerAPI.current.reset = () => {
        viewer.cameraOrbit = DEFAULT_CAMERA_ORBIT
        viewer.cameraTarget = DEFAULT_CAMERA_TARGET
        viewer.fieldOfView = DEFAULT_FIELD_OF_VIEW
        viewer.resetTurntableRotation()
        viewer.jumpCameraToGoal()
      }
    viewerAPI.current.zoomIn = () => viewer.zoom(1)
    viewerAPI.current.zoomOut = () => viewer.zoom(-1)
    viewerAPI.current.orbitLeft = () => {
      setOrbit(viewer, ({ theta, phi, radius }) => ({ theta: theta - ORBIT_STEP, phi, radius }))
    }
    viewerAPI.current.orbitRight = () => {
      setOrbit(viewer, ({ theta, phi, radius }) => ({ theta: theta + ORBIT_STEP, phi, radius }))
    }
    viewerAPI.current.orbitUp = () => {
      setOrbit(viewer, ({ theta, phi, radius }) => ({
        theta,
        phi: Math.max(MIN_PHI, phi - PHI_STEP),
        radius,
      }))
    }
    viewerAPI.current.orbitDown = () => {
      setOrbit(viewer, ({ theta, phi, radius }) => ({
        theta,
        phi: Math.min(MAX_PHI, phi + PHI_STEP),
        radius,
      }))
    }
    viewerAPI.current.toggleAutoRotate = () => {
      viewer.autoRotate = !viewer.autoRotate
    }

    return () => {
      viewerAPI.current = {}
    }
  }, [viewerAPI])

  useEffect(() => {
    const viewer = modelViewerRef.current
    if (!viewer) return

    setLoadError(null)
    setIsLoading(!viewer.loaded)
    setProgress(viewer.loaded ? 100 : 0)

    const onProgress = (event: Event) => {
      const totalProgress = (event as CustomEvent<{ totalProgress: number }>).detail?.totalProgress ?? 0
      setProgress(Math.round(totalProgress * 100))
      setIsLoading(totalProgress < 1)
    }
    const onLoad = () => {
      setProgress(100)
      setIsLoading(false)
    }
    const onError = () => {
      setLoadError('Unable to load the GLB model.')
      setIsLoading(false)
    }

    viewer.addEventListener('progress', onProgress)
    viewer.addEventListener('load', onLoad)
    viewer.addEventListener('error', onError)
    return () => {
      viewer.removeEventListener('progress', onProgress)
      viewer.removeEventListener('load', onLoad)
      viewer.removeEventListener('error', onError)
    }
  }, [modelUrl])

  return (
    <div className="relative h-full min-h-0 w-full bg-[#d1d1d1]">
      <Loader active={isLoading} progress={progress} />
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt="modelviewer.dev demo 3D astronaut"
        ar
        camera-controls
        touch-action="none"
        camera-orbit={DEFAULT_CAMERA_ORBIT}
        camera-target={DEFAULT_CAMERA_TARGET}
        field-of-view={DEFAULT_FIELD_OF_VIEW}
        min-camera-orbit="auto auto 0.5m"
        max-camera-orbit="auto auto 8m"
        min-field-of-view="10deg"
        max-field-of-view="45deg"
        environment-image="neutral"
        shadow-intensity="0.85"
        shadow-softness="0.8"
        interaction-prompt="auto"
        style={{ display: 'block', height: '100%', width: '100%' }}
      >
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            slot={`hotspot-${hotspot.id}`}
            type="button"
            data-position={`${hotspot.position[0]}m ${hotspot.position[1]}m ${hotspot.position[2]}m`}
            data-normal="0m 1m 0m"
            className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#2d3748] text-sm font-bold text-white shadow-lg transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            {hotspot.id}
            <span className="pointer-events-none absolute bottom-11 left-1/2 hidden w-56 -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-3 text-left shadow-2xl group-hover:block group-focus-visible:block">
              <span className="mb-1 block text-sm font-bold text-gray-900">{hotspot.title}</span>
              <span className="block text-xs leading-relaxed text-gray-500">{hotspot.text}</span>
            </span>
          </button>
        ))}
      </model-viewer>
      {loadError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#d1d1d1] px-4 text-center">
          <div className="max-w-sm rounded-xl bg-white p-4 text-sm font-medium text-gray-700 shadow-xl">
            {loadError}
          </div>
        </div>
      )}
    </div>
  )
})

export default ModelViewerDevScene
