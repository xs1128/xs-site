const vertexSource = `
attribute vec3 trefoil;
attribute vec3 mobius;
attribute vec3 spiral;
uniform vec3 weights;
uniform vec4 rotation;
uniform vec4 viewport;
uniform vec2 tilt;
uniform vec3 accent;
uniform vec3 highlight;
varying mediump vec4 color;
varying mediump float edge;
void main() {
  vec3 p = trefoil * weights.x + mobius * weights.y + spiral * weights.z;
  p.xz = mat2(rotation.z, -rotation.w, rotation.w, rotation.z) * p.xz;
  p.yz = mat2(rotation.x, rotation.y, -rotation.y, rotation.x) * p.yz;
  p.xy = mat2(tilt.x, tilt.y, -tilt.y, tilt.x) * p.xy;
  float perspective = 5.0 / (5.0 + p.z);
  vec2 screen = p.xy * viewport.z * perspective / viewport.xy;
  gl_Position = vec4(screen.x * 2.0 + 0.04, screen.y * -2.0, 0.0, 1.0);
  gl_PointSize = (viewport.x < 500.0 ? 2.5 : 3.4) * perspective * viewport.w;
  float layer = clamp(floor((2.0 - p.z) * 2.0), 0.0, 7.0);
  color = vec4(mix(accent, highlight, step(4.5, layer)), 0.15 + layer * 0.11);
  edge = 2.0 / gl_PointSize;
}`;

const fragmentSource = `
precision mediump float;
varying mediump vec4 color;
varying mediump float edge;
void main() {
  float radius = length(gl_PointCoord * 2.0 - 1.0);
  float alpha = color.a * (1.0 - smoothstep(1.0 - edge, 1.0, radius));
  gl_FragColor = vec4(color.rgb * alpha, alpha);
}`;

export function createParticleRenderer(
  canvas: HTMLCanvasElement,
  shapes: Float32Array[],
) {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;
  const program = gl.createProgram();
  const buffers = shapes.map(() => gl.createBuffer());
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  const dispose = () => {
    buffers.forEach((buffer) => gl.deleteBuffer(buffer));
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  };
  if (!program || buffers.some((buffer) => !buffer) || !vertex || !fragment) {
    dispose();
    return null;
  }
  gl.shaderSource(vertex, vertexSource);
  gl.shaderSource(fragment, fragmentSource);
  gl.compileShader(vertex);
  gl.compileShader(fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }
  gl.useProgram(program);
  ['trefoil', 'mobius', 'spiral'].forEach((name, index) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[index]);
    gl.bufferData(gl.ARRAY_BUFFER, shapes[index], gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
  });
  const rotation = gl.getUniformLocation(program, 'rotation');
  const weights = gl.getUniformLocation(program, 'weights');
  const viewport = gl.getUniformLocation(program, 'viewport');
  const palette = getComputedStyle(canvas);
  for (const [uniform, property] of [
    ['accent', '--color-accent'],
    ['highlight', '--color-terracotta'],
  ]) {
    const hex = palette.getPropertyValue(property).trim();
    gl.uniform3fv(
      gl.getUniformLocation(program, uniform),
      [0, 1, 2].map(
        (index) =>
          Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255,
      ),
    );
  }
  gl.uniform2f(
    gl.getUniformLocation(program, 'tilt'),
    Math.cos(-0.28),
    Math.sin(-0.28),
  );
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return {
    resize(width: number, height: number) {
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        2,
        Math.sqrt(2_000_000 / (width * height)),
      );
      const nextWidth = Math.round(width * ratio);
      const nextHeight = Math.round(height * ratio);
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform4f(
        viewport,
        width,
        height,
        Math.min(width * 0.225, height * 0.3),
        ratio,
      );
    },
    draw(angleX: number, angleY: number, blend: Float32Array) {
      gl.uniform3fv(weights, blend);
      gl.uniform4f(
        rotation,
        Math.cos(angleX),
        Math.sin(angleX),
        Math.cos(angleY),
        Math.sin(angleY),
      );
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, shapes[0].length / 3);
      return true;
    },
    dispose,
  };
}
