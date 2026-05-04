import type { Meta, StoryObj } from '@storybook/react-vite'
import Loader from './Loader'

const meta = {
  title: 'Model Viewer/Loader',
  component: Loader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Loader>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    active: true,
    progress: 64,
  },
}

export const Hidden: Story = {
  args: {
    active: false,
    progress: 100,
  },
}
