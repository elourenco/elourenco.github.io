export interface ParticleLayout {
  positions: Float32Array;
  phases: Float32Array;
  sizes: Float32Array;
  connections: Float32Array;
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
  if (count <= 0) {
    return {
      positions: new Float32Array(),
      phases: new Float32Array(),
      sizes: new Float32Array(),
      connections: new Float32Array(),
    };
  }

  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const connectionValues: number[] = [];
  const random = mulberry32(seed);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const spread = Math.pow(random(), 0.72);
    positions[offset] = -0.6 + spread * 7.2;
    positions[offset + 1] = (random() - 0.5) * (5.2 + spread * 2.1);
    positions[offset + 2] = (random() - 0.5) * 3.6;
    phases[index] = random() * Math.PI * 2;
    sizes[index] = 0.55 + random() * 1.65;

    if (index === 0 || index % 6 !== 0) continue;

    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (
      let candidate = Math.max(0, index - 12);
      candidate < index;
      candidate += 1
    ) {
      const candidateOffset = candidate * 3;
      const distance = Math.hypot(
        positions[offset] - positions[candidateOffset],
        positions[offset + 1] - positions[candidateOffset + 1],
        positions[offset + 2] - positions[candidateOffset + 2],
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = candidate;
      }
    }

    if (nearestIndex >= 0 && nearestDistance <= 4.5) {
      const nearestOffset = nearestIndex * 3;
      connectionValues.push(
        positions[offset],
        positions[offset + 1],
        positions[offset + 2],
        positions[nearestOffset],
        positions[nearestOffset + 1],
        positions[nearestOffset + 2],
      );
    }
  }

  return {
    positions,
    phases,
    sizes,
    connections: new Float32Array(connectionValues),
  };
}
