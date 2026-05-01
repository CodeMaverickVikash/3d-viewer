import { useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { ToolbarPosition, ViewerAPI } from '../types'

const Icons = {
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <polygon points="6,4 20,12 6,20" />
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <rect x="5" y="4" width="4" height="16" rx="1"/>
      <rect x="15" y="4" width="4" height="16" rx="1"/>
    </svg>
  ),
  Reset: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8"/>
      <polyline points="3 3 3 8 8 8"/>
    </svg>
  ),
  Fullscreen: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
      <polyline points="15 3 21 3 21 9"/>
      <polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
      <line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  ),
  ZoomIn: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  ZoomOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  RotateCW: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 6.36 2.64L21 9"/>
      <polyline points="21 3 21 9 15 9"/>
    </svg>
  ),
  RotateCCW: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 9"/>
      <polyline points="3 3 3 9 9 9"/>
    </svg>
  ),
  RotateUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" strokeDasharray="4 2"/>
      <polyline points="8 10 12 6 16 10"/>
      <line x1="12" y1="6" x2="12" y2="14"/>
    </svg>
  ),
  RotateDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z" strokeDasharray="4 2"/>
      <polyline points="8 14 12 18 16 14"/>
      <line x1="12" y1="18" x2="12" y2="10"/>
    </svg>
  ),
  PosRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
      <rect x="14" y="3" width="7" height="18" rx="2"/>
      <path d="M3 8h7M3 12h7M3 16h7" strokeOpacity="0.5"/>
    </svg>
  ),
  PosLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="18" rx="2"/>
      <path d="M14 8h7M14 12h7M14 16h7" strokeOpacity="0.5"/>
    </svg>
  ),
  PosTop: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
      <rect x="3" y="3" width="18" height="7" rx="2"/>
      <path d="M8 14v7M12 14v7M16 14v7" strokeOpacity="0.5"/>
    </svg>
  ),
}

type ToolBtnProps = {
  icon: React.ReactNode
  title: string
  onClick: () => void
  active?: boolean
}

function ToolBtn({ icon, title, onClick, active }: ToolBtnProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`
        w-9 h-9 flex items-center justify-center rounded-lg text-sm
        transition-all duration-150 select-none
        ${active
          ? 'bg-blue-500 text-white shadow-md'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'}
      `}
    >
      {icon}
    </button>
  )
}

type DividerProps = {
  position: ToolbarPosition
}

function Divider({ position }: DividerProps) {
  return position === 'top'
    ? <div className="w-px h-5 bg-white/15 mx-0.5" />
    : <div className="h-px w-5 bg-white/15 my-0.5" />
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
    ? 'flex flex-row items-center gap-0.5 px-3 py-2 bg-[#2d3748]/95 backdrop-blur-sm rounded-xl shadow-xl z-10 self-center'
    : position === 'left'
    ? 'flex flex-col items-center gap-0.5 px-2 py-3 bg-[#2d3748]/95 backdrop-blur-sm rounded-r-xl shadow-xl z-10 self-center'
    : 'flex flex-col items-center gap-0.5 px-2 py-3 bg-[#2d3748]/95 backdrop-blur-sm rounded-l-xl shadow-xl z-10 self-center'

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
          ? 'flex justify-center w-full bg-transparent pt-3 z-10'
          : 'flex items-center z-10'
      }
    >
      <div className={wrapClass} ref={containerRef}>
        <ToolBtn
          icon={autoRotate ? <Icons.Pause /> : <Icons.Play />}
          title={autoRotate ? 'Pause rotation' : 'Auto rotate'}
          onClick={onToggleAutoRotate}
          active={autoRotate}
        />

        <ToolBtn
          icon={<Icons.Reset />}
          title="Reset camera"
          onClick={() => viewerAPI.current.reset?.()}
        />

        <ToolBtn
          icon={<Icons.Fullscreen />}
          title="Fullscreen"
          onClick={toggleFullscreen}
        />

        <Divider position={position} />

        <ToolBtn
          icon={<Icons.ZoomIn />}
          title="Zoom in"
          onClick={() => viewerAPI.current.zoomIn?.()}
        />
        <ToolBtn
          icon={<Icons.ZoomOut />}
          title="Zoom out"
          onClick={() => viewerAPI.current.zoomOut?.()}
        />

        <Divider position={position} />

        <ToolBtn
          icon={<Icons.RotateCCW />}
          title="Orbit left"
          onClick={() => viewerAPI.current.orbitLeft?.()}
        />
        <ToolBtn
          icon={<Icons.RotateCW />}
          title="Orbit right"
          onClick={() => viewerAPI.current.orbitRight?.()}
        />
        <ToolBtn
          icon={<Icons.RotateUp />}
          title="Orbit up"
          onClick={() => viewerAPI.current.orbitUp?.()}
        />
        <ToolBtn
          icon={<Icons.RotateDown />}
          title="Orbit down"
          onClick={() => viewerAPI.current.orbitDown?.()}
        />

        <Divider position={position} />

        <ToolBtn
          icon={<Icons.PosRight />}
          title="Toolbar: Right"
          onClick={() => onPositionChange('right')}
          active={position === 'right'}
        />
        <ToolBtn
          icon={<Icons.PosLeft />}
          title="Toolbar: Left"
          onClick={() => onPositionChange('left')}
          active={position === 'left'}
        />
        <ToolBtn
          icon={<Icons.PosTop />}
          title="Toolbar: Top"
          onClick={() => onPositionChange('top')}
          active={position === 'top'}
        />
      </div>
    </div>
  )
}
