import { ExperienceFallback } from './ExperienceFallback';
import { ParticleExperience } from './ParticleExperience';
import type { SceneSection } from './scene-state';

interface AdaptiveCanvasProps {
  section: SceneSection;
  forceFallback?: boolean;
}

export function AdaptiveCanvas({ forceFallback = false }: AdaptiveCanvasProps) {
  return forceFallback ? <ExperienceFallback /> : <ParticleExperience />;
}
