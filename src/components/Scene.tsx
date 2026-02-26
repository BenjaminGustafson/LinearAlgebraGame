import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface SceneProps {
  combinedMatrix: THREE.Matrix4
}

export default function Scene({ combinedMatrix }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!meshRef.current) return
    meshRef.current.matrixAutoUpdate = false
    meshRef.current.matrix.copy(combinedMatrix)
  }, [combinedMatrix])

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  )
}
