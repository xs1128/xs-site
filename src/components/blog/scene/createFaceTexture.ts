import * as THREE from 'three';

export interface FaceTextConfig {
  mainText: string;
  valueText?: string;
  subtext?: string;
}

/**
 * Creates a canvas texture with terminal-style text
 * @param config - Text configuration for the face
 * @returns THREE.CanvasTexture
 */
export function createFaceTexture(config: FaceTextConfig): THREE.CanvasTexture {
  const { mainText, valueText, subtext } = config;

  // Create canvas with good resolution for crisp text
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas');
  }

  // Fill background with black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Set up glow effect
  ctx.shadowColor = '#00FF00';
  ctx.shadowBlur = 15;

  // Configure font settings
  const fontFamily = "'Roboto Mono', monospace";

  // Draw main text (top)
  ctx.fillStyle = '#00FF00';
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mainText, size / 2, size * 0.25);

  // Draw value text (center/large) if provided
  if (valueText) {
    ctx.font = `bold 120px ${fontFamily}`;
    ctx.shadowBlur = 25; // More glow for the value
    ctx.fillText(valueText, size / 2, size * 0.5);
  }

  // Draw subtext (bottom) if provided
  if (subtext) {
    ctx.shadowBlur = 15; // Reset glow
    ctx.font = `bold 36px ${fontFamily}`;
    ctx.fillText(subtext, size / 2, size * 0.75);
  }

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Disposes an array of textures to prevent memory leaks
 */
export function disposeTextures(textures: THREE.CanvasTexture[]): void {
  textures.forEach(texture => {
    texture.dispose();
  });
}
