import { Html } from '@react-three/drei'
import { useState } from 'react'
import type { HotspotData } from '../types'

type HotspotProps = {
  hotspot: HotspotData
}

export default function Hotspot({ hotspot }: HotspotProps) {
  const { id, position, title, text } = hotspot
  const [hovered, setHovered] = useState(false)

  return (
    <Html position={position} zIndexRange={[100, 0]} occlude>
      <div className="relative flex flex-col items-center" style={{ transform: 'translate(-50%, -50%)' }}>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center
            text-white text-sm font-bold border-2 border-white
            shadow-lg cursor-pointer z-10 transition-all duration-200
            ${hovered ? 'bg-blue-500 scale-110' : 'bg-[#2d3748] hover:bg-blue-500'}
          `}
        >
          {id}
        </button>

        {hovered && (
          <div
            className="absolute bottom-11 left-1/2 -translate-x-1/2 z-20
                        bg-white text-gray-800 rounded-2xl shadow-2xl w-56
                        border border-gray-100"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Triangle pointer at top */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0
                            border-l-[10px] border-r-[10px] border-t-[12px]
                            border-l-transparent border-r-transparent border-t-white
                            drop-shadow-sm" />

            {/* Audio + close row */}
            <div className="flex items-center justify-between px-3 pt-3 pb-1">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-lg
                           border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              </button>
              <button
                onMouseDown={() => setHovered(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full
                           text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="px-3 pb-3">
              <p className="font-bold text-sm text-gray-900 mb-0.5">{title}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{text}</p>
            </div>
          </div>
        )}
      </div>
    </Html>
  )
}
