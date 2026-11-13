/**
 * three.js 二维舞台：正交相机 + 固定的世界高度。
 *
 * 小学数学的绝大多数可视化都在平面内完成（线段、面积模型、圆、统计图），
 * 用正交相机可以让"1 个世界单位"直接对应可预期的屏幕尺寸，比透视相机好算：
 *
 *   stage.view.height 恒等于创建时传入的 height（默认 12 个世界单位）
 *   stage.view.width  = height * 容器宽高比
 *
 * 坐标系原点在可视区中心，x 向右、y 向上。需要"屏幕坐标"时用 toWorld()。
 */
import * as THREE from 'three';

const DEFAULT_HEIGHT = 12;

export function createStage(container, options = {}) {
  const { height = DEFAULT_HEIGHT, background = null } = options;

  const scene = options.scene ?? new THREE.Scene();
  if (background) scene.background = new THREE.Color(background);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: !background,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.className = 'stage-canvas';
  container.append(renderer.domElement);

  /** 可视区尺寸（世界单位），随容器尺寸更新 */
  const view = { width: height, height };

  const tickers = new Set();
  const resizeHooks = new Set();
  const clock = new THREE.Clock();
  let rafId = 0;
  let disposed = false;

  function resize() {
    const width = container.clientWidth;
    const h = container.clientHeight;
    if (!width || !h) return;

    const aspect = width / h;
    view.height = height;
    view.width = height * aspect;

    camera.left = -view.width / 2;
    camera.right = view.width / 2;
    camera.top = view.height / 2;
    camera.bottom = -view.height / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(width, h, false);
    for (const hook of resizeHooks) hook(view);
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.elapsedTime;
    for (const tick of tickers) tick(dt, elapsed);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);
  }

  const observer = new ResizeObserver(() => resize());
  observer.observe(container);
  resize();
  rafId = requestAnimationFrame(frame);

  return {
    scene,
    camera,
    renderer,
    /** 可视区尺寸（世界单位），resize 后就地更新 */
    view,
    /** 随时间变化的回调：(dt 秒, elapsed 秒) => void */
    onTick(fn) {
      tickers.add(fn);
      return () => tickers.delete(fn);
    },
    /** 容器尺寸变化时的回调：(view) => void */
    onResize(fn) {
      resizeHooks.add(fn);
      fn(view);
      return () => resizeHooks.delete(fn);
    },
    /** 容器像素坐标 → 世界坐标 */
    toWorld(clientX, clientY) {
      const rect = container.getBoundingClientRect();
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      return {
        x: (nx - 0.5) * view.width,
        y: (0.5 - ny) * view.height,
      };
    },
    /** 把 z 轴压在场景里，避免视图层级的意外遮挡 */    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      tickers.clear();
      resizeHooks.clear();
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (!material) continue;
          material.map?.dispose?.();
          material.dispose?.();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

/** 生成圆的顶点列表（用于 LineLoop 描边） */
export function circlePoints(radius, segments = 128, center = { x: 0, y: 0 }) {
  const points = [];
  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius, 0));
  }
  return points;
}

/** 由点列创建一条可放进场景的线 */
export function createLine(points, { color = '#1f2937', dashed = false } = {}) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  let material;
  if (dashed) {
    material = new THREE.LineDashedMaterial({ color, dashSize: 0.18, gapSize: 0.12 });
  } else {
    material = new THREE.LineBasicMaterial({ color });
  }
  const line = new THREE.Line(geometry, material);
  if (dashed) line.computeLineDistances();
  return line;
}
