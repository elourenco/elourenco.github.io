import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Object3D, type Group, type InstancedMesh } from 'three';
import type { QualityProfile } from './quality';
import {
  coreGlass,
  restrainedCyan,
  stationCeramic,
  stationMetal,
} from './materials';

interface CosmicStationProps {
  quality: QualityProfile;
  reducedMotion: boolean;
}

function seededCoordinate(index: number, axis: number): number {
  const value = Math.sin(index * 78.233 + axis * 37.719) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * 90;
}

function SparseStars({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const matrices = useMemo(() => {
    const object = new Object3D();
    return Array.from({ length: count }, (_, index) => {
      object.position.set(
        seededCoordinate(index, 0),
        seededCoordinate(index, 1),
        seededCoordinate(index, 2) - 18,
      );
      const scale = 0.025 + (index % 5) * 0.009;
      object.scale.setScalar(scale);
      object.updateMatrix();
      return object.matrix.clone();
    });
  }, [count]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    matrices.forEach((matrix, index) =>
      mesh.current?.setMatrixAt(index, matrix),
    );
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  if (count === 0) return null;

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#bfdce1" toneMapped={false} />
    </instancedMesh>
  );
}

function AntennaModule({
  position,
  rotation = 0,
  shadows,
}: {
  position: [number, number, number];
  rotation?: number;
  shadows: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow={shadows} receiveShadow={shadows}>
        <boxGeometry args={[1.35, 0.52, 1]} />
        <meshStandardMaterial {...stationMetal} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.08, 0.14, 0.75, 12]} />
        <meshStandardMaterial {...stationCeramic} />
      </mesh>
    </group>
  );
}

function ParabolicDish({ shadows }: { shadows: boolean }) {
  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1, 1, 0.22]}
      castShadow={shadows}
    >
      <sphereGeometry args={[0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial {...stationCeramic} side={2} />
    </mesh>
  );
}

export function CosmicStation({ quality, reducedMotion }: CosmicStationProps) {
  const orbitalAssembly = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && orbitalAssembly.current) {
      orbitalAssembly.current.rotation.y += Math.min(delta, 0.05) * 0.045;
    }
  });

  return (
    <group name="architects-nexus-station" rotation={[0.08, -0.38, -0.04]}>
      <SparseStars count={quality.particles} />

      <group position={[0, -0.7, 0]}>
        <mesh castShadow={quality.shadows} receiveShadow={quality.shadows}>
          <cylinderGeometry args={[5.8, 6.4, 0.72, 48]} />
          <meshStandardMaterial {...stationMetal} />
        </mesh>
        <mesh position={[0, 0.39, 0]} receiveShadow={quality.shadows}>
          <cylinderGeometry args={[4.8, 5.55, 0.12, 48]} />
          <meshStandardMaterial {...stationCeramic} />
        </mesh>
      </group>

      <group position={[0, 1.05, 0]}>
        <mesh castShadow={quality.shadows}>
          <cylinderGeometry args={[1.25, 1.65, 3.1, 32]} />
          <meshStandardMaterial {...stationMetal} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow={quality.shadows}>
          <icosahedronGeometry args={[0.9, 3]} />
          <meshPhysicalMaterial {...coreGlass} />
        </mesh>
        <mesh position={[0, 0.2, 0]} scale={1.12}>
          <torusGeometry args={[0.9, 0.025, 8, 48]} />
          <meshStandardMaterial {...restrainedCyan} />
        </mesh>
      </group>

      <group ref={orbitalAssembly} position={[0, 0.8, 0]}>
        {[3.1, 4.35].map((radius, index) => (
          <mesh
            key={radius}
            rotation={[Math.PI / 2 + index * 0.22, index * 0.35, 0]}
            castShadow={quality.shadows}
          >
            <torusGeometry args={[radius, index === 0 ? 0.13 : 0.09, 12, 80]} />
            <meshStandardMaterial {...stationMetal} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.72, 0.025, 8, 96]} />
          <meshStandardMaterial {...restrainedCyan} emissiveIntensity={0.3} />
        </mesh>
      </group>

      <AntennaModule
        position={[-3.5, 0.25, 1.4]}
        rotation={0.3}
        shadows={quality.shadows}
      />
      <AntennaModule
        position={[3.45, 0.25, -1.5]}
        rotation={-0.8}
        shadows={quality.shadows}
      />
      <group position={[-3.5, 1.25, 1.4]}>
        <ParabolicDish shadows={quality.shadows} />
      </group>
      <group position={[3.45, 1.25, -1.5]} rotation={[0, 0.8, 0]}>
        <ParabolicDish shadows={quality.shadows} />
      </group>
    </group>
  );
}
