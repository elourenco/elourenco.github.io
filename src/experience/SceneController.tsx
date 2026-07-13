import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Vector2, Vector3 } from 'three';
import { CosmicStation } from './CosmicStation';
import type { QualityProfile } from './quality';
import type { SceneSection, SceneState } from './scene-state';

interface SceneControllerProps {
  quality: QualityProfile;
  state: SceneState;
}

interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_POSES: Record<SceneSection, CameraPose> = {
  arrival: { position: [10.5, 5.6, 12.5], target: [0, 0.6, 0] },
  'ai-core': { position: [5.2, 2.8, 7.2], target: [0, 1.15, 0] },
  systems: { position: [-9, 5.2, 9], target: [0, 0.4, 0] },
  career: { position: [8.8, 7.5, 10.8], target: [0, -0.2, 0] },
  contact: { position: [1.2, 3.8, 14.5], target: [0, 0.8, 0] },
};

function CameraRig({ state }: { state: SceneState }) {
  const { camera, invalidate } = useThree();
  const lookTarget = useRef(new Vector3(...CAMERA_POSES.arrival.target));
  const pose = CAMERA_POSES[state.section];
  const destination = useMemo(() => new Vector3(...pose.position), [pose]);
  const destinationTarget = useMemo(() => new Vector3(...pose.target), [pose]);

  useEffect(() => {
    if (state.reducedMotion) {
      camera.position.set(...pose.position);
      lookTarget.current.set(...pose.target);
      camera.lookAt(lookTarget.current);
    }
    invalidate();
  }, [camera, invalidate, pose, state.reducedMotion]);

  useFrame((_, delta) => {
    if (state.reducedMotion) return;
    const alpha = 1 - Math.exp(-Math.min(delta, 0.1) * 2.8);
    camera.position.lerp(destination, alpha);
    lookTarget.current.lerp(destinationTarget, alpha);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

function Bloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const nextComposer = new EffectComposer(gl);
    nextComposer.addPass(new RenderPass(scene, camera));
    nextComposer.addPass(
      new UnrealBloomPass(
        new Vector2(size.width, size.height),
        0.22,
        0.35,
        0.9,
      ),
    );
    return nextComposer;
  }, [camera, gl, scene, size.height, size.width]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
    return () => composer.dispose();
  }, [composer, size.height, size.width]);

  useFrame((_, delta) => composer.render(delta), 1);
  return null;
}

export function SceneController({ quality, state }: SceneControllerProps) {
  return (
    <>
      <color attach="background" args={['#020609']} />
      <fog attach="fog" args={['#020609', 24, 72]} />
      <hemisphereLight args={['#789aa2', '#071013', 0.55]} />
      <directionalLight
        position={[7, 11, 6]}
        color="#dce9ea"
        intensity={2.8}
        castShadow={quality.shadows}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={[-6, 2, 4]}
        color="#22687a"
        intensity={18}
        distance={22}
        decay={2}
      />
      <CosmicStation quality={quality} reducedMotion={state.reducedMotion} />
      <CameraRig state={state} />
      {quality.postprocessing && !state.reducedMotion ? <Bloom /> : null}
    </>
  );
}
