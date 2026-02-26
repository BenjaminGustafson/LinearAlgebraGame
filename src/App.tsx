import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import MatrixPanel from './components/MatrixPanel'
import MatrixStack from './components/MatrixStack'
import Scene from './components/Scene'

export type Matrix3x3 = [
  number, number, number,
  number, number, number,
  number, number, number,
]

export interface MatrixEntry {
  label: string
  values: Matrix3x3
}

function combineMatrices(matrices: MatrixEntry[]): THREE.Matrix4 {
  const result = new THREE.Matrix4()
  for (const entry of matrices) {
    const v = entry.values
    // Embed 3x3 into 4x4 (column-major for Three.js)
    const m4 = new THREE.Matrix4().set(
      v[0], v[1], v[2], 0,
      v[3], v[4], v[5], 0,
      v[6], v[7], v[8], 0,
      0,    0,    0,    1,
    )
    result.premultiply(m4)
  }
  return result
}

export default function App() {
  const [stack, setStack] = useState<MatrixEntry[]>([])

  const handleAdd = (values: Matrix3x3) => {
    const label = `M${stack.length + 1}`
    setStack(prev => [...prev, { label, values }])
  }

  const handleUndo = () => setStack(prev => prev.slice(0, -1))
  const handleReset = () => setStack([])

  const combinedMatrix = combineMatrices(stack)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#0a0a0d' }}>
      <MatrixPanel onAdd={handleAdd} />
      <MatrixStack stack={stack} onUndo={handleUndo} onReset={handleReset} />
      <Canvas
        style={{
          marginLeft: '220px',
          marginTop: '90px',
          width: 'calc(100vw - 220px)',
          height: 'calc(100vh - 90px)',
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Scene combinedMatrix={combinedMatrix} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
