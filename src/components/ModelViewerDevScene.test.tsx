import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { MutableRefObject } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ModelViewerDevScene from './ModelViewerDevScene'
import type { ViewerAPI } from '../types'

vi.mock('@google/model-viewer/dist/model-viewer.min.js', () => ({}))

const mockOrbit = {
  theta: 0,
  phi: 1,
  radius: 3,
  toString: () => '0rad 1rad 3m',
}

customElements.define(
  'model-viewer',
  class extends HTMLElement {
    autoRotate = false
    cameraOrbit = ''
    cameraTarget = ''
    fieldOfView = ''
    loaded = false
    resetTurntableRotation = vi.fn()
    getCameraOrbit = vi.fn(() => mockOrbit)
  },
)

const hotspots = [
  {
    id: 1,
    position: [0, 1.1, 0.28] as [number, number, number],
    title: 'Viewer Head',
    text: 'A local glTF asset rendered by model-viewer.',
  },
]

function renderScene() {
  const viewerAPI: MutableRefObject<ViewerAPI> = { current: {} }
  const view = render(
    <ModelViewerDevScene
      modelUrl="/models/modelviewer-demo.gltf"
      hotspots={hotspots}
      viewerAPI={viewerAPI}
    />,
  )
  const viewer = view.container.querySelector('model-viewer') as unknown as HTMLElement & {
    autoRotate: boolean
    cameraOrbit: string
    cameraTarget: string
    fieldOfView: string
    resetTurntableRotation: ReturnType<typeof vi.fn>
    getCameraOrbit: ReturnType<typeof vi.fn>
  }

  return { ...view, viewerAPI, viewer }
}

describe('ModelViewerDevScene', () => {
  beforeEach(() => {
    document.elementFromPoint = vi.fn()
  })

  it('wires toolbar API actions to the model-viewer camera', async () => {
    const { viewerAPI, viewer } = renderScene()

    await waitFor(() => expect(viewerAPI.current.reset).toBeTypeOf('function'))

    viewerAPI.current.orbitRight?.()
    expect(viewer.cameraOrbit).toBe('0.35rad 1rad 3m')

    viewerAPI.current.orbitUp?.()
    expect(viewer.cameraOrbit).toBe('0rad 0.65rad 3m')

    viewerAPI.current.zoomIn?.()
    expect(viewer.cameraOrbit).toBe('0rad 1rad 2.46m')

    viewerAPI.current.toggleAutoRotate?.()
    expect(viewer.autoRotate).toBe(true)

    viewerAPI.current.reset?.()
    expect(viewer.cameraOrbit).toBe('0deg 75deg auto')
    expect(viewer.cameraTarget).toBe('auto')
    expect(viewer.fieldOfView).toBe('auto')
    expect(viewer.resetTurntableRotation).toHaveBeenCalledTimes(1)
  })

  it('updates loader progress and hides it after model load', () => {
    const { viewer } = renderScene()

    expect(screen.getByText('0%')).toBeInTheDocument()

    fireEvent(viewer, new CustomEvent('progress', { detail: { totalProgress: 0.42 } }))
    expect(screen.getByText('42%')).toBeInTheDocument()

    fireEvent.load(viewer)
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
  })

  it('shows and closes model-viewer hotspot content', () => {
    renderScene()

    const trigger = screen.getByRole('button', { name: 'Show Viewer Head' })
    expect(screen.queryByText('A local glTF asset rendered by model-viewer.')).not.toBeInTheDocument()

    fireEvent.mouseEnter(trigger)
    expect(screen.getByText('Viewer Head')).toBeInTheDocument()
    expect(screen.getByText('A local glTF asset rendered by model-viewer.')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Close Viewer Head' }))
    expect(screen.queryByText('A local glTF asset rendered by model-viewer.')).not.toBeInTheDocument()
  })
})
