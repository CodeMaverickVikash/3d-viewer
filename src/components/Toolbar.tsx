import { useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { ToolbarPosition, ViewerAPI } from '../types'

const ICON = {
  play: 'Play',
  pause: 'Pause',
  reset: 'Reset',
  fullscreen: 'Full',
  zoomIn: '+',
  zoomOut: '-',
  rotateLeft: '<',
  rotateRight: '>',
  rotateUp: '^',
  rotateDown: 'v',
}

type ToolBtnProps = {
  label: string
  title: string
  onClick: () => void
  active?: boolean
}

function ToolBtn({ label, title, onClick, active }: ToolBtnProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`
        w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold
        transition-colors duration-150 select-none
        ${active
          ? 'bg-blue-500 text-white'
          : 'bg-[#2d3748] text-gray-200 hover:bg-[#4a5568]'}
      `}
    >
      {label}
    </button>
  )
}

type DividerProps = {
  position: ToolbarPosition
}

function Divider({ position }: DividerProps) {
  return position === 'top'
    ? <div className="w-px h-6 bg-gray-600 mx-1" />
    : <div className="h-px w-6 bg-gray-600 my-1" />
}

type ToolbarProps = {
  position: ToolbarPosition
  onPositionChange: (position: ToolbarPosition) => void
  autoRotate: boolean
  onToggleAutoRotate: () => void
  viewerAPI: MutableRefObject<ViewerAPI>
}

export default function Toolbar({
  position,
  onPositionChange,
  autoRotate,
  onToggleAutoRotate,
  viewerAPI,
}: ToolbarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const isTop = position === 'top'
  const wrapClass = isTop
    ? 'flex flex-row items-center gap-1 p-2 bg-[#2d3748] rounded-b-lg z-10 self-center'
    : 'flex flex-col items-center gap-1 p-2 bg-[#2d3748] rounded-l-lg z-10 self-center'

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div
      className={
        isTop
          ? 'flex justify-center w-full bg-transparent pt-2 z-10'
          : 'flex items-center'
      }
    >
      <div className={wrapClass} ref={containerRef}>
        <ToolBtn
          label={autoRotate ? ICON.pause : ICON.play}
          title={autoRotate ? 'Pause rotation' : 'Auto rotate'}
          onClick={onToggleAutoRotate}
          active={autoRotate}
        />

        <ToolBtn
          label={ICON.reset}
          title="Reset camera"
          onClick={() => viewerAPI.current.reset?.()}
        />

        <ToolBtn
          label={ICON.fullscreen}
          title="Fullscreen"
          onClick={toggleFullscreen}
        />

        <Divider position={position} />

        <ToolBtn
          label={ICON.zoomIn}
          title="Zoom in"
          onClick={() => viewerAPI.current.zoomIn?.()}
        />
        <ToolBtn
          label={ICON.zoomOut}
          title="Zoom out"
          onClick={() => viewerAPI.current.zoomOut?.()}
        />

        <Divider position={position} />

        <ToolBtn
          label={ICON.rotateLeft}
          title="Orbit left"
          onClick={() => viewerAPI.current.orbitLeft?.()}
        />
        <ToolBtn
          label={ICON.rotateRight}
          title="Orbit right"
          onClick={() => viewerAPI.current.orbitRight?.()}
        />
        <ToolBtn
          label={ICON.rotateUp}
          title="Orbit up"
          onClick={() => viewerAPI.current.orbitUp?.()}
        />
        <ToolBtn
          label={ICON.rotateDown}
          title="Orbit down"
          onClick={() => viewerAPI.current.orbitDown?.()}
        />

        <Divider position={position} />

        <ToolBtn
          label="R"
          title="Toolbar: Right"
          onClick={() => onPositionChange('right')}
          active={position === 'right'}
        />
        <ToolBtn
          label="L"
          title="Toolbar: Left"
          onClick={() => onPositionChange('left')}
          active={position === 'left'}
        />
        <ToolBtn
          label="T"
          title="Toolbar: Top"
          onClick={() => onPositionChange('top')}
          active={position === 'top'}
        />
      </div>
    </div>
  )
}
