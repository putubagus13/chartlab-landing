"use client";

// Adapted from "Helix Chrono Matrix" (21st.dev). Ported to this project: transparent canvas that sits on the
// page background, colours from the brand (neutral lines, green-to-yellow when touched), no headline,
// no controls: the shape changes on its own every few seconds, and it stops drawing (and cycling) when
// off screen or the tab is hidden. Visitors who ask for reduced motion get one still frame.

import * as React from "react";
import { useReducedMotion } from "framer-motion";

type Mode = "helix" | "neural" | "ribbons";
const MODES: Mode[] = ["helix", "neural", "ribbons"];

type Rgb = [number, number, number];
type Ring = {
  radius: number;
  yOffset: number;
  speed: number;
  angle: number;
  harmonic: number;
  vy: Float32Array;
  excite: Float32Array;
};
type Particle = { ring: number; progress: number; speed: number; size: number };

const POINTS = 120;
const RINGS = 28;
const PARTICLES = 45;
const FOV = 600;
const CAMERA = 550;

const PALETTE: Record<"dark" | "light", { fg: Rgb; from: Rgb; to: Rgb }> = {
  dark: { fg: [245, 245, 245], from: [63, 163, 127], to: [255, 211, 63] },
  // the yellow is a touch deeper on white so it still reads as a line
  light: { fg: [10, 10, 10], from: [18, 66, 50], to: [230, 176, 0] },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: Rgb, b: Rgb, t: number) =>
  `${Math.round(lerp(a[0], b[0], t))}, ${Math.round(lerp(a[1], b[1], t))}, ${Math.round(lerp(a[2], b[2], t))}`;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/** Where a ring point sits in 3D for a given shape. Writes into `out` (x, y, z) so the frame loop allocates nothing. */
function place(
  mode: Mode,
  ring: Ring,
  theta: number,
  time: number,
  out: Float32Array
) {
  let x = Math.cos(theta) * ring.radius;
  const z = Math.sin(theta) * ring.radius;
  let y = ring.yOffset;
  if (mode === "helix") {
    y += Math.sin(theta * 2 + time * 2 + ring.harmonic) * 45;
  } else if (mode === "neural") {
    x += Math.sin(y * 0.02 + time * 1.5) * 35;
    y += Math.cos(theta * 3 + time) * 30;
  } else {
    x *= 1 + Math.sin(theta * 4 + time * 1.2) * 0.15;
    y += Math.sin(x * 0.008 + time * 2) * 50;
  }
  out[0] = x;
  out[1] = y;
  out[2] = z;
}

type Props = {
  dark: boolean;
  label: string;
  /** How long each shape stays before the next one morphs in. */
  intervalMs?: number;
  className?: string;
};

export function HelixField({ dark, label, intervalMs = 6000, className = "" }: Props) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = !!useReducedMotion();

  const [mode, setMode] = React.useState<Mode>("helix");
  const [running, setRunning] = React.useState(true);
  const [visible, setVisible] = React.useState(true);
  const [tabShown, setTabShown] = React.useState(true);

  // Visitors who ask for reduced motion get one still frame and no shape changes.
  React.useEffect(() => {
    if (reduced) setRunning(false);
  }, [reduced]);

  React.useEffect(() => {
    const onVis = () => setTabShown(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) =>
      setVisible(es[es.length - 1].isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // everything the draw loop reads lives in refs, so changing theme or shape never restarts the canvas
  const live = React.useRef({
    dark,
    mode,
    from: mode,
    transition: 1,
    time: 0,
    w: 0,
    h: 0,
    pointer: { x: -2000, y: -2000, tx: -2000, ty: -2000 },
    rings: [] as Ring[],
    particles: [] as Particle[],
  });
  live.current.dark = dark;
  const draw = React.useRef<() => void>(() => {}); // paint the current state
  const step = React.useRef<() => void>(() => {}); // advance one frame, then paint

  const nextMode = React.useCallback(() => {
    const s = live.current;
    const next = MODES[(MODES.indexOf(s.mode) + 1) % MODES.length];
    s.from = s.mode;
    s.mode = next;
    s.transition = 0;
    setMode(next);
  }, []);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = live.current;
    const a = new Float32Array(3);
    const b = new Float32Array(3);

    const init = () => {
      const base = Math.min(s.w, s.h);
      s.rings = Array.from({ length: RINGS }, (_, r) => {
        const p = r / RINGS;
        return {
          radius: base * 0.35 * (0.4 + p * 0.6),
          yOffset: (p - 0.5) * (s.h * 0.45),
          speed: (r % 2 === 0 ? 1 : -1) * (0.002 + p * 0.0025),
          angle: (r * Math.PI) / RINGS,
          harmonic: r * 0.2,
          vy: new Float32Array(POINTS),
          excite: new Float32Array(POINTS),
        };
      });
      s.particles = Array.from({ length: PARTICLES }, () => ({
        ring: Math.floor(Math.random() * RINGS),
        progress: Math.random(),
        speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.5 + 1.5,
      }));
    };

    /** advance = false draws the current state without moving it (used when paused). */
    const render = (advance: boolean) => {
      const { w, h, pointer, rings, particles } = s;
      if (!w || !h) return;
      const pal = PALETTE[s.dark ? "dark" : "light"];
      const radius = Math.min(w, h) * 0.4;
      if (advance) {
        s.time += 0.012;
        if (s.transition < 1) s.transition = Math.min(1, s.transition + 0.02); // ~0.8 s morph
        pointer.x += (pointer.tx - pointer.x) * 0.1;
        pointer.y += (pointer.ty - pointer.y) * 0.1;
      }
      const k = ease(s.transition);
      const cx = w / 2;
      const cy = h / 2;
      const project = (ring: Ring, theta: number) => {
        place(s.from, ring, theta, s.time, a);
        place(s.mode, ring, theta, s.time, b);
        const x = lerp(a[0], b[0], k);
        const y = lerp(a[1], b[1], k);
        const z = lerp(a[2], b[2], k);
        return { x, y, scale: FOV / (CAMERA + z) };
      };

      ctx.clearRect(0, 0, w, h);

      for (let r = 0; r < rings.length; r++) {
        const ring = rings[r];
        if (advance) ring.angle += ring.speed;
        ctx.beginPath();
        let fx = 0;
        let fy = 0;
        let excite = 0;
        for (let i = 0; i < POINTS; i++) {
          const theta = (i / POINTS) * Math.PI * 2 + ring.angle;
          const q = project(ring, theta);
          const px = cx + q.x * q.scale;
          const py = cy + (q.y + ring.vy[i]) * q.scale;
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (advance) {
            if (dist < radius && dist > 0) {
              const ratio = 1 - dist / radius;
              ring.vy[i] +=
                (Math.sin(theta + s.time) * ratio * 15 - ring.vy[i]) * 0.1;
              ring.excite[i] = Math.max(ring.excite[i], ratio);
            } else {
              ring.vy[i] *= 0.92;
            }
            ring.excite[i] *= 0.92;
          }
          excite += ring.excite[i];
          if (i === 0) {
            fx = px;
            fy = py;
            ctx.moveTo(px, py);
          } else ctx.lineTo(px, py);
        }
        ctx.lineTo(fx, fy);
        excite /= POINTS;
        if (excite > 0.05) {
          ctx.strokeStyle = `rgba(${mix(pal.from, pal.to, Math.min(1, excite * 1.6))}, ${Math.min(1, 0.4 + excite * 0.6)})`;
          ctx.lineWidth = 1.2 + excite * 1.5;
        } else {
          ctx.strokeStyle = `rgba(${pal.fg.join(", ")}, ${(0.15 + (r / rings.length) * 0.45) * 0.6})`;
          ctx.lineWidth = 0.75;
        }
        ctx.stroke();
      }

      // dots riding the lines, green at the back to yellow at the front; they swell near the cursor
      for (const p of particles) {
        if (advance) p.progress = (p.progress + p.speed + 1) % 1;
        const ring = rings[p.ring];
        if (!ring) continue;
        const q = project(ring, p.progress * Math.PI * 2 + ring.angle);
        const px = cx + q.x * q.scale;
        const py = cy + q.y * q.scale;
        const near = Math.hypot(px - pointer.x, py - pointer.y) < radius;
        const col = mix(pal.from, pal.to, p.ring / rings.length);
        const size = p.size * q.scale * (near ? 1.7 : 1);
        ctx.beginPath();
        ctx.arc(px, py, size * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col}, ${near ? 0.28 : 0.14})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${col})`;
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.w = rect.width;
      s.h = rect.height;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
      render(false);
    };

    draw.current = () => render(false);
    step.current = () => render(true);
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(wrap);
    resize();
    return () => ro?.disconnect();
  }, []);

  const active = running && visible && tabShown;
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext("2d")) return;
    if (!active) {
      draw.current();
      return;
    }
    let id = 0;
    const tick = () => {
      step.current();
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active]);

  // rotate through the shapes while the animation is actually running
  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(nextMode, intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs, nextMode]);

  // redraw a still frame when the theme flips while paused
  React.useEffect(() => {
    draw.current();
  }, [dark]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    live.current.pointer.tx = e.clientX - r.left;
    live.current.pointer.ty = e.clientY - r.top;
  };
  const onLeave = () => {
    live.current.pointer.tx = -2000;
    live.current.pointer.ty = -2000;
  };

  return (
    <div
      ref={wrapRef}
      data-mode={mode}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative aspect-square w-full max-w-[34rem] ${className}`}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className="absolute inset-0 block h-full w-full cursor-crosshair"
      />
    </div>
  );
}
