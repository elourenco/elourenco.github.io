import { describe, expect, it } from 'vitest';
import { buildParticleLayout } from './particle-layout';

describe('buildParticleLayout', () => {
  it('builds deterministic finite buffers within the point-size budget', () => {
    const first = buildParticleLayout(32, 197);
    const second = buildParticleLayout(32, 197);
    expect(first.positions).toHaveLength(96);
    expect(first.phases).toHaveLength(32);
    expect(first.sizes).toHaveLength(32);
    expect([...first.positions]).toEqual([...second.positions]);
    expect([...first.positions]).not.toContain(Number.NaN);
    expect(Math.max(...first.sizes)).toBeLessThanOrEqual(2.4);
    expect(Math.min(...first.sizes)).toBeGreaterThanOrEqual(0.6);
  });

  it('returns empty buffers for a non-positive count', () => {
    expect(buildParticleLayout(0)).toEqual({
      positions: new Float32Array(),
      phases: new Float32Array(),
      sizes: new Float32Array(),
    });
  });
});
