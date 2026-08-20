"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { Product, ProductColor } from "@/lib/catalog/products";
import { loadCutout } from "@/lib/vto/cutout";
import { silenceMediapipeLogs } from "@/lib/vto/silenceLogs";
import { createVtoEngine, type VtoEngine } from "@/lib/vto/createVtoEngine";

type Props = {
  product: Product;
  color?: ProductColor;
  imageFilter?: string;
  onClose: () => void;
};

type Pose2d = { x: number; y: number; angle: number; width: number; height: number };

const WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const L_EYE = 33;
const R_EYE = 263;
const L_INNER = 133;
const R_INNER = 362;

function smooth2d(prev: Pose2d | null, next: Pose2d, a = 0.28): Pose2d {
  if (!prev) return next;
  return {
    x: prev.x + (next.x - prev.x) * a,
    y: prev.y + (next.y - prev.y) * a,
    angle: prev.angle + (next.angle - prev.angle) * a,
    width: prev.width + (next.width - prev.width) * a,
    height: prev.height + (next.height - prev.height) * a,
  };
}

export function VirtualTryOnModal({ product, color, imageFilter, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const glassesRef = useRef<HTMLCanvasElement | null>(null);
  const poseRef = useRef<Pose2d | null>(null);
  const engineRef = useRef<VtoEngine | null>(null);
  const rafRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const stampRef = useRef(0);
  const statusRef = useRef<"loading" | "ready" | "noface" | "denied" | "error">("loading");

  const [status, setStatus] = useState<"loading" | "ready" | "noface" | "denied" | "error">(
    "loading"
  );
  const [mode, setMode] = useState<"3d" | "2d">("2d");
  const [loadHint, setLoadHint] = useState("Préparation de l’essayage…");
  statusRef.current = status;
  const filterRef = useRef(imageFilter);
  filterRef.current = imageFilter;

  useEffect(() => {
    let cancelled = false;
    const restoreLogs = silenceMediapipeLogs();

    async function boot() {
      try {
        setLoadHint("Activation de la caméra…");
        if (!navigator.mediaDevices?.getUserMedia) {
          setStatus("error");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        await new Promise<void>((resolve) => {
          if (video.readyState >= 2 && video.videoWidth > 0) resolve();
          else video.onloadeddata = () => resolve();
        });
        await new Promise((r) => setTimeout(r, 100));
        if (cancelled) return;

        // ——— Essai moteur 3D (Meshy GLB) ———
        const modelUrl = product.modelGlb ?? `/models/${product.slug}.glb`;
        if (canvas3dRef.current) {
          setLoadHint("Chargement du modèle 3D…");
          const engine = await createVtoEngine({
            canvas: canvas3dRef.current,
            video,
            modelUrl,
            occluderUrl: product.occluderGlb ?? "/models/face-occluder.glb",
            sizeFactor: 1.08,
          });
          if (cancelled) {
            engine.stop();
            return;
          }
          if (engine.hasModel) {
            engineRef.current = engine;
            setMode("3d");
            setLoadHint("Initialisation du suivi facial…");
            await engine.start();
            if (cancelled) {
              engine.stop();
              return;
            }
            setStatus("ready");
            return;
          }
        }

        // ——— Fallback 2D (pas de GLB) ———
        setMode("2d");
        setLoadHint("Monture 2D (ajoutez le .glb pour le 3D)…");
        glassesRef.current = await loadCutout(product.image);
        if (cancelled) return;

        setLoadHint("Initialisation du suivi facial…");
        const vision = await FilesetResolver.forVisionTasks(WASM);
        let landmarker: FaceLandmarker;
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
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setStatus("ready");
        loop2d();
      } catch (e) {
        const name = e instanceof DOMException ? e.name : "";
        setStatus(
          name === "NotAllowedError" || name === "PermissionDeniedError" ? "denied" : "error"
        );
      }
    }

    function loop2d() {
      const video = videoRef.current;
      const canvas = canvas2dRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !canvas || !landmarker || cancelled) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) {
        rafRef.current = requestAnimationFrame(loop2d);
        return;
      }
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
      }

      if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        stampRef.current = Math.max(stampRef.current + 16.67, performance.now());

        let result;
        try {
          result = landmarker.detectForVideo(video, stampRef.current);
        } catch {
          rafRef.current = requestAnimationFrame(loop2d);
          return;
        }

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          rafRef.current = requestAnimationFrame(loop2d);
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const faces = result.faceLandmarks;

        if (faces?.length) {
          if (statusRef.current === "noface") setStatus("ready");
          const lm = faces[0];
          const left = lm[L_EYE];
          const right = lm[R_EYE];
          const li = lm[L_INNER];
          const ri = lm[R_INNER];
          const cheekL = lm[234] ?? left;
          const cheekR = lm[454] ?? right;

          const midX = ((left.x + right.x + li.x + ri.x) / 4) * canvas.width;
          const midY = ((left.y + right.y) / 2) * canvas.height;
          const dxEyes = (right.x - left.x) * canvas.width;
          const dyEyes = (right.y - left.y) * canvas.height;
          const faceW = Math.hypot(
            (cheekR.x - cheekL.x) * canvas.width,
            (cheekR.y - cheekL.y) * canvas.height
          );

          const raw: Pose2d = {
            x: midX,
            y: midY + faceW * 0.02,
            angle: Math.atan2(dyEyes, dxEyes),
            width: faceW * 0.92,
            height: faceW * 0.38,
          };
          poseRef.current = smooth2d(poseRef.current, raw);
          const pose = poseRef.current;
          const glasses = glassesRef.current;

          if (glasses && pose) {
            const aspect = glasses.height / glasses.width;
            const gw = pose.width;
            const gh = gw * aspect;
            ctx.save();
            ctx.translate(pose.x, pose.y);
            ctx.rotate(pose.angle);
            ctx.globalAlpha = 0.2;
            ctx.filter = "blur(6px)";
            ctx.drawImage(glasses, -gw / 2, -gh * 0.28 + 4, gw, gh);
            ctx.globalAlpha = 1;
            ctx.filter =
              filterRef.current && filterRef.current !== "none"
                ? filterRef.current
                : "none";
            ctx.drawImage(glasses, -gw / 2, -gh * 0.32, gw, gh);
            ctx.restore();
            ctx.filter = "none";
          }
        } else {
          poseRef.current = null;
          if (statusRef.current === "ready") setStatus("noface");
        }
      }

      rafRef.current = requestAnimationFrame(loop2d);
    }

    void boot();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      engineRef.current?.stop();
      engineRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      restoreLogs();
    };
  }, [product.image, product.modelGlb, product.occluderGlb, product.slug]);

  const stopAndClose = () => {
    cancelAnimationFrame(rafRef.current);
    engineRef.current?.stop();
    engineRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    onClose();
  };

  const expectedFile = product.modelGlb ?? `/models/${product.slug}.glb`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00080f]/85 p-3 backdrop-blur-2xl sm:p-5"
      role="dialog"
      aria-modal
      aria-labelledby="vto-title"
    >
      <div className="relative flex h-[min(90vh,820px)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#070d16] shadow-[0_40px_100px_rgba(0,0,0,0.55)] md:flex-row">
        <button
          type="button"
          onClick={stopAndClose}
          className="absolute right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          aria-label="Fermer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="relative h-[56%] w-full md:h-full md:w-[68%]">
          <div className="absolute inset-0 overflow-hidden" style={{ transform: "scaleX(-1)" }}>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
            />
            <canvas
              ref={canvas2dRef}
              className={`absolute inset-0 h-full w-full object-cover ${mode === "3d" ? "hidden" : ""}`}
            />
            <canvas
              ref={canvas3dRef}
              className={`absolute inset-0 h-full w-full object-cover ${mode === "3d" ? "" : "hidden"}`}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,8,15,0.55)_100%)]" />

          {status === "loading" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#070d16]/75 text-white">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-[#3cd7ff]" />
              <p className="text-[14px] font-medium tracking-wide">{loadHint}</p>
            </div>
          )}

          {status === "denied" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-8 text-center text-white">
              <span className="material-symbols-outlined text-4xl text-[#3cd7ff]">videocam_off</span>
              <p className="text-lg font-semibold">Caméra requise</p>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-8 text-center text-white">
              <span className="material-symbols-outlined text-4xl">error</span>
              <p className="text-lg font-semibold">Essayage indisponible</p>
            </div>
          )}

          {status === "noface" && (
            <div className="absolute inset-x-0 top-6 z-20 flex justify-center">
              <p className="rounded-full bg-black/45 px-4 py-2 text-[12px] text-white/90 backdrop-blur-md">
                Centrez votre visage dans le miroir
              </p>
            </div>
          )}

          {status === "ready" && (
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3cd7ff]" />
              {mode === "3d" ? "3D actif" : "Aperçu 2D"}
            </div>
          )}
        </div>

        <aside className="flex h-[44%] w-full flex-col border-t border-white/10 bg-[#0b1522] px-6 py-6 text-white md:h-full md:w-[32%] md:border-l md:border-t-0 md:px-8 md:py-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3cd7ff]">
            Essayage en direct
          </p>
          <h3
            id="vto-title"
            className="mt-3 font-[family-name:var(--font-sora)] text-2xl font-semibold tracking-tight"
          >
            {product.name}
          </h3>
          <p className="mt-1 text-[14px] text-white/55">
            {color?.label ?? product.materialLabel}
          </p>

          <div className="mt-8 space-y-3 text-[13px] leading-relaxed text-white/65">
            {mode === "3d" ? (
              <p>
                Modèle 3D chargé. Tournez légèrement la tête — les branches suivent le visage.
              </p>
            ) : (
              <>
                <p>Pas encore de fichier 3D pour cette monture.</p>
                <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-[#3cd7ff]">
                  {expectedFile}
                </p>
                <p className="text-[12px] text-white/40">
                  Générez le GLB sur Meshy, déposez-le ici, rechargez la page.
                </p>
              </>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <button
              type="button"
              onClick={stopAndClose}
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#00677e] text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#00829e]"
            >
              Continuer mes achats
            </button>
            <Link
              href="/magasins"
              className="flex h-11 w-full items-center justify-center rounded-full border border-white/15 text-[12px] font-medium text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Prendre RDV en magasin
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
