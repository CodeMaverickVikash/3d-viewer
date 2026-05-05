import '@google/model-viewer/dist/model-viewer.min.js'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
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
const ORBIT_STEP = 0.35
const ZOOM_FACTOR = 0.82
const MIN_RADIUS = 0.5
const MAX_RADIUS = 8
const MIN_PHI = 0.05
const MAX_PHI = Math.PI - 0.05

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
}

function ModelViewerHotspot({ hotspot }: { hotspot: HotspotData }) {
  const { id, position, title, text } = hotspot
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const visible = hovered || pinned

  return (
    <div
      slot={`hotspot-${id}`}
      data-position={`${position[0]}m ${position[1]}m ${position[2]}m`}
      data-normal="0m 1m 0m"
      className="relative flex flex-col items-center"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        aria-label={`Show ${title}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setPinned(v => !v)}
        className={`z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg transition-all duration-200 ${
          visible ? 'scale-110 bg-blue-500' : 'bg-[#2d3748] hover:bg-blue-500'
        }`}
      >
        {id}
      </button>

      {visible && (
        <div
          className="absolute bottom-11 left-1/2 z-20 w-48 -translate-x-1/2 rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-2xl sm:w-56"
          style={{ pointerEvents: 'auto', maxWidth: 'min(14rem, calc(100vw - 2rem))' }}
        >
          <div className="absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />

          <div className="flex items-center justify-between px-3 pb-1 pt-3">
            <button
              type="button"
              aria-label={`Play ${title} audio`}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              onClick={(event) => event.stopPropagation()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={`Close ${title}`}
              onMouseDown={(event) => {
                event.stopPropagation()
                setPinned(false)
                setHovered(false)
                const { clientX, clientY } = event
                setTimeout(() => {
                  const el = document.elementFromPoint(clientX, clientY)
                  el?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false, cancelable: true }))
                }, 0)
              }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              x
            </button>
          </div>

          <div className="px-3 pb-3 text-left">
            <p className="mb-0.5 text-sm font-bold text-gray-900">{title}</p>
            <p className="text-xs leading-relaxed text-gray-400">{text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const ModelViewerDevScene = memo(function ModelViewerDevScene({
  modelUrl,
  hotspots,
  viewerAPI: viewerAPIRef,
}: ModelViewerDevSceneProps) {
  const modelViewerRef = useRef<ModelViewerElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)

  const orbit = useCallback((deltaTheta: number, deltaPhi: number) => {
    setOrbit(modelViewerRef.current, ({ theta, phi, radius }) => ({
      theta: theta + deltaTheta,
      phi: Math.min(MAX_PHI, Math.max(MIN_PHI, phi + deltaPhi)),
      radius,
    }))
  }, [])

  const zoom = useCallback((factor: number) => {
    setOrbit(modelViewerRef.current, ({ theta, phi, radius }) => ({
      theta,
      phi,
      radius: Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, radius * factor)),
    }))
  }, [])

  useEffect(() => {
    const viewer = modelViewerRef.current
    if (!viewer) return

    viewerAPIRef.current = {
      reset: () => {
        viewer.cameraOrbit = DEFAULT_CAMERA_ORBIT
        viewer.cameraTarget = DEFAULT_CAMERA_TARGET
        viewer.fieldOfView = DEFAULT_FIELD_OF_VIEW
        viewer.resetTurntableRotation()
      },
      zoomIn: () => zoom(ZOOM_FACTOR),
      zoomOut: () => zoom(1 / ZOOM_FACTOR),
      orbitLeft: () => orbit(-ORBIT_STEP, 0),
      orbitRight: () => orbit(ORBIT_STEP, 0),
      orbitUp: () => orbit(0, -ORBIT_STEP),
      orbitDown: () => orbit(0, ORBIT_STEP),
      toggleAutoRotate: () => {
        viewer.autoRotate = !viewer.autoRotate
      },
    }

    return () => {
      viewerAPIRef.current = {}
    }
  }, [orbit, viewerAPIRef, zoom])

  useEffect(() => {
    const viewer = modelViewerRef.current
    if (!viewer) return

    const onEnter = () => { viewer.style.cursor = 'grab' }
    const onLeave = () => { viewer.style.cursor = '' }
    const onDown = () => { viewer.style.cursor = 'grabbing' }
    const onUp = () => { viewer.style.cursor = viewer.matches(':hover') ? 'grab' : '' }

    viewer.addEventListener('pointerenter', onEnter)
    viewer.addEventListener('pointerleave', onLeave)
    viewer.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      viewer.removeEventListener('pointerenter', onEnter)
      viewer.removeEventListener('pointerleave', onLeave)
      viewer.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  useEffect(() => {
    const viewer = modelViewerRef.current
    if (!viewer) return

    const handleWheel = (event: WheelEvent) => {
      if (!viewer.contains(event.target as Node) && event.target !== viewer) return
      if (!event.ctrlKey) return
      event.preventDefault()
      const factor = event.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR
      zoom(factor)
    }

    viewer.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewer.removeEventListener('wheel', handleWheel)
  }, [zoom])

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
        disable-zoom={true}
        environment-image="neutral"
        shadow-intensity="0.85"
        shadow-softness="0.8"
        interpolation-decay="120"
        auto-rotate-delay="0"
        interaction-prompt="auto"
        style={{ display: 'block', height: '100%', width: '100%' }}
      >
        {hotspots.map((hotspot) => (
          <ModelViewerHotspot key={hotspot.id} hotspot={hotspot} />
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
