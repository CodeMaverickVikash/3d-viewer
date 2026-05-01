import { Html } from '@react-three/drei'
import type { MouseEvent } from 'react'
import type { HotspotData } from '../types'

type HotspotProps = {
  hotspot: HotspotData
  isActive: boolean
  onClick: () => void
}

export default function Hotspot({ hotspot, isActive, onClick }: HotspotProps) {
  const { id, position, title, text } = hotspot

  return (
    <Html position={position} zIndexRange={[100, 0]} occlude>
      <div className="relative flex flex-col items-center" style={{ transform: 'translate(-50%, -50%)' }}>
        <button
          onClick={onClick}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center
            text-white text-sm font-bold border-2 border-white
            shadow-lg cursor-pointer z-10 transition-all duration-200
            ${isActive ? 'bg-blue-500 scale-110' : 'bg-[#2d3748] hover:bg-blue-500'}
          `}
        >
          {id}
        </button>

        {isActive && (
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20
                        bg-[#2d3748] text-white rounded-xl shadow-2xl p-4 w-52
                        border border-gray-600"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0
                            border-l-8 border-r-8 border-t-8
                            border-l-transparent border-r-transparent border-t-[#2d3748]" />

            <button
              onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onClick() }}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xs"
            >
              x
            </button>

            <p className="font-bold text-sm mb-1">{title}</p>
            <p className="text-gray-300 text-xs leading-relaxed">{text}</p>
          </div>
        )}
      </div>
    </Html>
  )
}
