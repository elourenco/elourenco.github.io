import { useState } from 'react';
import portraitUrl from '../assets/eduardo-profile.jpg';

export interface ProfilePortraitProps {
  alt: string;
  priority?: boolean;
}

export function ProfilePortrait({
  alt,
  priority = false,
}: ProfilePortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className="profile-portrait"
      data-image-state={failed ? 'fallback' : 'ready'}
    >
      <div className="profile-portrait__frame">
        <img
          src={portraitUrl}
          alt={alt}
          width={752}
          height={752}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          hidden={failed}
          onError={() => setFailed(true)}
        />
        <span className="profile-portrait__fallback" aria-hidden={!failed}>
          EL
        </span>
        <span className="profile-portrait__scanline" aria-hidden="true" />
      </div>
      <figcaption aria-hidden="true">EL-01</figcaption>
    </figure>
  );
}
