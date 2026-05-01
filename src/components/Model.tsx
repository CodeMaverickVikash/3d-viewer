import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

type ModelProps = {
  url: string
}

export default function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    // Preload cleanup
    return () => useGLTF.clear(url)
  }, [url])

  return <primitive object={scene} scale={1} dispose={null} />
}
