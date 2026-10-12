'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Html } from '@react-three/drei'

interface IslandProps {
  name: string
  position: [number, number, number]
  color?: string
  modelPath?: string
}

// Low-poly island tile base with floating label & model fallback
function RegionalIsland({ name, position, color = '#4ade80', modelPath }: IslandProps) {
  return (
    <group position={position}>
      {/* Hexagonal / Cylindrical Island Base */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[2.2, 2, 0.5, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Dirt/Rock Underside */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[2, 1.5, 0.4, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Floating Region Label */}
      <Html position={[0, 2.5, 0]} center distanceFactor={15}>
        <div className="pointer-events-none select-none rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md border border-slate-700/50">
          {name}
        </div>
      </Html>

      {/* Landmark Model or Placeholder Box */}
      <Suspense fallback={
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.8]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      }>
        {modelPath ? (
          <Center top position={[0, 0, 0]}>
            <LandmarkModel url={modelPath} />
          </Center>
        ) : (
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.8, 1.2, 0.8]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        )}
      </Suspense>
    </group>
  )
}

function LandmarkModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.2} />
}

export default function MapPreview() {
  return (
    <div className="h-full w-full bg-[#0b0f1a]">
      <Canvas camera={{ position: [0, 12, 16], fov: 45 }}>
        {/* Environment & Lighting */}
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 18, 10]} intensity={1.5} castShadow />

        {/* Ocean Surface Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Regional Islands Layout */}
        <group position={[0, 0, 0]}>
          {/* London (East) */}
          <RegionalIsland
            name="London"
            position={[4, 0, -1]}
            modelPath="/models/BigBen.glb"
          />

          {/* Uxbridge (North-West) */}
          <RegionalIsland
            name="Uxbridge"
            position={[-3, 0, -4]}
            color="#22c55e"
          />

          {/* Windsor (West) */}
          <RegionalIsland
            name="Windsor"
            position={[-5, 0, 1]}
            color="#16a34a"
          />

          {/* Brighton (South) */}
          <RegionalIsland
            name="Brighton"
            position={[1, 0, 6]}
            color="#38bdf8"
          />
        </group>

        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.25}
          minDistance={8}
          maxDistance={30}
        />
      </Canvas>
    </div>
  )
}