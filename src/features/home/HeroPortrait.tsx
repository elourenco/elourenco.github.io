import { useState } from 'react';
import portraitUrl from '../../assets/eduardo-portrait.png';

export interface HeroPortraitProps {
  alt: string;
  priority?: boolean;
}

type ImageState = 'loading' | 'ready' | 'fallback';

export function HeroPortrait({ alt, priority = false }: HeroPortraitProps) {
  const [imageState, setImageState] = useState<ImageState>('loading');
  const failed = imageState === 'fallback';

  return (
    <figure className="hero-portrait" data-image-state={imageState}>
      <img
        src={portraitUrl}
        alt={alt}
        width={1024}
        height={1240}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        hidden={failed}
        onLoad={() => setImageState('ready')}
        onError={() => setImageState('fallback')}
      />
      <span className="hero-portrait__fallback" aria-hidden="true">
        EL
      </span>
    </figure>
  );
}
