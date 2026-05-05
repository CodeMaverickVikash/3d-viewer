import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MutableRefObject } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Toolbar from './Toolbar'
import type { ViewerAPI } from '../types'

describe('Toolbar', () => {
  it('calls viewer API actions from toolbar buttons', async () => {
    const user = userEvent.setup()
    const reset = vi.fn()
    const zoomIn = vi.fn()
    const zoomOut = vi.fn()
    const orbitLeft = vi.fn()
    const orbitRight = vi.fn()
    const orbitUp = vi.fn()
    const orbitDown = vi.fn()
    const viewerAPI: MutableRefObject<ViewerAPI> = {
      current: { reset, zoomIn, zoomOut, orbitLeft, orbitRight, orbitUp, orbitDown },
    }

    render(
      <Toolbar
        position="right"
        onPositionChange={vi.fn()}
        onToggleAutoRotate={vi.fn()}
        viewerAPI={viewerAPI}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Reset camera' }))
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    await user.click(screen.getByRole('button', { name: 'Zoom out' }))
    await user.click(screen.getByRole('button', { name: 'More options' }))
    await user.click(screen.getByRole('button', { name: 'Orbit left' }))
    await user.click(screen.getByRole('button', { name: 'Orbit right' }))
    await user.click(screen.getByRole('button', { name: 'Orbit up' }))
    await user.click(screen.getByRole('button', { name: 'Orbit down' }))

    expect(reset).toHaveBeenCalledTimes(1)
    expect(zoomIn).toHaveBeenCalledTimes(1)
    expect(zoomOut).toHaveBeenCalledTimes(1)
    expect(orbitLeft).toHaveBeenCalledTimes(1)
    expect(orbitRight).toHaveBeenCalledTimes(1)
    expect(orbitUp).toHaveBeenCalledTimes(1)
    expect(orbitDown).toHaveBeenCalledTimes(1)
  })

  it('toggles auto rotation and lets consumers change toolbar position', async () => {
    const user = userEvent.setup()
    const viewerAPI: MutableRefObject<ViewerAPI> = { current: {} }
    const onToggleAutoRotate = vi.fn()
    const onPositionChange = vi.fn()

    render(
      <Toolbar
        position="right"
        onPositionChange={onPositionChange}
        onToggleAutoRotate={onToggleAutoRotate}
        viewerAPI={viewerAPI}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Auto rotate' }))
    expect(onToggleAutoRotate).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Pause rotation' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'More options' }))
    await user.click(screen.getByRole('button', { name: 'Toolbar: Left' }))
    await user.click(screen.getByRole('button', { name: 'More options' }))
    await user.click(screen.getByRole('button', { name: 'Toolbar: Top' }))

    expect(onPositionChange).toHaveBeenNthCalledWith(1, 'left')
    expect(onPositionChange).toHaveBeenNthCalledWith(2, 'top')
  })
})
