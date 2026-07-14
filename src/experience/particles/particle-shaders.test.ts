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
});
