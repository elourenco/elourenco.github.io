import {
  Color,
  type MeshPhysicalMaterialParameters,
  type MeshStandardMaterialParameters,
} from 'three';

export const stationMetal: MeshStandardMaterialParameters = {
  color: new Color('#29343c'),
  metalness: 0.86,
  roughness: 0.34,
};

export const stationCeramic: MeshStandardMaterialParameters = {
  color: new Color('#b6c0c5'),
  metalness: 0.18,
  roughness: 0.52,
};

export const coreGlass: MeshPhysicalMaterialParameters = {
  color: new Color('#163943'),
  emissive: new Color('#18a9bc'),
  emissiveIntensity: 0.38,
  metalness: 0.08,
  roughness: 0.12,
  transmission: 0.28,
  thickness: 0.8,
  transparent: true,
  opacity: 0.9,
};

export const restrainedCyan: MeshStandardMaterialParameters = {
  color: new Color('#3e7680'),
  emissive: new Color('#23b7c8'),
  emissiveIntensity: 0.55,
  metalness: 0.45,
  roughness: 0.3,
};
