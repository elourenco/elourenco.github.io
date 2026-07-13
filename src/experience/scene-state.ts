export type SceneSection =
  'arrival' | 'ai-core' | 'systems' | 'career' | 'contact';

export interface SceneState {
  section: SceneSection;
  reducedMotion: boolean;
}
