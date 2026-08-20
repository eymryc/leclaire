/**
 * Moteur VTO 3D — MediaPipe + Three.js
 * Charge /models/{slug}.glb dès qu’il est présent.
 * Placement par landmarks (plus fiable en overlay webcam que la seule matrice).
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const L_EYE = 33;
const R_EYE = 263;
const L_INNER = 133;
const R_INNER = 362;
const CHEEK_L = 234;
const CHEEK_R = 454;

export type VtoEngineOptions = {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;
  modelUrl: string;
  occluderUrl?: string;
  /** Multiplicateur taille monture (calibrage Meshy / SKU) */
  sizeFactor?: number;
};

export type VtoEngine = {
  hasModel: boolean;
  start: () => Promise<void>;
  stop: () => void;
};

async function urlExists(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

function makeFallbackOccluder() {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: true,
  });
  // Proxies oreilles + front (cache les branches derrière la tête)
  const earGeo = new THREE.BoxGeometry(0.08, 0.12, 0.04);
  const left = new THREE.Mesh(earGeo, mat);
  left.position.set(-0.12, 0.02, -0.06);
  const right = new THREE.Mesh(earGeo, mat);
  right.position.set(0.12, 0.02, -0.06);
  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.05), mat);
  brow.position.set(0, 0.08, -0.02);
  group.add(left, right, brow);
  group.renderOrder = -1;
  return group;
}

type Smooth = { x: number; y: number; z: number; angle: number; scale: number };

function lerpPose(prev: Smooth | null, next: Smooth, a = 0.32): Smooth {
  if (!prev) return next;
  return {
    x: prev.x + (next.x - prev.x) * a,
    y: prev.y + (next.y - prev.y) * a,
    z: prev.z + (next.z - prev.z) * a,
    angle: prev.angle + (next.angle - prev.angle) * a,
    scale: prev.scale + (next.scale - prev.scale) * a,
  };
}

export async function createVtoEngine(opts: VtoEngineOptions): Promise<VtoEngine> {
  const hasModel = await urlExists(opts.modelUrl);
  if (!hasModel) {
    return { hasModel: false, start: async () => undefined, stop: () => undefined };
  }

  let raf = 0;
  let running = false;
  let landmarker: FaceLandmarker | null = null;
  let stamp = 0;
  let lastVideoTime = -1;
  let smooth: Smooth | null = null;

  const renderer = new THREE.WebGLRenderer({
    canvas: opts.canvas,
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 100);
  camera.position.z = 1;

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(0.25, 0.5, 1);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(opts.modelUrl);
  const glasses = gltf.scene;

  // Normalise la taille du mesh Meshy (bounding box → ~1 unité)
  const box = new THREE.Box3().setFromObject(glasses);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  glasses.scale.setScalar(1 / maxDim);
  box.setFromObject(glasses);
  const center = new THREE.Vector3();
  box.getCenter(center);
  glasses.position.sub(center); // origine au centre de la monture

  glasses.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.frustumCulled = false;
    }
  });
  root.add(glasses);

  if (opts.occluderUrl && (await urlExists(opts.occluderUrl))) {
    const occ = await loader.loadAsync(opts.occluderUrl);
    occ.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.renderOrder = -1;
        mesh.material = new THREE.MeshBasicMaterial({
          colorWrite: false,
          depthWrite: true,
        });
      }
    });
    root.add(occ.scene);
  } else {
    root.add(makeFallbackOccluder());
  }

  const sizeFactor = opts.sizeFactor ?? 1.05;

  async function start() {
    if (running) return;
    running = true;

    const vision = await FilesetResolver.forVisionTasks(WASM);
    try {
      landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
        runningMode: "VIDEO",
        numFaces: 1,
      });
    } catch {
      landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL, delegate: "CPU" },
        runningMode: "VIDEO",
        numFaces: 1,
      });
    }

    const loop = () => {
      if (!running || !landmarker) return;
      const video = opts.video;
      const w = video.videoWidth;
      const h = video.videoHeight;

      if (w && h) {
        const aspect = w / h;
        camera.left = -aspect / 2;
        camera.right = aspect / 2;
        camera.top = 0.5;
        camera.bottom = -0.5;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);

        if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          stamp = Math.max(stamp + 16.67, performance.now());

          try {
            const result = landmarker.detectForVideo(video, stamp);
            const faces = result.faceLandmarks;
            if (faces?.length) {
              const lm = faces[0];
              const left = lm[L_EYE];
              const right = lm[R_EYE];
              const li = lm[L_INNER];
              const ri = lm[R_INNER];
              const cL = lm[CHEEK_L] ?? left;
              const cR = lm[CHEEK_R] ?? right;

              // Landmarks normalisés 0–1 → espace ortho (x miroir car vidéo scaleX(-1))
              const toX = (nx: number) => (0.5 - nx) * aspect;
              const toY = (ny: number) => 0.5 - ny;

              const midX =
                (toX(left.x) + toX(right.x) + toX(li.x) + toX(ri.x)) / 4;
              const midY = (toY(left.y) + toY(right.y)) / 2;
              const midZ = ((left.z + right.z) / 2) * -0.35;

              const dx = toX(right.x) - toX(left.x);
              const dy = toY(right.y) - toY(left.y);
              const angle = Math.atan2(dy, dx);

              const faceW = Math.hypot(toX(cR.x) - toX(cL.x), toY(cR.y) - toY(cL.y));
              const next: Smooth = {
                x: midX,
                y: midY + faceW * 0.02,
                z: midZ,
                angle,
                scale: faceW * sizeFactor,
              };
              smooth = lerpPose(smooth, next);

              root.visible = true;
              root.position.set(smooth.x, smooth.y, smooth.z);
              root.rotation.set(0, 0, smooth.angle);
              root.scale.setScalar(smooth.scale);
            } else {
              root.visible = false;
              smooth = null;
            }
          } catch {
            /* skip frame */
          }
        }

        renderer.render(scene, camera);
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    landmarker?.close();
    landmarker = null;
    renderer.dispose();
  }

  return { hasModel: true, start, stop };
}
