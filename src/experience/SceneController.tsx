import type { QualityProfile } from './quality';
import type { SceneState } from './scene-state';

interface SceneControllerProps {
  quality: QualityProfile;
  state: SceneState;
}

export function SceneController({ quality, state }: SceneControllerProps) {
  return (
    <group
      name={`scene-${state.section}`}
      userData={{
        particles: quality.particles,
        postprocessing: quality.postprocessing,
        reducedMotion: state.reducedMotion,
      }}
    />
  );
}
