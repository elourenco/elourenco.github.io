import { expect, it, vi } from 'vitest';
import { observeWebGLContextLoss } from './ParticleScene';

vi.mock('@react-three/fiber', () => ({ Canvas: () => null, useThree: vi.fn() }));
vi.mock('./particles/NeuralParticleField', () => ({
  NeuralParticleField: () => null,
}));

it('observes a cancelable WebGL context loss and detaches cleanly', () => {
  const canvas = document.createElement('canvas');
  const onContextLost = vi.fn();
  const stopObserving = observeWebGLContextLoss(canvas, onContextLost);
  const contextLoss = new Event('webglcontextlost', { cancelable: true });

  expect(canvas.dispatchEvent(contextLoss)).toBe(false);
  expect(contextLoss.defaultPrevented).toBe(true);
  expect(onContextLost).toHaveBeenCalledOnce();

  stopObserving();
  canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  expect(onContextLost).toHaveBeenCalledOnce();
});
