/* Leaf artwork for the falling leaves: four leaf outlines with veins, drawn
   once into small offscreen canvases. Image sprites can replace them. */

export interface Sprite {
  image: CanvasImageSource;
  aspect: number; // width / height
}


/* --- Leaf shapes --------------------------------------------------------
   Each returns outline points; they are normalized to a 1-unit-tall box. */
export type Shape = { points: () => [number, number][]; veins: number };

export const SHAPES: Shape[] = [
  // Elm: pointed oval
  {
    veins: 5,
    points: () => {
      const pts: [number, number][] = [];
      for (let i = 0; i < 64; i++) {
        const t = (i / 64) * Math.PI * 2;
        const s = Math.sin(t);
        pts.push([0.34 * Math.sign(s) * Math.pow(Math.abs(s), 1.5) * (1 - 0.2 * Math.cos(t)), -0.5 * Math.cos(t)]);
      }
      return pts;
    },
  },
  // Maple: five pointed lobes
  {
    veins: 0,
    points: () => polar(180, (phi) => (0.26 + 0.24 * Math.pow(Math.abs(Math.cos(2.5 * phi)), 3)) * (0.82 + 0.18 * Math.cos(phi)), 1),
  },
  // Oak: long with rounded lobes
  {
    veins: 4,
    points: () => polar(160, (phi) => 0.36 + 0.06 * Math.cos(7 * phi), 0.62),
  },
  // Birch: broad, finely toothed
  {
    veins: 4,
    points: () => polar(200, (phi) => 0.42 * (0.84 + 0.16 * Math.cos(phi)) * (1 + 0.025 * Math.cos(26 * phi)), 0.78),
  },
];

/** Sample a polar outline; phi = 0 points up (leaf tip). */
function polar(n: number, r: (phi: number) => number, xScale: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const phi = (i / n) * Math.PI * 2;
    const rr = r(phi);
    pts.push([Math.sin(phi) * rr * xScale, -Math.cos(phi) * rr]);
  }
  return pts;
}

export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Render one leaf shape in one color to an offscreen canvas. */
export function drawLeafSprite(shape: Shape, color: string, vein: string, highlight: string, px: number): Sprite {
  const raw = shape.points();
  const xs = raw.map((p) => p[0]);
  const ys = raw.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const bodyH = 0.88; // leave room for the stem
  const scale = bodyH / (maxY - minY);
  const w = (maxX - minX) * scale;
  const pts = raw.map(([x, y]) => [(x - (minX + maxX) / 2) * scale, (y - minY) * scale - 0.5] as [number, number]);
  const aspect = Math.max(w, 0.2);

  const c = document.createElement("canvas");
  c.width = Math.ceil(px * aspect) + 2;
  c.height = px + 2;
  const ctx = c.getContext("2d")!;
  ctx.translate(c.width / 2, c.height / 2);
  ctx.scale(px, px);

  // Body
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Soft sheen on one side
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(-w / 2, -0.5, w / 2, 0.5);
  g.addColorStop(0, highlight);
  g.addColorStop(0.6, "transparent");
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = g;
  ctx.fillRect(-w, -1, w * 2, 2);
  ctx.restore();

  // Veins and stem
  ctx.strokeStyle = vein;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 0.022;
  const top = -0.5, base = bodyH - 0.5;
  ctx.beginPath();
  ctx.moveTo(0, top + 0.06);
  ctx.lineTo(0, 0.5);
  if (shape.veins === 0) {
    // Palmate veins for the maple
    for (const a of [-1.25, -0.6, 0.6, 1.25]) {
      ctx.moveTo(0, base - 0.18);
      ctx.lineTo(Math.sin(a) * 0.36 * (w / 1), base - 0.18 - Math.cos(a) * 0.36);
    }
  } else {
    for (let i = 1; i <= shape.veins; i++) {
      const y = top + (bodyH * i) / (shape.veins + 1);
      const reach = (w / 2) * 0.62;
      ctx.moveTo(0, y + 0.06);
      ctx.lineTo(-reach, y - 0.05);
      ctx.moveTo(0, y + 0.06);
      ctx.lineTo(reach, y - 0.05);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 0.03;
  ctx.beginPath();
  ctx.moveTo(0, base - 0.02);
  ctx.lineTo(0, 0.5);
  ctx.stroke();

  return { image: c, aspect: c.width / c.height };
}

export function loadImage(url: string): Promise<Sprite | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve({ image: img, aspect: img.naturalWidth / img.naturalHeight || 1 });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

