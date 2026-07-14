import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { QualityProfile } from './quality';
import { NeuralParticleField } from './particles/NeuralParticleField';

function Scene({
  particles,
  onContextLost,
}: {
  particles: number;
  onContextLost: () => void;
}) {
  const { gl } = useThree();
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    gl.domElement.addEventListener('webglcontextlost', handleContextLost);
    return () =>
      gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
  }, [gl, onContextLost]);
  return <NeuralParticleField count={particles} />;
}

export function ParticleScene({
  quality,
  onContextLost,
}: {
  quality: QualityProfile;
  onContextLost: () => void;
}) {
  return (
    <Canvas
      data-testid="particle-canvas"
      aria-hidden="true"
      className="experience-canvas"
      dpr={quality.dpr}
      camera={{ position: [0, 0, 10], fov: 42 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <Scene particles={quality.particles} onContextLost={onContextLost} />
    </Canvas>
  );
}
