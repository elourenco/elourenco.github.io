export interface ParticleLayout {
  positions: Float32Array;
  phases: Float32Array;
  sizes: Float32Array;
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildParticleLayout(count: number, seed = 197): ParticleLayout {
  if (count <= 0)
    return {
      positions: new Float32Array(),
      phases: new Float32Array(),
      sizes: new Float32Array(),
    };
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const random = mulberry32(seed);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const t = index / count;
    const angle = t * Math.PI * 12 + random() * 0.35;
    const ring = 3.6 + Math.sin(t * Math.PI * 7) * 1.1 + random() * 0.7;
    positions[offset] = Math.cos(angle) * ring;
    positions[offset + 1] = (random() - 0.5) * 5.6;
    positions[offset + 2] = Math.sin(angle) * ring + (random() - 0.5) * 1.8;
    phases[index] = random() * Math.PI * 2;
    sizes[index] = 0.6 + random() * 1.8;
  }
  return { positions, phases, sizes };
}
