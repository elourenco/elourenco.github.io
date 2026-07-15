import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, ShaderMaterial } from 'three';
import { buildParticleLayout } from './particle-layout';
import {
  particleFragmentShader,
  particleVertexShader,
} from './particle-shaders';

export function NeuralParticleField({ count }: { count: number }) {
  const layout = useMemo(() => buildParticleLayout(count), [count]);
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => {
    if (materialRef.current)
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[layout.positions, 3]}
        />
        <bufferAttribute attach="attributes-phase" args={[layout.phases, 1]} />
        <bufferAttribute
          attach="attributes-pointSize"
          args={[layout.sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
