/**
 * Pipeline VTO maison — Option B
 * --------------------------------
 * Étape 1  Assets 3D (Blender / studio)
 * Étape 2  Occluder tête
 * Étape 3  Brancher MediaPipe + Three.js (ce module)
 * Étape 4  Lier /public/models/{slug}.glb au catalogue
 * Étape 5  QA tracking (lumière, angles, peaux, lunettes déjà portées)
 *
 * Ce fichier est le socle. Il ne charge le GLB que s’il existe.
 * Tant que le fichier est absent → hasModel = false (aperçu 2D actuel).
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export type VtoEngineOptions = {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;
  modelUrl: string;
  occluderUrl?: string;
  /** Échelle empirique monture → tête MediaPipe (à calibrer par SKU) */
  scale?: number;
};

export type VtoEngine = {
  hasModel: boolean;
  start: () => Promise<void>;
  stop: () => void;
};

async function urlExists(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Crée le moteur 3D. Retourne hasModel=false si le GLB n’est pas encore livré.
 */
export async function createVtoEngine(opts: VtoEngineOptions): Promise<VtoEngine> {
  const hasModel = await urlExists(opts.modelUrl);
  if (!hasModel) {
    return {
      hasModel: false,
      start: async () => undefined,
      stop: () => undefined,
    };
  }

  let raf = 0;
  let running = false;
  let landmarker: FaceLandmarker | null = null;
  let stamp = 0;
  let lastVideoTime = -1;

  const renderer = new THREE.WebGLRenderer({
    canvas: opts.canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  // Caméra perspective alignée plus tard sur le FOV webcam (calibrage Étape 3b)
  const camera = new THREE.PerspectiveCamera(63, 1, 0.01, 100);
  camera.position.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(0.3, 0.6, 0.8);
  scene.add(key);

  const root = new THREE.Group();
  scene.add(root);

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(opts.modelUrl);
  const glasses = gltf.scene;
  glasses.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.frustumCulled = false;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat?.isMeshStandardMaterial) {
        mat.envMapIntensity = 1;
        mat.needsUpdate = true;
      }
    }
  });
  // Convention Banuba-like souvent : scale ~0.1, rotation X -90° — à ajuster selon ton export Blender
  glasses.scale.setScalar(opts.scale ?? 0.1);
  glasses.rotation.x = -Math.PI / 2;
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
  }

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  async function start() {
    if (running) return;
    running = true;

    const vision = await FilesetResolver.forVisionTasks(WASM);
    try {
      landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFacialTransformationMatrixes: true,
      });
    } catch {
      landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL, delegate: "CPU" },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFacialTransformationMatrixes: true,
      });
    }

    const loop = () => {
      if (!running || !landmarker) return;
      const video = opts.video;
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w && h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          stamp = Math.max(stamp + 16.67, performance.now());
          try {
            const result = landmarker.detectForVideo(video, stamp);
            const mats = result.facialTransformationMatrixes;
            if (mats?.length) {
              // Matrice 4×4 column-major MediaPipe → Three.js
              matrix.fromArray(mats[0].data ?? (mats[0] as unknown as number[]));
              matrix.decompose(position, quaternion, scale);
              root.position.copy(position);
              root.quaternion.copy(quaternion);
              root.visible = true;
            } else {
              root.visible = false;
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
