import { Canvas } from '@react-three/fiber';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ExperienceFallback } from './ExperienceFallback';
import { selectQualityProfile } from './quality';
import { SceneController } from './SceneController';
import type { SceneSection } from './scene-state';

interface AdaptiveCanvasProps {
  section: SceneSection;
  forceFallback?: boolean;
}

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

function matchesMedia(query: string): boolean {
  return (
    typeof window.matchMedia === 'function' && window.matchMedia(query).matches
  );
}

function supportsWebGL(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function AdaptiveCanvas({
  section,
  forceFallback = false,
}: AdaptiveCanvasProps) {
  if (forceFallback || !supportsWebGL()) {
    return <ExperienceFallback />;
  }

  const reducedMotion = matchesMedia('(prefers-reduced-motion: reduce)');
  const quality = selectQualityProfile({
    reducedMotion,
    mobile: matchesMedia('(max-width: 767px), (pointer: coarse)'),
    memoryGb: (navigator as NavigatorWithDeviceMemory).deviceMemory,
  });

  return (
    <ErrorBoundary fallback={<ExperienceFallback />}>
      <Canvas
        aria-hidden="true"
        className="experience-canvas"
        dpr={quality.dpr}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: quality.shadows || quality.postprocessing }}
        shadows={quality.shadows}
      >
        <SceneController quality={quality} state={{ section, reducedMotion }} />
      </Canvas>
    </ErrorBoundary>
  );
}
