import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import MatrixPanel from './components/MatrixPanel'

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <MatrixPanel />
      <Canvas style={{ marginLeft: '220px', width: 'calc(100vw - 220px)', height: '100vh' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="royalblue" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  )
}