import { describe, expect, it } from 'vitest';
import { selectQualityProfile, type QualityProfileInput } from './quality';

describe('selectQualityProfile', () => {
  it('disables the runtime when WebGL is unavailable', () => {
    expect(
      selectQualityProfile({
        webgl: false,
        reducedMotion: false,
        saveData: false,
        mobile: false,
        memoryGb: 8,
      }),
    ).toEqual({ enabled: false, dpr: [1, 1], particles: 0 });
  });

  it('uses the mobile particle budget', () => {
    expect(
      selectQualityProfile({
        webgl: true,
        reducedMotion: false,
        saveData: false,
        mobile: true,
        memoryGb: 8,
      }),
    ).toEqual({ enabled: true, dpr: [1, 1], particles: 3000 });
  });

  it('uses the capable desktop particle budget', () => {
    expect(
      selectQualityProfile({
        webgl: true,
        reducedMotion: false,
        saveData: false,
        mobile: false,
        memoryGb: 8,
      }),
    ).toEqual({ enabled: true, dpr: [1, 1.5], particles: 9000 });
  });

  it('disables the runtime on memory-constrained desktop devices', () => {
    expect(
      selectQualityProfile({
        webgl: true,
        reducedMotion: false,
        saveData: false,
        mobile: false,
        memoryGb: 2,
      }),
    ).toEqual({ enabled: false, dpr: [1, 1], particles: 0 });
  });

  it('explicitly disables every unsupported capability', () => {
    const disabledInputs: QualityProfileInput[] = [
      {
        webgl: true,
        reducedMotion: true,
        saveData: false,
        mobile: false,
        memoryGb: 8,
      },
      {
        webgl: true,
        reducedMotion: false,
        saveData: true,
        mobile: false,
        memoryGb: 8,
      },
      {
        webgl: true,
        reducedMotion: false,
        saveData: false,
        mobile: true,
        memoryGb: 2,
      },
    ];

    for (const input of disabledInputs) {
      expect(selectQualityProfile(input)).toEqual({
        enabled: false,
        dpr: [1, 1],
        particles: 0,
      });
    }
  });
});
