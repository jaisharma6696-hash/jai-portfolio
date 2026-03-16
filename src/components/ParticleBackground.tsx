"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StarField(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>();
  
  // Generate 8000 random points inside a sphere of radius 2.5
  const sphere = useMemo(() => {
    const float32Array = new Float32Array(8000 * 3);
    random.inSphere(float32Array, { radius: 2.5 });
    return float32Array;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Warp speed forward motion
      ref.current.position.z += delta * 0.15;
      
      // Gentle rotation for dynamic spatial feel
      ref.current.rotation.z += delta * 0.02;
      
      // Loop particles endlessly once they pass camera plane
      if (ref.current.position.z > 2) {
        ref.current.position.z = -1;
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <StarField />
      </Canvas>
    </div>
  );
}
