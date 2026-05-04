import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Hotspot from './Hotspot'

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const hotspot = {
  id: 7,
  position: [0, 0, 0] as [number, number, number],
  title: 'Test Point',
  text: 'Reusable tooltip copy.',
}

describe('Hotspot', () => {
  it('shows and hides hotspot content on hover', () => {
    render(<Hotspot hotspot={hotspot} />)

    const trigger = screen.getByRole('button', { name: 'Show Test Point' })
    expect(screen.queryByText('Reusable tooltip copy.')).not.toBeInTheDocument()

    fireEvent.mouseEnter(trigger)
    expect(screen.getByText('Test Point')).toBeInTheDocument()
    expect(screen.getByText('Reusable tooltip copy.')).toBeInTheDocument()

    fireEvent.mouseLeave(trigger)
    expect(screen.queryByText('Reusable tooltip copy.')).not.toBeInTheDocument()
  })
})
