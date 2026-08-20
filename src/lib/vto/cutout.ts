/** Remove near-white studio background and crop to the frame. */
export function cutOutProduct(
  source: HTMLImageElement | HTMLCanvasElement
): HTMLCanvasElement {
  const w = "naturalWidth" in source ? source.naturalWidth : source.width;
  const h = "naturalHeight" in source ? source.naturalHeight : source.height;
  const src = document.createElement("canvas");
  src.width = w;
  src.height = h;
  const sctx = src.getContext("2d")!;
  sctx.drawImage(source, 0, 0);

  const imageData = sctx.getImageData(0, 0, w, h);
  const { data } = imageData;
  let minX = w,
    minY = h,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;
      const maxc = Math.max(r, g, b);
      const minc = Math.min(r, g, b);
      const sat = maxc - minc;

      let alpha = data[i + 3];
      if (lum > 245 && sat < 18) {
        alpha = 0;
      } else if (lum > 228 && sat < 28) {
        alpha = Math.round(Math.max(0, (250 - lum) * 12));
      } else if (lum > 210 && sat < 22) {
        alpha = Math.round(Math.max(0, (230 - lum) * 8));
      }

      data[i + 3] = alpha;
      if (alpha > 24) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  sctx.putImageData(imageData, 0, 0);

  if (maxX <= minX || maxY <= minY) return src;

  const pad = 4;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);

  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  out.getContext("2d")!.drawImage(src, minX, minY, cw, ch, 0, 0, cw, ch);
  return out;
}

export async function loadCutout(src: string): Promise<HTMLCanvasElement> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = src;
  });
  return cutOutProduct(img);
}
