export type ToolbarPosition = 'right' | 'left' | 'top'

export type HotspotData = {
  id: number
  position: [number, number, number]
  title: string
  text: string
}

export type ViewerAPI = {
  reset?: () => void
  zoomIn?: () => void
  zoomOut?: () => void
  orbitLeft?: () => void
  orbitRight?: () => void
  orbitUp?: () => void
  orbitDown?: () => void
}
