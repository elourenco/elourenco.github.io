export const particleVertexShader = `
attribute float phase;
attribute float pointSize;
uniform float uTime;
void main() {
  vec3 animated = position;
  animated.y += sin(uTime * 0.18 + phase) * 0.16;
  animated.xz += vec2(cos(phase + uTime * 0.08), sin(phase + uTime * 0.08)) * 0.05;
  vec4 viewPosition = modelViewMatrix * vec4(animated, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = pointSize * (24.0 / max(1.0, -viewPosition.z));
}`;

export const particleFragmentShader = `
void main() {
  float radius = distance(gl_PointCoord, vec2(0.5));
  if (radius > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.08, 0.5, radius);
  gl_FragColor = vec4(0.66, 1.0, 0.24, alpha * 0.72);
}`;
