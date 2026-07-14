import { useState } from 'react';
import portraitUrl from '../../assets/eduardo-profile.jpg';

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
      <div className="hero-portrait__frame">
        <img
          src={portraitUrl}
          alt={alt}
          width={752}
          height={752}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          hidden={failed}
          onLoad={() => setImageState('ready')}
          onError={() => setImageState('fallback')}
        />
        <span className="hero-portrait__fallback" aria-hidden="true">
          EL
        </span>
        <span className="hero-portrait__scanline" aria-hidden="true" />
      </div>
      <figcaption aria-hidden="true">EL-01</figcaption>
    </figure>
  );
}
