import type { Meta, StoryObj } from '@storybook/react-vite'
import ModelViewerLayout from './ModelViewerLayout'
import type { HotspotData } from '../types'

const demoHotspots: HotspotData[] = [
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

const meta = {
  title: 'Model Viewer/ModelViewerLayout',
  component: ModelViewerLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    hotspots: demoHotspots,
    modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
  },
} satisfies Meta<typeof ModelViewerLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ModelViewerDev: Story = {
  args: {
    renderer: 'model-viewer',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    hotspots: [
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
        position: [-0.32, -0.76, 0.26],
        title: 'Base Detail',
        text: 'The same toolbar drives model-viewer camera orbit, zoom, reset, and rotation.',
      },
    ],
  },
}
