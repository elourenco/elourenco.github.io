export interface QualityProfile {
  enabled: boolean;
  dpr: [number, number];
  particles: number;
}

export interface QualityProfileInput {
  webgl: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  mobile: boolean;
  memoryGb?: number;
}

const DISABLED: QualityProfile = { enabled: false, dpr: [1, 1], particles: 0 };

export function selectQualityProfile(
  input: QualityProfileInput,
): QualityProfile {
  if (
    !input.webgl ||
    input.reducedMotion ||
    input.saveData ||
    (input.memoryGb ?? 4) <= 2
  ) {
    return DISABLED;
  }

  return input.mobile || (input.memoryGb ?? 4) < 8
    ? { enabled: true, dpr: [1, 1], particles: 3000 }
    : { enabled: true, dpr: [1, 1.5], particles: 9000 };
}
