import { useProgress } from '@react-three/drei'

export default function Loader() {
  const { active, progress } = useProgress()

  if (!active) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#d1d1d1]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-white/70 text-sm font-medium tracking-wide">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}