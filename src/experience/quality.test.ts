import { describe, expect, it } from 'vitest';
import { selectQualityProfile } from './quality';

describe('selectQualityProfile', () => {
  it('always selects low quality when reduced motion is requested', () => {
    expect(
      selectQualityProfile({ reducedMotion: true, mobile: true, memoryGb: 2 }),
    ).toEqual({
      dpr: [1, 1],
      shadows: false,
      particles: 0,
      postprocessing: false,
    });
  });

  it('selects low quality for memory-constrained mobile devices', () => {
    expect(
      selectQualityProfile({ reducedMotion: false, mobile: true, memoryGb: 2 }),
    ).toEqual({
      dpr: [1, 1],
      shadows: false,
      particles: 0,
      postprocessing: false,
    });
  });

  it('selects medium quality for mobile or lower-memory devices', () => {
    const expected = {
      dpr: [1, 1.5],
      shadows: true,
      particles: 300,
      postprocessing: false,
    };

    expect(
      selectQualityProfile({ reducedMotion: false, mobile: true, memoryGb: 8 }),
    ).toEqual(expected);
    expect(
      selectQualityProfile({
        reducedMotion: false,
        mobile: false,
        memoryGb: 4,
      }),
    ).toEqual(expected);
  });

  it('selects high quality for capable desktop devices', () => {
    expect(
      selectQualityProfile({
        reducedMotion: false,
        mobile: false,
        memoryGb: 8,
      }),
    ).toEqual({
      dpr: [1, 2],
      shadows: true,
      particles: 900,
      postprocessing: true,
    });
  });
});
