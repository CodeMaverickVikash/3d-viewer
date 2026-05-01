import ModelViewerLayout from "./components/ModelViewerLayout"
import type { HotspotData } from "./types"

const HOTSPOTS: HotspotData[] = [
  {
    id: 1,
    position: [0.9, 0.28, 0.1],
    title: 'North Pole',
    text: 'The north pole attracts nearby iron filings strongly.',
  },
  {
    id: 2,
    position: [0.9, -0.28, 0.1],
    title: 'South Pole',
    text: 'Opposite polarity to the north pole.',
  },
]

export default function App() {
  return (
    <ModelViewerLayout
      hotspots={HOTSPOTS}
      modelUrl="https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf"
    />
  )
}
