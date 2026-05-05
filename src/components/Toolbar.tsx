import { useRef, useState, useEffect, } from 'react'
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
  Minimize: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
      <polyline points="4 14 10 14 10 20"/>
      <polyline points="20 10 14 10 14 4"/>
      <line x1="10" y1="14" x2="3" y2="21"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
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
  More: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <circle cx="5" cy="12" r="1.5"/>
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="19" cy="12" r="1.5"/>
    </svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
}

type ToolBtnProps = {
  icon: React.ReactNode
  title: string
  onClick: () => void
  active?: boolean
  className?: string
}

function ToolBtn({ icon, title, onClick, active, className = '' }: ToolBtnProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`
        w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center rounded-lg text-sm
        transition-all duration-150 select-none touch-manipulation
        ${active
          ? 'bg-blue-500 text-white shadow-md'
          : 'text-gray-300 hover:bg-white/10 hover:text-white active:bg-white/10 active:text-white'}
        ${className}
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
  return position === 'top' || position === 'bottom'
    ? <div className="flex-shrink-0 w-px h-5 bg-white/15 mx-0.5 sm:mx-1" />
    : <div className="flex-shrink-0 h-px w-5 bg-white/15 my-0.5 sm:my-1" />
}

type ToolbarProps = {
  position: ToolbarPosition
  onPositionChange: (position: ToolbarPosition) => void
  onToggleAutoRotate: () => void
  viewerAPI: MutableRefObject<ViewerAPI>
}

export default function Toolbar({
  position,
  onPositionChange,
  onToggleAutoRotate,
  viewerAPI,
}: ToolbarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const isHorizontal = position === 'top' || position === 'bottom'

  useEffect(() => {
    if (!moreOpen) return
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = (e instanceof TouchEvent ? e.touches[0]?.target : e.target) as Node | null
      if (target && containerRef.current && !containerRef.current.contains(target)) {
        setMoreOpen(false)
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollLeft = 0
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [moreOpen])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const wrapClass = position === 'top'
    ? 'flex flex-row items-stretch bg-[#2d3748]/95 backdrop-blur-sm rounded-b-xl shadow-xl self-center max-w-[min(92vw,420px)] min-w-0'
    : position === 'bottom'
    ? 'flex flex-row items-stretch bg-[#2d3748]/95 backdrop-blur-sm rounded-t-xl shadow-xl self-center max-w-[min(92vw,420px)] min-w-0'
    : position === 'left'
    ? 'flex flex-col items-stretch bg-[#2d3748]/95 backdrop-blur-sm rounded-r-xl shadow-xl self-center max-h-[min(80vh,420px)] min-h-0'
    : 'flex flex-col items-stretch bg-[#2d3748]/95 backdrop-blur-sm rounded-l-xl shadow-xl self-center max-h-[min(80vh,420px)] min-h-0'

  const scrollClass = isHorizontal
    ? 'flex flex-row items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 overflow-x-auto overflow-y-hidden scrollbar-none'
    : 'flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 py-1.5 sm:py-2 overflow-y-auto overflow-x-hidden scrollbar-none'

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

    return (
    <div
      className={
        isHorizontal
          ? 'relative flex justify-center w-full bg-transparent z-50'
          : 'relative flex items-center z-50'
      }
      style={
        position === 'bottom'
          ? { paddingBottom: 'env(safe-area-inset-bottom)' }
          : position === 'top'
          ? { paddingTop: 'env(safe-area-inset-top)' }
          : position === 'left'
          ? { paddingLeft: 'env(safe-area-inset-left)' }
          : { paddingRight: 'env(safe-area-inset-right)' }
      }
    >

      <div className={wrapClass} ref={containerRef}>
        <div
          ref={scrollRef}
          className={scrollClass}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
        {moreOpen ? (
          <>
            <ToolBtn icon={<Icons.Back />} title="Back" onClick={() => { setMoreOpen(false); if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollLeft = 0 }} />
            <Divider position={position} />
            <ToolBtn icon={<Icons.RotateCCW />}  title="Orbit left"  onClick={() => viewerAPI.current.orbitLeft?.()}  />
            <ToolBtn icon={<Icons.RotateCW />}   title="Orbit right" onClick={() => viewerAPI.current.orbitRight?.()} />
            <ToolBtn icon={<Icons.RotateUp />}   title="Orbit up"    onClick={() => viewerAPI.current.orbitUp?.()}    />
            <ToolBtn icon={<Icons.RotateDown />} title="Orbit down"  onClick={() => viewerAPI.current.orbitDown?.()}  />
            <Divider position={position} />
            <ToolBtn icon={<Icons.PosTop />}   title="Toolbar: Top"   onClick={() => { onPositionChange('top');   setMoreOpen(false) }} active={position === 'top'}   />
            <ToolBtn icon={<Icons.PosLeft />}  title="Toolbar: Left"  onClick={() => { onPositionChange('left');  setMoreOpen(false) }} active={position === 'left'}  />
            <ToolBtn icon={<Icons.PosRight />} title="Toolbar: Right" onClick={() => { onPositionChange('right'); setMoreOpen(false) }} active={position === 'right'} />
          </>
        ) : (
          <>
            <ToolBtn
              icon={autoRotate ? <Icons.Pause /> : <Icons.Play />}
              title={autoRotate ? 'Pause rotation' : 'Auto rotate'}
              onClick={() => { setAutoRotate(v => !v); onToggleAutoRotate() }}
              active={autoRotate}
            />
            <ToolBtn icon={<Icons.Reset />}    title="Reset camera"                        onClick={() => viewerAPI.current.reset?.()}  />
            <ToolBtn icon={isFullscreen ? <Icons.Minimize /> : <Icons.Fullscreen />} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={toggleFullscreen} />
            <Divider position={position} />
            <ToolBtn icon={<Icons.ZoomIn />}   title="Zoom in"                             onClick={() => viewerAPI.current.zoomIn?.()}  />
            <ToolBtn icon={<Icons.ZoomOut />}  title="Zoom out"                            onClick={() => viewerAPI.current.zoomOut?.()} />
            <Divider position={position} />
            <ToolBtn icon={<Icons.More />} title="More options" active={moreOpen} onClick={() => { setMoreOpen(true); if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollLeft = 0 }} />
          </>
        )}
        </div>
      </div>
    </div>
  )
}
