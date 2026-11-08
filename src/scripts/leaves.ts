/* ==========================================================================
   FALLING LEAVES — plain canvas, no libraries.

   - Leaves are drawn in code (four leaf outlines with veins), or loaded from
     optional image sprites (see site.ts → leaves.spriteImages).
   - Leaves drift down, settle into piles, and burst upward when a pile is
     pressed, then drift back down and resettle.
   - The animation loop only runs while something is moving, pauses when the
     tab is hidden, and the canvas sits BEHIND page content so leaves never
     cover text or buttons.
   ========================================================================== */

type Mode = "settled" | "air" | "falling";

interface Sprite {
  image: CanvasImageSource;
  aspect: number; // width / height
}

interface Leaf {
  sprite: number;
  size: number; // height in CSS px
  mode: Mode;
  pile: number;
  // Position relative to its pile (settled) or landing target (falling): rx in [-1, 1], ry in [0, 1].
  rx: number;
  ry: number;
  // Document coordinates while moving.
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  flatten: number; // horizontal squash when resting
  // Falling path
  x0: number;
  y0: number;
  vt: number; // terminal velocity
  swayA: number;
  swayW: number;
  swayP: number;
  t: number;
}

interface Pile {
  el: HTMLElement;
  cx: number;
  gy: number; // ground line (document y)
  hw: number; // half width
  h: number; // mound height
  leaves: Leaf[];
}

export interface LeafFieldOptions {
  canvas: HTMLCanvasElement;
  pileElements: HTMLElement[];
  spriteUrls: string[];
  reducedMotion: boolean;
}

const GRAVITY = 900; // px/s² for the burst
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* --- Leaf shapes --------------------------------------------------------
   Each returns outline points; they are normalized to a 1-unit-tall box. */
type Shape = { points: () => [number, number][]; veins: number };

const SHAPES: Shape[] = [
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

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Render one leaf shape in one color to an offscreen canvas. */
function drawLeafSprite(shape: Shape, color: string, vein: string, highlight: string, px: number): Sprite {
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

function loadImage(url: string): Promise<Sprite | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve({ image: img, aspect: img.naturalWidth / img.naturalHeight || 1 });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export class LeafField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private vw = 0;
  private vh = 0;
  private sprites: Sprite[] = [];
  private piles: Pile[] = [];
  private moving: Leaf[] = [];
  private reduced: boolean;
  private small = false;
  private perPile = 30;
  private seasonLeft = 0;
  private spawnTimer = 0;
  private seasonSpawned = 0;
  private maxFalling = 12;
  private raf = 0;
  private last = 0;
  private drawQueued = false;
  private shadowColor = "";

  constructor(private opts: LeafFieldOptions) {
    this.canvas = opts.canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.reduced = opts.reducedMotion;
    this.piles = opts.pileElements.map((el) => ({ el, cx: 0, gy: 0, hw: 0, h: 0, leaves: [] }));
  }

  async init(): Promise<void> {
    this.measure();
    this.shadowColor = cssVar("--leaf-shadow");
    this.sprites = await this.buildSprites();
    if (!this.sprites.length) return;

    this.small = this.vw < 640;
    this.perPile = this.small ? 30 : 44;
    this.maxFalling = this.small ? 8 : 14;
    for (let i = 0; i < this.piles.length; i++) {
      for (let n = 0; n < this.perPile; n++) this.piles[i].leaves.push(this.makeSettled(i));
    }

    window.addEventListener("resize", () => this.measureAndDraw(), { passive: true });
    window.addEventListener("scroll", () => this.requestDraw(), { passive: true });
    new ResizeObserver(() => this.measureAndDraw()).observe(document.body);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stop();
      else this.start();
    });

    if (!this.reduced) {
      this.piles.forEach((p, i) => p.el.addEventListener("click", () => this.burst(i)));
    }
    this.draw();
  }

  /** Start a gentle fall of new leaves onto the piles. */
  beginSeason(): void {
    if (this.reduced || !this.sprites.length) return;
    this.seasonLeft = this.small ? 18 : 34;
    this.spawnTimer = 0;
    this.seasonSpawned = 0;
    this.start();
  }

  /* --- Setup ------------------------------------------------------------ */
  private async buildSprites(): Promise<Sprite[]> {
    if (this.opts.spriteUrls.length) {
      const loaded = (await Promise.all(this.opts.spriteUrls.map(loadImage))).filter(Boolean) as Sprite[];
      if (loaded.length) return loaded;
    }
    const colors = [1, 2, 3, 4, 5].map((i) => cssVar(`--leaf-${i}`)).filter(Boolean);
    const vein = cssVar("--leaf-vein");
    const highlight = cssVar("--leaf-highlight");
    const px = Math.round(48 * this.dpr);
    const out: Sprite[] = [];
    for (const shape of SHAPES) for (const color of colors) out.push(drawLeafSprite(shape, color, vein, highlight, px));
    return out;
  }

  private measure(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.vw = document.documentElement.clientWidth;
    this.vh = window.innerHeight;
    this.canvas.width = Math.round(this.vw * this.dpr);
    this.canvas.height = Math.round(this.vh * this.dpr);
    for (const p of this.piles) {
      const r = p.el.getBoundingClientRect();
      p.cx = r.left + r.width / 2 + window.scrollX;
      p.gy = r.bottom + window.scrollY - 6;
      p.hw = r.width / 2;
      p.h = r.height * 0.7;
    }
  }

  private measureAndDraw(): void {
    this.measure();
    this.requestDraw();
  }

  private pickSprite(): number {
    return Math.floor(Math.random() * this.sprites.length);
  }

  private leafSize(): number {
    return rand(16, 30) * (this.small ? 0.85 : 1);
  }

  private blankLeaf(pile: number): Leaf {
    return {
      sprite: this.pickSprite(), size: this.leafSize(), mode: "settled", pile,
      rx: 0, ry: 0, x: 0, y: 0, vx: 0, vy: 0,
      rot: rand(0, Math.PI * 2), spin: 0, flip: rand(0, Math.PI * 2), flipSpeed: rand(1, 2.4),
      flatten: rand(0.7, 1), x0: 0, y0: 0, vt: rand(36, 70),
      swayA: rand(14, 34), swayW: rand(0.7, 1.3), swayP: rand(0, Math.PI * 2), t: 0,
    };
  }

  /** A point inside a soft mound. surface=true keeps it near the top layer. */
  private moundPoint(surface: boolean): { rx: number; ry: number } {
    const u = clamp(Math.random() + Math.random() - 1, -0.98, 0.98);
    const height = Math.pow(1 - u * u, 0.85);
    const depth = surface ? rand(0.55, 1) : Math.pow(Math.random(), 0.7);
    return { rx: u, ry: height * depth };
  }

  private makeSettled(pile: number): Leaf {
    const leaf = this.blankLeaf(pile);
    Object.assign(leaf, this.moundPoint(false));
    return leaf;
  }

  /* --- Motion ----------------------------------------------------------- */
  private spawnFalling(): void {
    const pi = Math.floor(Math.random() * this.piles.length);
    const p = this.piles[pi];
    const leaf = this.blankLeaf(pi);
    Object.assign(leaf, this.moundPoint(true));
    leaf.mode = "falling";
    leaf.x0 = clamp(p.cx + rand(-1.8, 1.8) * p.hw, 10, this.vw - 10);
    leaf.y0 = window.scrollY - rand(10, 50);
    leaf.x = leaf.x0;
    leaf.y = leaf.y0;
    leaf.vy = leaf.vt;
    this.moving.push(leaf);
  }

  private burst(pi: number): void {
    const p = this.piles[pi];
    for (const leaf of p.leaves) {
      leaf.x = p.cx + leaf.rx * p.hw;
      leaf.y = p.gy - leaf.ry * p.h;
      leaf.mode = "air";
      leaf.vx = leaf.rx * 140 + rand(-90, 90);
      leaf.vy = -rand(380, 760) * (0.7 + 0.3 * leaf.ry);
      leaf.spin = rand(-7, 7);
      leaf.flipSpeed = rand(3, 7);
      leaf.vt = rand(70, 120);
      this.moving.push(leaf);
    }
    p.leaves = [];
    this.start();
  }

  private toFalling(leaf: Leaf): void {
    Object.assign(leaf, this.moundPoint(true));
    leaf.mode = "falling";
    leaf.x0 = leaf.x;
    leaf.y0 = leaf.y;
    leaf.t = 0;
    leaf.flipSpeed = rand(1, 2.4);
  }

  private land(leaf: Leaf): void {
    leaf.mode = "settled";
    const p = this.piles[leaf.pile];
    p.leaves.push(leaf);
    // Keep the leaf count capped: drop the oldest (bottom-most) leaf.
    if (p.leaves.length > this.perPile + 4) p.leaves.shift();
  }

  private update(dt: number): void {
    // New leaves for the current "season"
    if (this.seasonLeft > 0) {
      this.spawnTimer -= dt;
      const falling = this.moving.filter((l) => l.mode === "falling").length;
      if (this.spawnTimer <= 0 && falling < this.maxFalling) {
        this.spawnFalling();
        this.seasonLeft--;
        // A quick flurry first, then a slower drift.
        this.spawnTimer = this.seasonSpawned++ < 8 ? rand(0.1, 0.3) : rand(0.4, 1.1);
      }
    }

    const still: Leaf[] = [];
    for (const leaf of this.moving) {
      if (leaf.mode === "air") {
        leaf.vy += GRAVITY * dt;
        leaf.vx *= Math.exp(-1.6 * dt);
        leaf.x += leaf.vx * dt;
        leaf.y += leaf.vy * dt;
        leaf.rot += leaf.spin * dt;
        leaf.flip += leaf.flipSpeed * dt;
        if (leaf.vy > 0 && leaf.vy >= leaf.vt * 0.85) this.toFalling(leaf);
        still.push(leaf);
        continue;
      }

      // Falling: ease toward terminal speed, sway, and glide onto the landing spot.
      const p = this.piles[leaf.pile];
      const tx = p.cx + leaf.rx * p.hw;
      const ty = p.gy - leaf.ry * p.h;
      leaf.t += dt;
      leaf.vy += (leaf.vt - leaf.vy) * Math.min(1, 2.5 * dt);
      leaf.y += leaf.vy * dt;
      const span = ty - leaf.y0;
      const prog = span > 1 ? clamp((leaf.y - leaf.y0) / span, 0, 1) : 1;
      const ease = prog * prog * (3 - 2 * prog);
      const ramp = Math.min(1, leaf.t / 1.2) * (1 - prog * prog);
      const phase = leaf.swayW * leaf.t + leaf.swayP;
      leaf.x = leaf.x0 + (tx - leaf.x0) * ease + leaf.swayA * Math.sin(phase) * ramp;
      leaf.spin += (Math.cos(phase) * 0.9 * ramp - leaf.spin) * Math.min(1, 1.5 * dt);
      leaf.rot += leaf.spin * dt;
      leaf.flip += leaf.flipSpeed * dt * (1 - prog);
      if (prog >= 1) this.land(leaf);
      else still.push(leaf);
    }
    this.moving = still;
  }

  /* --- Loop ------------------------------------------------------------- */
  private start(): void {
    if (this.raf || document.hidden || this.reduced) return;
    if (!this.moving.length && this.seasonLeft <= 0) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame = (now: number): void => {
    const dt = Math.min((now - this.last) / 1000, 1 / 20);
    this.last = now;
    this.update(dt);
    this.draw();
    if (this.moving.length || this.seasonLeft > 0) this.raf = requestAnimationFrame(this.frame);
    else this.raf = 0;
  };

  private requestDraw(): void {
    if (this.raf || this.drawQueued) return;
    this.drawQueued = true;
    requestAnimationFrame(() => {
      this.drawQueued = false;
      this.draw();
    });
  }

  /* --- Drawing ---------------------------------------------------------- */
  private draw(): void {
    const { ctx, dpr } = this;
    const sy = window.scrollY;
    const sx = window.scrollX;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.piles) {
      const y = p.gy - sy;
      if (y < -p.h * 2 || y - p.h * 2 > this.vh) continue;
      // Soft shadow under the pile
      ctx.setTransform(dpr * p.hw * 1.15, 0, 0, dpr * p.h * 0.22, dpr * (p.cx - sx), dpr * y);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, this.shadowColor);
      g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      for (const leaf of p.leaves) {
        this.drawLeaf(leaf, p.cx + leaf.rx * p.hw - sx, p.gy - leaf.ry * p.h - sy, leaf.flatten);
      }
    }

    for (const leaf of this.moving) {
      const x = leaf.x - sx;
      const y = leaf.y - sy;
      if (y < -40 || y > this.vh + 40) continue;
      const flip = leaf.mode === "air" ? 0.25 + 0.75 * Math.abs(Math.cos(leaf.flip)) : 0.35 + 0.65 * Math.abs(Math.cos(leaf.flip));
      this.drawLeaf(leaf, x, y, flip);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private drawLeaf(leaf: Leaf, x: number, y: number, scaleX: number): void {
    const s = this.sprites[leaf.sprite];
    const h = leaf.size;
    const w = h * s.aspect;
    const c = Math.cos(leaf.rot), sn = Math.sin(leaf.rot), d = this.dpr;
    this.ctx.setTransform(d * c * scaleX, d * sn * scaleX, -d * sn, d * c, d * x, d * y);
    this.ctx.drawImage(s.image, -w / 2, -h / 2, w, h);
  }
}
