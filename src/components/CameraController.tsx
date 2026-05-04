import { useCallback, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { ViewerAPI } from '../types'

type CameraControllerProps = {
  viewerAPIRef: MutableRefObject<ViewerAPI>
  autoRotate: boolean
}

type CameraAnimation = {
  fromPosition: THREE.Vector3
  toPosition: THREE.Vector3
  fromTarget: THREE.Vector3
  toTarget: THREE.Vector3
  elapsed: number
  duration: number
}

const CAMERA_ANIMATION_DURATION = 0.45
const ORBIT_STEP = 0.35
const ZOOM_FACTOR = 0.82
const MIN_POLAR_ANGLE = 0.05
const MAX_POLAR_ANGLE = Math.PI - 0.05

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export default function CameraController({ viewerAPIRef, autoRotate }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const animationRef = useRef<CameraAnimation | null>(null)
  const { camera } = useThree()

  const animateCamera = useCallback(
    (toPosition: THREE.Vector3, toTarget?: THREE.Vector3) => {
      const controls = controlsRef.current
      const target = toTarget ?? controls?.target ?? new THREE.Vector3()

      animationRef.current = {
        fromPosition: camera.position.clone(),
        toPosition: toPosition.clone(),
        fromTarget: controls?.target.clone() ?? new THREE.Vector3(),
        toTarget: target.clone(),
        elapsed: 0,
        duration: CAMERA_ANIMATION_DURATION,
      }
    },
    [camera],
  )

  useFrame((_, delta) => {
    const animation = animationRef.current
    const controls = controlsRef.current

    if (!animation || !controls) return

    animation.elapsed += delta
    const progress = Math.min(animation.elapsed / animation.duration, 1)
    const eased = easeOutCubic(progress)

    camera.position.lerpVectors(animation.fromPosition, animation.toPosition, eased)
    controls.target.lerpVectors(animation.fromTarget, animation.toTarget, eased)
    camera.lookAt(controls.target)
    controls.update()

    if (progress >= 1) {
      camera.position.copy(animation.toPosition)
      controls.target.copy(animation.toTarget)
      camera.lookAt(controls.target)
      controls.update()
      animationRef.current = null
    }
  })

  const orbit = useCallback((deltaTheta: number, deltaPhi: number) => {
    const controls = controlsRef.current
    if (!controls) return

    const offset = camera.position.clone().sub(controls.target)
    const spherical = new THREE.Spherical().setFromVector3(offset)
    spherical.theta += deltaTheta
    spherical.phi += deltaPhi
    spherical.phi = THREE.MathUtils.clamp(spherical.phi, MIN_POLAR_ANGLE, MAX_POLAR_ANGLE)
    offset.setFromSpherical(spherical)
    animateCamera(controls.target.clone().add(offset))
  }, [animateCamera, camera])

  const zoom = useCallback((factor: number) => {
    const controls = controlsRef.current
    if (!controls) return

    const offset = camera.position.clone().sub(controls.target)
    offset.multiplyScalar(factor)
    const distance = THREE.MathUtils.clamp(offset.length(), controls.minDistance, controls.maxDistance)
    offset.setLength(distance)
    animateCamera(controls.target.clone().add(offset))
  }, [animateCamera, camera])

  // Populate shared API ref so Toolbar can call these
  useEffect(() => {
    viewerAPIRef.current = {
      reset: () => {
        const controls = controlsRef.current
        if (!controls) return

        animateCamera(
          new THREE.Vector3().fromArray(controls.position0.toArray()),
          controls.target0.clone(),
        )
      },
      zoomIn: () => zoom(ZOOM_FACTOR),
      zoomOut: () => zoom(1 / ZOOM_FACTOR),
      orbitLeft:  () => orbit(-ORBIT_STEP, 0),
      orbitRight: () => orbit(ORBIT_STEP, 0),
      orbitUp:    () => orbit(0, -ORBIT_STEP),
      orbitDown:  () => orbit(0, ORBIT_STEP),
    }
  }, [animateCamera, orbit, viewerAPIRef, zoom])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      autoRotate={autoRotate}
      autoRotateSpeed={2} // auto rotate left to right
      // autoRotateSpeed={-2} // auto rotate right to left
      minDistance={1}
      maxDistance={8}
      makeDefault
    />
  )
}
