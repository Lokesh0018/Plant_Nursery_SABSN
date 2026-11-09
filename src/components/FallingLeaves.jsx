import React, { useEffect, useRef } from 'react';

/*
 * Falling leaves on a canvas.
 *  - Leaf sprites (3 shapes × palette) are pre-rendered once with shading and veins; per frame is drawImage only.
 *  - Each leaf has a depth: near leaves are larger, faster and brighter; far ones small, slow and dim.
 *  - Most leaves shed from the canopy band, the rest drift in from above the viewport.
 *  - A slow wind that gusts over time, plus a light scatter when the cursor sweeps past.
 *  - Pauses off-screen / hidden tab; renders nothing under prefers-reduced-motion.
 */
const PALETTE = [
  ['#b7d46a', '#7fa84a'], // fresh lime
  ['#8fc06a', '#4f7f3a'], // mid green
  ['#6a994e', '#3e6b32'], // deep green
  ['#d9c36a', '#a98b3c'], // yellowing
  ['#d4a373', '#9c6b3c'], // dry tan
  ['#c97b4b', '#8a4b26'], // rust
];
const SPRITE = 72; // px, drawn at 2x for crispness when scaled down

function leafPath(ctx, kind, s) {
  ctx.beginPath();
  if (kind === 0) {
    // banyan: broad oval with a drip tip
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.7, s * 0.9, s * 0.45, 0, s * 1.05);
    ctx.bezierCurveTo(-s * 0.9, s * 0.45, -s * 0.95, -s * 0.7, 0, -s);
  } else if (kind === 1) {
    // slender willow-like
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.55, -s * 0.1, 0, s);
    ctx.quadraticCurveTo(-s * 0.55, -s * 0.1, 0, -s);
  } else {
    // classic elliptic leaf: even curve both sides, pointed at both ends
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.75, -s * 0.55, s * 0.75, s * 0.55, 0, s);
    ctx.bezierCurveTo(-s * 0.75, s * 0.55, -s * 0.75, -s * 0.55, 0, -s);
  }
  ctx.closePath();
}

function makeSprite(kind, [light, dark]) {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE * 2;
  const g = c.getContext('2d');
  const s = SPRITE * 0.8;
  g.translate(SPRITE, SPRITE);
  leafPath(g, kind, s);
  const grad = g.createLinearGradient(-s * 0.6, -s, s * 0.6, s);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g.fillStyle = grad;
  g.fill();
  // soft highlight down one side
  g.save();
  g.clip();
  const hl = g.createRadialGradient(-s * 0.35, -s * 0.4, 0, -s * 0.35, -s * 0.4, s * 1.1);
  hl.addColorStop(0, 'rgba(255,255,255,0.28)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hl;
  g.fillRect(-s * 2, -s * 2, s * 4, s * 4);
  g.restore();
  // midrib + side veins
  g.strokeStyle = 'rgba(20, 40, 15, 0.35)';
  g.lineWidth = s * 0.06;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(0, -s * 0.85);
  g.lineTo(0, s * 0.9);
  g.stroke();
  g.lineWidth = s * 0.035;
  for (let i = -0.5; i <= 0.5; i += 0.25) {
    g.beginPath();
    g.moveTo(0, i * s);
    g.lineTo(s * 0.45, i * s + s * 0.28);
    g.moveTo(0, i * s);
    g.lineTo(-s * 0.45, i * s + s * 0.28);
    g.stroke();
  }
  return c;
}

export default function FallingLeaves({ count = 26, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sprites = PALETTE.flatMap((pal) => [0, 1, 2].map((k) => makeSprite(k, pal)));

    let w = 0;
    let h = 0;
    let leaves = [];
    let raf = 0;
    let running = true;
    let last = performance.now();
    let time = 0;
    const mouse = { x: -1e4, y: -1e4, vx: 0, vy: 0 };

    const rand = (a, b) => a + Math.random() * (b - a);
    const spawn = (initial) => {
      const z = Math.random(); // depth 0 far → 1 near
      const fromCanopy = Math.random() < 0.7;
      return {
        z,
        sprite: sprites[(Math.random() * sprites.length) | 0],
        x: fromCanopy ? rand(0.3, 0.74) * w : rand(-0.05, 1.05) * w,
        y: initial ? rand(0.05, 0.95) * h : fromCanopy ? rand(0.12, 0.42) * h : rand(-0.25, -0.05) * h,
        size: (7 + z * 13) * (w < 900 ? 0.8 : 1), // half-height in px
        vy: 18 + z * 42,
        drift: rand(-6, 6),
        sway: rand(0.5, 1.3),
        swayAmp: 8 + z * 22,
        phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        rotV: rand(-1.6, 1.6),
        tilt: rand(0, Math.PI * 2),
        tiltV: rand(0.9, 2.4),
        alpha: 0.35 + z * 0.6,
        px: 0, // impulse from the cursor
        py: 0,
        born: initial ? -5 : 0,
      };
    };

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 900 ? Math.round(count * 0.5) : count;
      leaves = Array.from({ length: n }, () => spawn(true)).sort((a, b) => a.z - b.z); // draw far → near
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      // wind: slow swell + occasional gust
      const wind = Math.sin(time * 0.35) * 14 + Math.max(0, Math.sin(time * 0.9 + 1.7)) ** 3 * 38;
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      ctx.clearRect(0, 0, w, h);
      const fadeStart = h * 0.78;
      for (const l of leaves) {
        l.born += dt;
        // cursor scatter: push leaves within 120px along the cursor's motion
        const dx = l.x - mouse.x;
        const dy = l.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 120 * 120) {
          const f = (1 - Math.sqrt(dist2) / 120) * (0.4 + l.z);
          l.px += (mouse.vx * 0.12 + dx * 0.6) * f * dt * 8;
          l.py += (mouse.vy * 0.12 + dy * 0.6) * f * dt * 8;
          l.rotV += (Math.random() - 0.5) * f * 6 * dt * 10;
        }
        l.px *= 0.92;
        l.py *= 0.92;
        l.rotV = Math.max(-3, Math.min(3, l.rotV * 0.995));

        l.y += (l.vy + l.py) * dt;
        l.x += (l.drift + wind * (0.4 + l.z * 0.8) + Math.cos(time * l.sway + l.phase) * l.swayAmp + l.px) * dt;
        l.rot += l.rotV * dt;
        l.tilt += l.tiltV * dt;

        if (l.y > h + 30 || l.x < -60 || l.x > w + 60) Object.assign(l, spawn(false));

        const fadeIn = Math.min(1, l.born / 1.2);
        const fadeOut = l.y > fadeStart ? Math.max(0, 1 - (l.y - fadeStart) / (h - fadeStart)) : 1;
        const flip = Math.cos(l.tilt);
        ctx.save();
        ctx.globalAlpha = l.alpha * fadeIn * fadeOut;
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rot);
        ctx.scale(Math.max(0.12, Math.abs(flip)), 1);
        const d = l.size * 2;
        ctx.drawImage(l.sprite, -d / 2, -d / 2, d, d);
        ctx.restore();
      }
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (mouse.x > -1e3) {
        mouse.vx = (x - mouse.x) * 60;
        mouse.vy = (y - mouse.y) * 60;
      }
      mouse.x = x;
      mouse.y = y;
    };
    const onLeave = () => { mouse.x = -1e4; mouse.y = -1e4; };
    const host = canvas.parentElement.parentElement; // the hero section
    host.addEventListener('mousemove', onMove, { passive: true });
    host.addEventListener('mouseleave', onLeave);

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !document.hidden;
      last = performance.now();
    });
    io.observe(canvas);
    const onVis = () => { running = !document.hidden; last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
