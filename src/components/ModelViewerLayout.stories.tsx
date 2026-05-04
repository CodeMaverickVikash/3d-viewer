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
