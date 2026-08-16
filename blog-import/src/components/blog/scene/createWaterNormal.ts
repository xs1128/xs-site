import { DataTexture, RGBAFormat, RepeatWrapping, LinearMipmapLinearFilter, LinearFilter } from 'three'

const RIPPLES = [
  { fx: 1, fy: 1, amp: 1.0, phase: 0.0 },
  { fx: 2, fy: -1, amp: 0.78, phase: 1.7 },
  { fx: -1, fy: 2, amp: 0.6, phase: 3.1 },
  { fx: 3, fy: 2, amp: 0.32, phase: 0.9 },
  { fx: -2, fy: -3, amp: 0.22, phase: 2.4 },
]

export function createWaterNormal(size = 256, strength = 4.5): DataTexture {
  const data = new Uint8Array(size * size * 4)
  const step = (2 * Math.PI) / size

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let dx = 0
      let dy = 0

      for (const { fx, fy, amp, phase } of RIPPLES) {
        const angle = (fx * x + fy * y) * step + phase
        const cos = Math.cos(angle)
        dx += amp * fx * cos
        dy += amp * fy * cos
      }

      dx *= strength * step
      dy *= strength * step

      const length = Math.sqrt(dx * dx + dy * dy + 1)
      const offset = (y * size + x) * 4
      data[offset] = ((-dx / length) * 0.5 + 0.5) * 255
      data[offset + 1] = ((-dy / length) * 0.5 + 0.5) * 255
      data[offset + 2] = (1 / length) * 0.5 * 255 + 127.5
      data[offset + 3] = 255
    }
  }

  const texture = new DataTexture(data, size, size, RGBAFormat)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true

  return texture
}
