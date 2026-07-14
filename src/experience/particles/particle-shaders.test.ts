import { describe, expect, it } from 'vitest';
import { particleFragmentShader } from './particle-shaders';

describe('particleFragmentShader', () => {
  it('uses a defined ascending-edge smoothstep for radial alpha', () => {
    expect(particleFragmentShader).toContain(
      '1.0 - smoothstep(0.08, 0.5, radius)',
    );
    expect(particleFragmentShader).not.toContain(
      'smoothstep(0.5, 0.08, radius)',
    );
  });

  it('keeps the particle field in the constructed-reality signal palette', () => {
    expect(particleFragmentShader).toContain(
      'vec4(0.66, 1.0, 0.24, alpha * 0.88)',
    );
  });
});
