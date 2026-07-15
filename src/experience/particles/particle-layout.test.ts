import { describe, expect, it } from 'vitest';
import { buildParticleLayout } from './particle-layout';

describe('buildParticleLayout', () => {
  it('builds a right-biased dissolve field with sparse connections', () => {
    const layout = buildParticleLayout(120, 197);
    const positiveXCount = Array.from(
      { length: 120 },
      (_, index) => layout.positions[index * 3],
    ).filter((position) => position > 0).length;

    expect(layout.positions).toHaveLength(360);
    expect(layout.phases).toHaveLength(120);
    expect(layout.sizes).toHaveLength(120);
    expect(layout.connections.length).toBeGreaterThan(0);
    expect(layout.connections.length % 6).toBe(0);
    expect(positiveXCount / 120).toBeGreaterThanOrEqual(0.7);
  });

  it('builds deterministic finite buffers within the point-size budget', () => {
    const first = buildParticleLayout(32, 197);
    const second = buildParticleLayout(32, 197);
    expect(first.positions).toHaveLength(96);
    expect(first.phases).toHaveLength(32);
    expect(first.sizes).toHaveLength(32);
    expect([...first.positions]).toEqual([...second.positions]);
    expect([...first.connections]).toEqual([...second.connections]);
    expect([...first.positions]).not.toContain(Number.NaN);
    expect(Math.max(...first.sizes)).toBeLessThanOrEqual(2.4);
    expect(Math.min(...first.sizes)).toBeGreaterThanOrEqual(0.55);
  });

  it('returns empty buffers for a non-positive count', () => {
    expect(buildParticleLayout(0)).toEqual({
      positions: new Float32Array(),
      phases: new Float32Array(),
      sizes: new Float32Array(),
      connections: new Float32Array(),
    });
  });
});
