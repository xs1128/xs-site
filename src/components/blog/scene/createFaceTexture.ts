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

  ctx.shadowColor = '#00FF00';

  // Configure font settings
  const fontFamily = "'Roboto Mono', monospace";

  ctx.fillStyle = '#00FF00';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Stacked passes: each one lays another halo down before the crisp glyph
  const glowText = (text: string, y: number, blurs: number[]) => {
    for (const blur of blurs) {
      ctx.shadowBlur = blur;
      ctx.fillText(text, size / 2, y);
    }
  };

  ctx.font = `bold 36px ${fontFamily}`;
  glowText(mainText, size * 0.25, [14, 5]);

  if (valueText) {
    ctx.font = `bold 120px ${fontFamily}`;
    glowText(valueText, size * 0.5, [22, 8]);
  }

  if (subtext) {
    ctx.font = `bold 36px ${fontFamily}`;
    glowText(subtext, size * 0.75, [14, 5]);
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
