import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { ViewerAPI } from '../types'

type CameraControllerProps = {
  viewerAPI: MutableRefObject<ViewerAPI>
  autoRotate: boolean
}

export default function CameraController({ viewerAPI, autoRotate }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const { camera } = useThree()

  // Orbit helper: rotate camera around target by delta angles
  const orbit = (deltaTheta: number, deltaPhi: number) => {
    const controls = controlsRef.current
    if (!controls) return
    const offset = camera.position.clone().sub(controls.target)
    const spherical = new THREE.Spherical().setFromVector3(offset)
    spherical.theta += deltaTheta
    spherical.phi += deltaPhi
    spherical.phi = Math.max(0.05, Math.min(Math.PI - 0.05, spherical.phi))
    offset.setFromSpherical(spherical)
    camera.position.copy(controls.target).add(offset)
    camera.lookAt(controls.target)
    controls.update()
  }

  // Populate shared API ref so Toolbar can call these
  useEffect(() => {
    viewerAPI.current = {
      reset: () => {
        controlsRef.current?.reset()
      },
      zoomIn: () => {
        camera.position.multiplyScalar(0.85)
        controlsRef.current?.update()
      },
      zoomOut: () => {
        camera.position.multiplyScalar(1.15)
        controlsRef.current?.update()
      },
      orbitLeft:  () => orbit(-0.2, 0),
      orbitRight: () => orbit(0.2, 0),
      orbitUp:    () => orbit(0, -0.2),
      orbitDown:  () => orbit(0, 0.2),
    }
  }, [camera, viewerAPI])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      autoRotate={autoRotate}
      autoRotateSpeed={2}
      minDistance={1}
      maxDistance={8}
      makeDefault
    />
  )
}
