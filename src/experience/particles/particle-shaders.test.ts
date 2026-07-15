import { describe, expect, it } from 'vitest';
import {
  particleFragmentShader,
  particleVertexShader,
} from './particle-shaders';

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
      'vec4(0.66, 1.0, 0.24, alpha * 0.72)',
    );
  });
});

describe('particleVertexShader', () => {
  it('uses fine points for the 9k desktop particle field', () => {
    expect(particleVertexShader).toContain(
      'pointSize * (24.0 / max(1.0, -viewPosition.z))',
    );
    expect(particleVertexShader).not.toContain('pointSize * (70.0');
  });

  it('uses slow independent drift for a stable dissolve edge', () => {
    expect(particleVertexShader).toContain('uTime * 0.18');
    expect(particleVertexShader).toContain('uTime * 0.08');
    expect(particleVertexShader).not.toContain('uTime * 0.35');
    expect(particleVertexShader).not.toContain('uTime * 0.12');
  });
});
