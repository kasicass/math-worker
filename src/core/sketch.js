/**
 * 尺规作图的绘图原子：圆 / 弧 / 折线 / 实心区域。
 *
 * 设计要点：
 *   1. 每条线都预先算好密集采样点，用 `setDrawRange` 控制"画到哪"，天然支持逐笔生长动画；
 *   2. 所有材质都关掉深度测试，靠 `renderOrder` 决定图层（涂色 < 铅笔线 < 圆心点）；
 *   3. setProgress(0..1) 统一接口，0 表示还没画，1 表示画完。
 */
import * as THREE from 'three';

const ARC_SEGMENTS = 192;
const LINE_STEP = 0.035;

function bufferGeometry(points) {
  const positions = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i += 1) {
    positions[i * 3] = points[i].x;
    positions[i * 3 + 1] = points[i].y;
    positions[i * 3 + 2] = 0;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, 0);
  return geometry;
}

function lineObject(geometry, { color, opacity = 1, order = 300, dashed = false }) {
  const base = { color, transparent: true, opacity, depthTest: false, depthWrite: false };
  const material = dashed
    ? new THREE.LineDashedMaterial({ ...base, dashSize: 0.16, gapSize: 0.11 })
    : new THREE.LineBasicMaterial(base);
  const line = new THREE.Line(geometry, material);
  if (dashed) line.computeLineDistances();
  line.renderOrder = order;
  line.frustumCulled = false;
  return line;
}

/** 折线按长度均匀加密，保证动画速度看起来一致 */
function densify(vertices, step = LINE_STEP) {
  const out = [];
  for (let i = 0; i < vertices.length - 1; i += 1) {
    const a = vertices[i];
    const b = vertices[i + 1];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    const count = Math.max(1, Math.ceil(length / step));
    for (let k = 0; k < count; k += 1) {
      const t = k / count;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  if (vertices.length) out.push({ ...vertices[vertices.length - 1] });
  return out;
}

function arcPoints({ cx = 0, cy = 0, r = 1, start = 0, sweep = Math.PI * 2 }) {
  const count = Math.max(8, Math.ceil((ARC_SEGMENTS * Math.abs(sweep)) / (Math.PI * 2)));
  const points = [];
  for (let i = 0; i <= count; i += 1) {
    const angle = start + (sweep * i) / count;
    points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return points;
}

/**
 * 画一段圆弧（sweep 为 2π 时就是整圆）。
 * 绘制过程中会附带一条从圆心到笔尖的虚线，模拟圆规的半径。
 */
export function strokeArc({
  cx = 0,
  cy = 0,
  r = 1,
  start = 0,
  sweep = Math.PI * 2,
  color = '#1c2333',
  opacity = 1,
  order = 300,
  showRadius = true,
}) {
  const points = arcPoints({ cx, cy, r, start, sweep });
  const geometry = bufferGeometry(points);
  const line = lineObject(geometry, { color, opacity, order });

  const group = new THREE.Group();
  group.add(line);

  // 半径指示线：从圆心指向笔尖
  const radiusGeometry = new THREE.BufferGeometry();
  radiusGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([cx, cy, 0, cx, cy, 0]), 3),
  );
  const radiusLine = lineObject(radiusGeometry, { color, opacity: opacity * 0.45, order: order - 1 });
  radiusLine.visible = false;
  if (showRadius) group.add(radiusLine);

  const pen = { x: cx + Math.cos(start) * r, y: cy + Math.sin(start) * r };

  return {
    object: group,
    pen,
    setProgress(p) {
      const count = Math.round(points.length * p);
      geometry.setDrawRange(0, count);
      const angle = start + sweep * p;
      pen.x = cx + Math.cos(angle) * r;
      pen.y = cy + Math.sin(angle) * r;
      if (showRadius) {
        const drawing = p > 0.001 && p < 0.999;
        radiusLine.visible = drawing;
        if (drawing) {
          const attribute = radiusGeometry.getAttribute('position');
          attribute.setXY(0, cx, cy);
          attribute.setXY(1, pen.x, pen.y);
          attribute.needsUpdate = true;
        }
      }
    },
  };
}

/** 画折线；closed 为 true 时首尾相连（画正多边形用），dashed 画对称轴 */
export function strokePolyline(
  vertices,
  { color = '#1c2333', opacity = 1, order = 300, closed = false, dashed = false } = {},
) {
  const points = densify(closed ? [...vertices, vertices[0]] : vertices);
  const geometry = bufferGeometry(points);
  const line = lineObject(geometry, { color, opacity, order, dashed });
  const pen = { x: points[0]?.x ?? 0, y: points[0]?.y ?? 0 };

  return {
    object: line,
    pen,
    setProgress(p) {
      const count = Math.round(points.length * p);
      geometry.setDrawRange(0, count);
      const index = Math.min(points.length - 1, Math.max(0, count - 1));
      pen.x = points[index].x;
      pen.y = points[index].y;
    },
  };
}

function fillMaterial(color, opacity, order) {
  return {
    material: new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    order,
  };
}

/** 涂色：圆盘 / 扇形（sweep 控制） */
export function fillDisk({
  cx = 0,
  cy = 0,
  r = 1,
  start = 0,
  sweep = Math.PI * 2,
  color = '#3b6ef5',
  opacity = 1,
  order = 100,
}) {
  const segments = Math.max(24, Math.ceil((128 * Math.abs(sweep)) / (Math.PI * 2)));
  const geometry = new THREE.CircleGeometry(r, segments, start, sweep);
  const { material } = fillMaterial(color, opacity, order);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(cx, cy, 0);
  mesh.renderOrder = order;
  mesh.frustumCulled = false;
  mesh.visible = false;

  return {
    object: mesh,
    material,
    setProgress(p) {
      mesh.visible = p > 0.002;
      material.opacity = opacity * p;
    },
  };
}

/** 涂色：多边形区域 */
export function fillPolygon({ vertices, color = '#3b6ef5', opacity = 1, order = 100 }) {
  const shape = new THREE.Shape(vertices.map((v) => new THREE.Vector2(v.x, v.y)));
  const geometry = new THREE.ShapeGeometry(shape);
  const { material } = fillMaterial(color, opacity, order);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = order;
  mesh.frustumCulled = false;
  mesh.visible = false;

  return {
    object: mesh,
    material,
    setProgress(p) {
      mesh.visible = p > 0.002;
      material.opacity = opacity * p;
    },
  };
}

/** 小圆点：圆心、截点标记 */export function dot({ cx = 0, cy = 0, r = 0.055, color = '#1c2333', order = 400 }) {
  const geometry = new THREE.CircleGeometry(r, 24);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(cx, cy, 0);
  mesh.renderOrder = order;
  mesh.frustumCulled = false;

  return {
    object: mesh,
    material,
    setProgress(p) {
      material.opacity = p;
      mesh.visible = p > 0.002;
    },
  };
}

/** 图形上的文字标注（canvas 贴图 → Sprite），size 是世界单位高度 */
export function label({
  x = 0,
  y = 0,
  text = '',
  color = '#5b6680',
  size = 0.4,
  order = 950,
}) {
  const fontSize = 64;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `600 ${fontSize}px 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif`;
  ctx.font = font;
  canvas.width = Math.ceil(ctx.measureText(text).width) + 24;
  canvas.height = Math.ceil(fontSize * 1.45);

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 12, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set((size * canvas.width) / canvas.height, size, 1);
  sprite.position.set(x, y, 0);
  sprite.renderOrder = order;
  sprite.visible = false;

  return {
    object: sprite,
    material,
    setProgress(p) {
      material.opacity = p;
      sprite.visible = p > 0.01;
    },
  };
}
