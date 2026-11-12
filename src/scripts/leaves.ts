/* ==========================================================================
   FALLING LEAVES — plain canvas, no libraries.

   - Leaves fall continuously and collect into ONE pile across the bottom of
     the home page. The pile starts empty and grows as leaves land.
   - Pressing anywhere on the pile kicks up the leaves under the pointer (a
     clump, or a single leaf). They fly up, drift down, and stay where they land.
   - The canvas sits BEHIND page content, so leaves never cover text or buttons.
   - Performance: settled leaves are painted once into cached layers; only
     moving leaves are redrawn each frame. Paused when the tab is hidden.
   ========================================================================== */

import { SHAPES, cssVar, drawLeafSprite, loadImage, type Sprite } from "./leaf-sprites";

type Mode = "air" | "falling" | "settled";

interface Leaf {
  sprite: number;
  size: number; // height in CSS px
  mode: Mode;
  // While moving: document coordinates
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  flatten: number; // horizontal squash when resting
  vt: number; // terminal fall speed
  swayA: number;
  swayW: number;
  swayP: number;
  t: number;
  // While settled: position relative to the pile
  fx: number; // x as a fraction of the pile width
  dy: number; // y offset from the ground line (negative = above)
  peak: number; // how much this leaf raised the pile
}

export interface LeafFieldOptions {
  canvas: HTMLCanvasElement;
  bed: HTMLElement;
  spriteUrls: string[];
  reducedMotion: boolean;
}

const GRAVITY = 900; // px/s², for kicked leaves
const BIN = 4; // px per column of the pile height map
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function layer(): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const c = document.createElement("canvas");
  return { c, ctx: c.getContext("2d")! };
}

export class LeafField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private vw = 0;
  private vh = 0;
  private sprites: Sprite[] = [];

  // Pile geometry (document coordinates)
  private left = 0;
  private width = 0;
  private ground = 0;
  private maxH = 0;
  private cacheTop = 0;
  private heights = new Float32Array(0);

  private live: Leaf[] = []; // settled, can be kicked
  private baked: Leaf[] = []; // settled and buried: kept only as pixels
  private moving: Leaf[] = [];
  private bakedLayer = layer();
  private liveLayer = layer();

  private small = false;
  private maxLive = 300;
  private maxBaked = 1200;
  private maxFalling = 20;
  private falling = false;
  private spawnTimer = 0;
  private raf = 0;
  private last = 0;
  private drawQueued = false;

  constructor(private opts: LeafFieldOptions) {
    this.canvas = opts.canvas;
    this.ctx = this.canvas.getContext("2d")!;
  }

  async init(): Promise<void> {
    this.measure(true);
    this.sprites = await this.buildSprites();
    if (!this.sprites.length) return;

    if (this.opts.reducedMotion) {
      // A finished pile, drawn once. No falling, no kicking.
      for (let i = 0; i < this.maxLive; i++) this.settleAt(this.newLeaf(), this.spawnX());
    }
    this.renderLayers();

    window.addEventListener("resize", () => this.onLayoutChange(), { passive: true });
    window.addEventListener("scroll", () => this.requestDraw(), { passive: true });
    new ResizeObserver(() => this.onLayoutChange()).observe(document.body);
    document.addEventListener("visibilitychange", () => (document.hidden ? this.stop() : this.start()));

    if (!this.opts.reducedMotion) {
      this.opts.bed.addEventListener("click", (e) => this.onPress(e));
    }
    this.draw();
  }

  /** Start the never-ending leaf fall. */
  begin(): void {
    if (this.opts.reducedMotion || !this.sprites.length) return;
    this.falling = true;
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

  private measure(first = false): boolean {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.vw = document.documentElement.clientWidth;
    this.vh = window.innerHeight;
    this.canvas.width = Math.round(this.vw * this.dpr);
    this.canvas.height = Math.round(this.vh * this.dpr);

    const r = this.opts.bed.getBoundingClientRect();
    const oldWidth = this.width;
    const oldTop = this.cacheTop;
    this.left = r.left + window.scrollX;
    this.width = r.width;
    this.ground = r.bottom + window.scrollY - 4;
    this.maxH = r.height * 0.72;
    this.cacheTop = this.ground - r.height - 40;

    if (first) {
      this.small = this.vw < 640;
      this.maxLive = this.small ? 240 : 520;
      this.maxBaked = this.small ? 900 : 2000;
      this.maxFalling = this.small ? 28 : 64;
    }
    const widthChanged = Math.abs(oldWidth - this.width) > 0.5;
    if (first || widthChanged) this.rebuildHeights();
    return widthChanged || Math.abs(oldTop - this.cacheTop) > 0.5;
  }

  private onLayoutChange(): void {
    if (this.measure()) this.renderLayers();
    this.requestDraw();
  }

  /* --- Pile height map -------------------------------------------------- */
  private binOf(x: number): number {
    return clamp(Math.floor((x - this.left) / BIN), 0, this.heights.length - 1);
  }

  private heightAt(x: number): number {
    return this.heights.length ? this.heights[this.binOf(x)] : 0;
  }

  /** Add (sign 1) or remove (sign -1) a leaf's soft bump from the height map. */
  private contribute(leaf: Leaf, sign: 1 | -1): void {
    const cx = this.left + leaf.fx * this.width;
    const half = leaf.size * 0.75;
    const b0 = this.binOf(cx - half), b1 = this.binOf(cx + half);
    for (let b = b0; b <= b1; b++) {
      const d = this.left + (b + 0.5) * BIN - cx;
      if (Math.abs(d) >= half) continue;
      const amt = leaf.peak * 0.5 * (1 + Math.cos((Math.PI * d) / half));
      this.heights[b] = Math.max(0, this.heights[b] + sign * amt);
    }
  }

  private rebuildHeights(): void {
    this.heights = new Float32Array(Math.max(1, Math.ceil(this.width / BIN)));
    for (const l of this.baked) this.contribute(l, 1);
    for (const l of this.live) this.contribute(l, 1);
  }

  /* --- Leaves ----------------------------------------------------------- */
  private newLeaf(): Leaf {
    return {
      sprite: Math.floor(Math.random() * this.sprites.length),
      size: rand(16, 30) * (this.small ? 0.85 : 1),
      mode: "falling",
      x: 0, y: 0, vx: 0, vy: 0,
      rot: rand(0, Math.PI * 2), spin: 0, flip: rand(0, Math.PI * 2), flipSpeed: rand(1, 2.4),
      flatten: rand(0.7, 1), vt: rand(45, 90),
      swayA: rand(14, 34), swayW: rand(0.7, 1.3), swayP: rand(0, Math.PI * 2), t: 0,
      fx: 0, dy: 0, peak: 0,
    };
  }

  /** Where new leaves fall: across the whole width, a little heavier in the middle. */
  private spawnX(): number {
    const u = Math.random() < 0.5 ? Math.random() : (Math.random() + Math.random() + Math.random()) / 3;
    return this.left + u * this.width;
  }

  private spawn(): void {
    const leaf = this.newLeaf();
    leaf.x = this.spawnX();
    leaf.y = window.scrollY - rand(10, 50);
    leaf.vy = leaf.vt;
    this.moving.push(leaf);
  }

  /** Rest a leaf on the pile surface at (or just beside) x. */
  private settleAt(leaf: Leaf, x: number): void {
    // Slide into the lowest spot nearby, the way real leaves tuck into dips.
    const reach = leaf.size * 0.4;
    let best = clamp(x, this.left + 2, this.left + this.width - 2);
    let bestH = this.heightAt(best);
    for (let dx = -reach; dx <= reach; dx += BIN) {
      const h = this.heightAt(best + dx);
      if (h < bestH - 0.5) {
        bestH = h;
        best = best + dx;
      }
    }
    leaf.mode = "settled";
    leaf.fx = (best - this.left) / this.width;
    leaf.dy = -bestH + leaf.size * 0.2;
    const base = leaf.size * 0.42;
    leaf.peak = base * clamp((this.maxH - bestH) / base, 0, 1);
    this.contribute(leaf, 1);
    this.live.push(leaf);

    // Keep the kickable set capped: bury the oldest leaf into the baked layer.
    if (this.live.length > this.maxLive) {
      const old = this.live.shift()!;
      this.baked.push(old);
      this.paintSettled(this.bakedLayer.ctx, old);
      if (this.baked.length > this.maxBaked) this.baked.shift();
    }
  }

  private land(leaf: Leaf): void {
    this.settleAt(leaf, leaf.x);
    this.paintSettled(this.liveLayer.ctx, leaf);
  }

  private onPress(e: MouseEvent): void {
    // Keyboard presses (Enter/Space) arrive with detail 0: kick a random spot.
    let px: number, py: number;
    if (e.detail === 0) {
      px = this.left + rand(0.15, 0.85) * this.width;
      py = this.ground - this.heightAt(px) + 6;
      this.kick(px, py, 60);
    } else {
      px = e.clientX + window.scrollX;
      py = e.clientY + window.scrollY;
      this.kick(px, py, this.small ? 24 : 28);
    }
  }

  private kick(px: number, py: number, radius: number): void {
    const pos = (l: Leaf) => [this.left + l.fx * this.width, this.ground + l.dy] as const;
    let hits = this.live.filter((l) => {
      const [x, y] = pos(l);
      return Math.hypot(x - px, y - py) < radius + l.size * 0.3;
    });
    if (!hits.length) {
      // Nothing right under the pointer: take the nearest leaf if it's close.
      let best: Leaf | null = null, bestD = radius * 2.2;
      for (const l of this.live) {
        const [x, y] = pos(l);
        const d = Math.hypot(x - px, y - py);
        if (d < bestD) (bestD = d), (best = l);
      }
      if (!best) return;
      hits = [best];
    }

    const set = new Set(hits);
    this.live = this.live.filter((l) => !set.has(l));
    for (const l of hits) {
      this.contribute(l, -1);
      const [x, y] = pos(l);
      const dx = x - px, dy = y - py, d = Math.hypot(dx, dy) || 1;
      l.x = x;
      l.y = y;
      l.mode = "air";
      l.vx = (dx / d) * rand(80, 220) + rand(-50, 50);
      l.vy = -rand(320, 640) * (0.65 + 0.35 * Math.random());
      l.spin = rand(-7, 7);
      l.flipSpeed = rand(3, 7);
      l.vt = rand(70, 120);
      this.moving.push(l);
    }
    this.renderLiveLayer();
    this.start();
  }

  private update(dt: number): void {
    if (this.falling) {
      this.spawnTimer -= dt;
      let fallingCount = 0;
      for (const l of this.moving) if (l.mode === "falling") fallingCount++;
      if (this.spawnTimer <= 0 && fallingCount < this.maxFalling) {
        this.spawn();
        this.spawnTimer = rand(0.06, 0.22);
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
        this.bounceOffEdges(leaf);
        if (leaf.vy > 0 && leaf.vy >= leaf.vt * 0.85) {
          leaf.mode = "falling";
          leaf.t = 0;
          leaf.flipSpeed = rand(1, 2.4);
        }
        still.push(leaf);
        continue;
      }

      // Falling: ease toward terminal speed with a gentle side-to-side sway.
      leaf.t += dt;
      leaf.vy += (leaf.vt - leaf.vy) * Math.min(1, 2.5 * dt);
      leaf.vx *= Math.exp(-2 * dt);
      const ramp = Math.min(1, leaf.t / 1.2);
      const phase = leaf.swayW * leaf.t + leaf.swayP;
      leaf.x += (leaf.vx + leaf.swayA * leaf.swayW * Math.cos(phase) * ramp) * dt;
      leaf.y += leaf.vy * dt;
      leaf.spin += (Math.cos(phase) * 0.9 * ramp - leaf.spin) * Math.min(1, 1.5 * dt);
      leaf.rot += leaf.spin * dt;
      leaf.flip += leaf.flipSpeed * dt;
      this.bounceOffEdges(leaf);

      if (leaf.y >= this.ground - this.heightAt(leaf.x) + leaf.size * 0.2) this.land(leaf);
      else still.push(leaf);
    }
    this.moving = still;
  }

  private bounceOffEdges(leaf: Leaf): void {
    const lo = this.left + 6, hi = this.left + this.width - 6;
    if (leaf.x < lo) (leaf.x = lo), (leaf.vx = Math.abs(leaf.vx) * 0.3);
    if (leaf.x > hi) (leaf.x = hi), (leaf.vx = -Math.abs(leaf.vx) * 0.3);
  }

  /* --- Loop ------------------------------------------------------------- */
  private start(): void {
    if (this.raf || document.hidden || this.opts.reducedMotion) return;
    if (!this.falling && !this.moving.length) return;
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
    this.raf = this.falling || this.moving.length ? requestAnimationFrame(this.frame) : 0;
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
  private sizeLayer(l: { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D }): void {
    l.c.width = Math.max(1, Math.round(this.width * this.dpr));
    l.c.height = Math.max(1, Math.round((this.ground - this.cacheTop + 40) * this.dpr));
    l.ctx.setTransform(1, 0, 0, 1, 0, 0);
    l.ctx.clearRect(0, 0, l.c.width, l.c.height);
  }

  /** Draw a settled leaf into a cached layer. */
  private paintSettled(ctx: CanvasRenderingContext2D, leaf: Leaf): void {
    this.drawLeaf(ctx, leaf, leaf.fx * this.width, this.ground + leaf.dy - this.cacheTop, leaf.flatten);
  }

  private renderLayers(): void {
    const b = this.bakedLayer;
    this.sizeLayer(b);
    // One soft shadow along the whole ground line, so the pile reads as one.
    const h = this.ground - this.cacheTop;
    b.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const top = h - this.maxH * 0.45, bottom = h + 30;
    const g = b.ctx.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, "transparent");
    g.addColorStop((h - top) / (bottom - top), cssVar("--leaf-shadow"));
    g.addColorStop(1, "transparent");
    b.ctx.globalAlpha = 0.7;
    b.ctx.fillStyle = g;
    b.ctx.fillRect(0, top, this.width, bottom - top);
    b.ctx.globalAlpha = 1;
    for (const l of this.baked) this.paintSettled(b.ctx, l);
    this.renderLiveLayer();
  }

  private renderLiveLayer(): void {
    this.sizeLayer(this.liveLayer);
    for (const l of this.live) this.paintSettled(this.liveLayer.ctx, l);
  }

  private draw(): void {
    const { ctx, dpr } = this;
    const sx = window.scrollX, sy = window.scrollY;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const top = this.cacheTop - sy;
    if (top < this.vh && top + this.bakedLayer.c.height / dpr > 0) {
      const x = Math.round((this.left - sx) * dpr), y = Math.round(top * dpr);
      ctx.drawImage(this.bakedLayer.c, x, y);
      ctx.drawImage(this.liveLayer.c, x, y);
    }

    for (const leaf of this.moving) {
      const y = leaf.y - sy;
      if (y < -40 || y > this.vh + 40) continue;
      const flip = (leaf.mode === "air" ? 0.25 : 0.35) + 0.65 * Math.abs(Math.cos(leaf.flip));
      this.drawLeaf(ctx, leaf, leaf.x - sx, y, flip);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf, x: number, y: number, scaleX: number): void {
    const s = this.sprites[leaf.sprite];
    const h = leaf.size;
    const w = h * s.aspect;
    const c = Math.cos(leaf.rot), sn = Math.sin(leaf.rot), d = this.dpr;
    ctx.setTransform(d * c * scaleX, d * sn * scaleX, -d * sn, d * c, d * x, d * y);
    ctx.drawImage(s.image, -w / 2, -h / 2, w, h);
  }
}
