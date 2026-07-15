import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ExperienceFallback } from './ExperienceFallback';
import { selectQualityProfile } from './quality';
import { useExperienceGate } from './useExperienceGate';

const LazyParticleScene = lazy(() =>
  import('./ParticleScene').then(({ ParticleScene }) => ({
    default: ParticleScene,
  })),
);

interface NavigatorWithCapabilities extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function matchesMedia(query: string): boolean {
  return (
    typeof window.matchMedia === 'function' && window.matchMedia(query).matches
  );
}

function supportsWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function ParticleExperience({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [contextLost, setContextLost] = useState(false);
  const quality = useMemo(() => {
    const capabilities = navigator as NavigatorWithCapabilities;
    return selectQualityProfile({
      webgl: supportsWebGL(),
      reducedMotion: matchesMedia('(prefers-reduced-motion: reduce)'),
      saveData: capabilities.connection?.saveData === true,
      mobile: matchesMedia('(max-width: 767px), (pointer: coarse)'),
      memoryGb: capabilities.deviceMemory,
    });
  }, []);
  const gate = useExperienceGate({
    eligible: quality.enabled && !contextLost,
    target: hostRef,
  });
  const open = quality.enabled && !contextLost && gate.ready && gate.visible;

  return (
    <div
      ref={hostRef}
      className={
        className ? `particle-experience ${className}` : 'particle-experience'
      }
    >
      {open ? (
        <ErrorBoundary fallback={<ExperienceFallback />}>
          <Suspense fallback={<ExperienceFallback />}>
            <LazyParticleScene
              quality={quality}
              onContextLost={() => setContextLost(true)}
            />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <ExperienceFallback />
      )}
    </div>
  );
}
