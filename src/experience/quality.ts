export interface QualityProfile {
  dpr: [number, number];
  shadows: boolean;
  particles: number;
  postprocessing: boolean;
}

export interface QualityProfileInput {
  reducedMotion: boolean;
  mobile: boolean;
  memoryGb?: number;
}

const LOW: QualityProfile = {
  dpr: [1, 1],
  shadows: false,
  particles: 0,
  postprocessing: false,
};

const MEDIUM: QualityProfile = {
  dpr: [1, 1.5],
  shadows: true,
  particles: 300,
  postprocessing: false,
};

const HIGH: QualityProfile = {
  dpr: [1, 2],
  shadows: true,
  particles: 900,
  postprocessing: true,
};

export function selectQualityProfile(
  input: QualityProfileInput,
): QualityProfile {
  if (input.reducedMotion || (input.mobile && (input.memoryGb ?? 4) <= 2)) {
    return LOW;
  }

  if (input.mobile || (input.memoryGb ?? 4) < 8) {
    return MEDIUM;
  }

  return HIGH;
}
