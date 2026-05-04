import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Toolbar from './Toolbar'
import type { ToolbarPosition, ViewerAPI } from '../types'

const meta = {
  title: 'Model Viewer/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>

export default meta

type Story = StoryObj<typeof meta>

const toolbarArgs = {
  position: 'right' as ToolbarPosition,
  onPositionChange: () => undefined,
  onToggleAutoRotate: () => undefined,
  viewerAPI: { current: {} },
}

function ToolbarDemo({ initialPosition = 'right' }: { initialPosition?: ToolbarPosition }) {
  const [position, setPosition] = useState<ToolbarPosition>(initialPosition)
  const viewerAPI = useRef<ViewerAPI>({
    reset: () => console.info('reset'),
    zoomIn: () => console.info('zoom in'),
    zoomOut: () => console.info('zoom out'),
    orbitLeft: () => console.info('orbit left'),
    orbitRight: () => console.info('orbit right'),
    orbitUp: () => console.info('orbit up'),
    orbitDown: () => console.info('orbit down'),
    toggleAutoRotate: () => console.info('toggle auto rotate'),
  })

  return (
    <Toolbar
      position={position}
      onPositionChange={setPosition}
      onToggleAutoRotate={() => viewerAPI.current.toggleAutoRotate?.()}
      viewerAPI={viewerAPI}
    />
  )
}

export const Right: Story = {
  args: toolbarArgs,
  render: () => <ToolbarDemo initialPosition="right" />,
}

export const Left: Story = {
  args: toolbarArgs,
  render: () => <ToolbarDemo initialPosition="left" />,
}

export const Top: Story = {
  args: toolbarArgs,
  render: () => <ToolbarDemo initialPosition="top" />,
}
