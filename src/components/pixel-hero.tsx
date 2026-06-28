import { useEffect, useRef } from "react";

/**
 * PixelHero
 * A canvas-rendered 8-bit animation for the hero backdrop: a spinning film
 * reel, drifting pixel particles (with mouse parallax), a pulsing play button,
 * a blinking REC dot, and CRT scanlines — all in the brand's lime palette.
 *
 * Rendered at a low internal resolution and scaled up with image-rendering:
 * pixelated for crisp, chunky pixels. Honors prefers-reduced-motion.
 */

const PRIMARY = "#9DE635"; // brand lime
const MID = "#5DA62B";
const DARKG = "#2E5417";
const WHITE = "#EAEADF";

export function PixelHero({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 6; // each art-pixel = 6 css px
    let W = 1;
    let H = 1;
    let raf = 0;
    let t = 0;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    type Particle = { x: number; y: number; z: number; s: number; c: string };
    let parts: Particle[] = [];

    const spawn = (): Particle => {
      const z = Math.random();
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z,
        s: 0.04 + z * 0.22,
        c: Math.random() < 0.25 ? PRIMARY : Math.random() < 0.55 ? MID : DARKG,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width / SCALE));
      H = Math.max(1, Math.floor(rect.height / SCALE));
      canvas.width = W;
      canvas.height = H;
      const count = Math.min(170, Math.floor((W * H) / 110));
      parts = Array.from({ length: count }, spawn);
    };

    const px = (x: number, y: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };

    const ring = (cx: number, cy: number, r: number, thick: number, c: string) => {
      const ro = r * r;
      const ri = Math.max(0, r - thick) * Math.max(0, r - thick);
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const d = x * x + y * y;
          if (d <= ro && d >= ri) px(cx + x, cy + y, c);
        }
      }
    };

    const rect = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };

    const disc = (cx: number, cy: number, r: number, c: string) => {
      const rr = r * r;
      for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++)
          if (x * x + y * y <= rr) px(cx + x, cy + y, c);
    };

    const outline = (x: number, y: number, w: number, h: number, c: string) => {
      for (let i = 1; i < w - 1; i++) {
        px(x + i, y, c);
        px(x + i, y + h - 1, c);
      }
      for (let j = 1; j < h - 1; j++) {
        px(x, y + j, c);
        px(x + w - 1, y + j, c);
      }
    };

    // a striped bar (the clapper arm), drawn from a hinge along an angle
    const stripedArm = (
      hx: number,
      hy: number,
      dx: number,
      dy: number,
      len: number,
      thick: number,
      stripeW: number,
    ) => {
      const perpX = -dy;
      const perpY = dx;
      const half = (thick - 1) / 2;
      for (let s = 0; s <= len; s++) {
        const bx = hx + dx * s;
        const by = hy + dy * s;
        const c = Math.floor(s / stripeW) % 2 === 0 ? WHITE : PRIMARY;
        for (let w = -half; w <= half; w++) px(bx + perpX * w, by + perpY * w, c);
      }
    };

    // a cute pixel clapperboard that claps; eyes track the cursor + blink
    const drawClapper = (cx: number, cy: number, bw: number, bh: number) => {
      const x0 = cx - Math.floor(bw / 2);
      const y0 = cy - Math.floor(bh / 2);

      // board body, rounded corners + outline
      rect(x0, y0, bw, bh, DARKG);
      ctx.clearRect(x0, y0, 1, 1);
      ctx.clearRect(x0 + bw - 1, y0, 1, 1);
      ctx.clearRect(x0, y0 + bh - 1, 1, 1);
      ctx.clearRect(x0 + bw - 1, y0 + bh - 1, 1, 1);
      outline(x0, y0, bw, bh, PRIMARY);

      // slate info lines (cute detail)
      rect(x0 + 3, y0 + bh - 4, Math.floor(bw * 0.42), 1, MID);
      rect(x0 + 3, y0 + bh - 7, Math.floor(bw * 0.6), 1, MID);

      // face — two eyes that track the cursor, plus a smile
      const er = Math.max(2, Math.floor(bh * 0.17));
      const eyY = y0 + Math.floor(bh * 0.42);
      const eyL = x0 + Math.floor(bw * 0.36);
      const eyR = x0 + Math.floor(bw * 0.64);
      const blinking = !reduce && t % 150 < 8;
      const gx = Math.max(-1, Math.min(1, Math.round(mouse.x)));
      const gy = Math.max(-1, Math.min(1, Math.round(mouse.y)));
      for (const ex of [eyL, eyR]) {
        if (blinking) {
          rect(ex - er, eyY, er * 2, 1, WHITE);
        } else {
          disc(ex, eyY, er, WHITE);
          px(ex + gx, eyY + gy, DARKG);
        }
      }
      // smile
      rect(eyL + 1, eyY + er + 2, eyR - eyL - 2, 1, PRIMARY);
      px(eyL, eyY + er + 1, PRIMARY);
      px(eyR, eyY + er + 1, PRIMARY);

      // clapper arm hinged at top-left — slow open, fast snap (a "clap!")
      const p = t % 160;
      let a = 0;
      if (!reduce) {
        if (p < 70) a = Math.pow(p / 70, 0.6) * 0.55;
        else if (p < 78) a = 0.55 * (1 - (p - 70) / 8);
      }
      const dirX = Math.cos(a);
      const dirY = -Math.sin(a);
      const thick = Math.max(3, Math.floor(bh * 0.16));
      const stripeW = Math.max(2, Math.floor(bw / 7));
      stripedArm(x0, y0 - 1, dirX, dirY, bw, thick, stripeW);
      ring(x0, y0 - 1, 1, 2, PRIMARY); // hinge pin
    };

    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // drifting particles with depth parallax
      for (const p of parts) {
        if (!reduce) {
          p.x -= p.s;
          if (p.x < 0) {
            p.x = W;
            p.y = Math.random() * H;
          }
        }
        px(p.x + mouse.x * p.z * 9, p.y + mouse.y * p.z * 9, p.c);
      }

      // cute pixel clapperboard (right side), gentle bob + parallax
      const bob = reduce ? 0 : Math.round(Math.sin(t * 0.05) * 2);
      const camX = Math.floor(W * 0.73) + Math.round(mouse.x * 6);
      const camY = Math.floor(H * 0.52) + bob + Math.round(mouse.y * 6);
      const bw = Math.max(18, Math.floor(Math.min(W, H) * 0.48));
      const bh = Math.floor(bw * 0.64);
      drawClapper(camX, camY, bw, bh);

      // CRT scanlines
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1);

      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ imageRendering: "pixelated", width: "100%", height: "100%", display: "block" }}
    />
  );
}
