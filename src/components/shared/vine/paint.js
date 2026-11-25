import { SHEET, SPRITES } from './sprites';

/*
 * The golden trumpet creeper (Allamanda cathartica, the yellow creeper the nursery grows), painted on a
 * canvas from rendered drawings.
 *
 * Every leaf, bud and flower is a small picture cut from one sheet (allamanda.webp). They were rendered as
 * real 3D surfaces under one light, the sun high and in front, so they share their shading and can overlap
 * like the real plant. A leaf is lit differently depending on which way it points, so the sheet holds each
 * part at several headings: the painter takes the nearest one and turns it the last few degrees. The light
 * is centred, so a drawing that points right also serves, mirrored, for one that points left.
 *
 * A vine is planted once into a list of things to paint (stems, stalks, drawings), each with the moment it
 * appears, and `paint` draws that list as it stands at a given time, which is how a band grows.
 */

const RAD = Math.PI / 180;
const wrap = (a) => ((((a + 180) % 360) + 360) % 360) - 180; // to -180..180

// small seeded generator (mulberry32 over an FNV hash of the seed text), so growth is varied but repeatable
function rng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- the sheet -------------------------------------------------------------------------------------------
// Loaded once for the page and shared by every vine on it. It is fetched after the page's own load, so it
// never competes with the first screen. A canvas has no mipmaps: a leaf drawn at a third of its size on the
// sheet would shimmer, so half- and quarter-size copies are kept and each drawing reads from the nearest.
let sheet;
export function loadSheet() {
  if (!sheet) {
    sheet = new Promise((resolve, reject) => {
      const fetchIt = () => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          const levels = [img];
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          for (let i = 0; i < 2; i++) {
            w /= 2;
            h /= 2;
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const g = c.getContext('2d');
            g.imageSmoothingQuality = 'high';
            g.drawImage(levels[i], 0, 0, w, h);
            levels.push(c);
          }
          resolve(levels);
        };
        img.onerror = reject;
        img.src = SHEET;
      };
      if (document.readyState === 'complete') fetchIt();
      else {
        let started = false;
        const once = () => { if (!started) { started = true; fetchIt(); } };
        window.addEventListener('load', once, { once: true });
        setTimeout(once, 2500); // a slow page should not keep its vines waiting for long
      }
    });
    sheet.catch(() => { sheet = undefined; }); // a failed download can be tried again by the next vine
  }
  return sheet;
}

// --- choosing and placing drawings -----------------------------------------------------------------------
// The drawing of `kind` whose heading is nearest to `heading` (degrees clockwise from +x, as the canvas
// measures them), chosen at random among those about equally near; `turn` is the rotation still to apply.
function pick(kind, heading, rand) {
  const { unit, list } = SPRITES[kind];
  const a = wrap(heading);
  const mirror = Math.abs(a) > 90; // points left: the right-pointing drawing, mirrored
  const local = mirror ? wrap(180 - a) : a;
  let best = Infinity;
  for (let i = 0; i < list.length; i++) best = Math.min(best, Math.abs(list[i][0] - local));
  const near = list.filter((s) => Math.abs(s[0] - local) <= best + 9);
  const s = near[Math.floor(rand() * near.length)];
  return { s, unit, mirror, turn: local - s[0] };
}

// how far a placed drawing reaches above and below its foot
function rise(it) {
  const [, , , w, h, ax, ay] = it.s;
  const c = Math.cos(it.turn * RAD) * it.k;
  const s = Math.sin(it.turn * RAD) * it.k;
  const ys = [-ax * s - ay * c, (w - ax) * s - ay * c, -ax * s + (h - ay) * c, (w - ax) * s + (h - ay) * c];
  return [Math.min(...ys), Math.max(...ys)];
}

// A drawing of `kind` with its foot at (x, y), `size` screen pixels to the model unit, pointing as near to
// `heading` as the band allows: it is turned toward the horizontal until it no longer overflows the band
// (which clips what leaves it).
function place(kind, x, y, heading, size, rand, height) {
  let a = heading;
  let it;
  for (let n = 0; n < 12; n++) {
    const p = pick(kind, a, rand);
    it = { s: p.s, k: size / p.unit, x, y, turn: p.turn, mirror: p.mirror };
    const [top, bottom] = rise(it);
    if (y + top > -1 && y + bottom < height + 1) break; // (each drawing has a few pixels of soft shadow to spare)
    const level = wrap((Math.cos(a * RAD) < 0 ? 180 : 0) - a); // shortest way to level
    if (Math.abs(level) < 1) break;
    a += Math.sign(level) * Math.min(Math.abs(level), 8);
  }
  return it;
}

// sizes at scale 1, in screen pixels per model unit
const LEAF = 33.5;   // length of a full-grown blade
const YOUNG = 24;
const BLOOM = 14.8;  // radius of an open flower's face
const BUD = 10.6;
const BUDLET = 9.6;
// how each kind opens: duration (the timeline runs 0..1) and how far it overshoots before settling
const OPEN = {
  leaf: { dur: 0.12, over: 2.2 },
  bloom: { dur: 0.2, over: 1.6 },
  trumpet: { dur: 0.16, over: 2 },
  bud: { dur: 0.11, over: 2 },
};

// --- stems -----------------------------------------------------------------------------------------------
// One vine's centreline as a function of the distance run from the screen edge: a relaxed wave that calms
// toward the centre, with a faster, fainter wobble over it so no two bends match. `phase` flips the wave
// and `segs` sets how many bends it makes (fewer on phones, so the curve stays relaxed instead of zigzagging).
function traceStem({ width, mirror, y, amp, segs, inset, phase, wobble }) {
  const dir = mirror ? -1 : 1;
  const x0 = mirror ? width + 12 : -12;
  const len = Math.max(40, width / 2 - inset + 12);
  const yAt = (u) => {
    const t = u / len;
    const wave = Math.sin(Math.PI * (segs * t + phase)) + 0.17 * Math.sin(Math.PI * segs * 2.3 * t + wobble) * Math.sin(Math.PI * t);
    return y - amp * (1 - 0.5 * t) * wave;
  };
  // position and heading (degrees) at distance u
  const at = (u) => ({ x: x0 + dir * u, y: yAt(u), ang: Math.atan2(yAt(u + 0.5) - yAt(u - 0.5), dir) / RAD });
  return { len, dir, at };
}

// The stem as a strip of cross-sections: where each is, which way is up across it, and its half-width.
// The width tapers from w0 to w1, is never quite even, and swells a little at every node.
function stemStrip(stem, w0, w1, nodes, rand) {
  const n = Math.max(8, Math.round(stem.len / 4));
  const p1 = rand() * 6.28;
  const p2 = rand() * 6.28;
  const strip = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * stem.len;
    const p = stem.at(u);
    let w = w1 + (w0 - w1) * (1 - i / n) ** 1.2;
    w *= 1 + 0.07 * Math.sin(u * 0.19 + p1) + 0.05 * Math.sin(u * 0.47 + p2);
    for (let j = 0; j < nodes.length; j++) w *= 1 + 0.3 * Math.exp(-(((u - nodes[j]) / 3.2) ** 2));
    strip.push({ x: p.x, y: p.y, nx: stem.dir * Math.sin(p.ang * RAD), ny: -stem.dir * Math.cos(p.ang * RAD), w });
  }
  return strip;
}

// A band along the strip. `shift` slides it toward the lit, upper side and `part` narrows it (both as
// fractions of the local half-width): the stem's shaded body, its lit face and its highlight are all cut
// from the same curve, which is what makes it read as round.
function ribbon(strip, shift = 0, part = 1) {
  const path = new Path2D();
  for (let i = 0; i < strip.length; i++) {
    const c = strip[i];
    const x = c.x + c.nx * c.w * (shift + part);
    const y = c.y + c.ny * c.w * (shift + part);
    if (i) path.lineTo(x, y); else path.moveTo(x, y);
  }
  for (let i = strip.length - 1; i >= 0; i--) {
    const c = strip[i];
    path.lineTo(c.x + c.nx * c.w * (shift - part), c.y + c.ny * c.w * (shift - part));
  }
  path.closePath();
  return path;
}

// Bark: short flecks along the older, woody part of a stem, and a fine ring below each node.
function barkMarks(strip, stem, nodes, woody, rand) {
  const dark = new Path2D();
  const pale = new Path2D();
  const last = strip.length - 1;
  const count = Math.round((stem.len * woody) / 9);
  for (let i = 0; i < count; i++) {
    const f = rand() * woody * (0.4 + 0.6 * rand());
    const c = strip[Math.min(last, Math.round(f * last))];
    const across = (rand() * 2 - 1) * 0.7;
    const half = (1.2 + rand() * 2.4) * 0.5;
    const x = c.x + c.nx * c.w * across;
    const y = c.y + c.ny * c.w * across;
    const path = rand() < 0.6 ? dark : pale;
    path.moveTo(x - c.ny * half * stem.dir, y + c.nx * half * stem.dir);
    path.lineTo(x + c.ny * half * stem.dir, y - c.nx * half * stem.dir);
  }
  const rings = new Path2D();
  for (let j = 0; j < nodes.length; j++) {
    const c = strip[Math.min(last, Math.round((Math.max(0, nodes[j] - 2.2) / stem.len) * last))];
    rings.moveTo(c.x + c.nx * c.w * 0.95, c.y + c.ny * c.w * 0.95);
    rings.lineTo(c.x - c.nx * c.w * 0.95, c.y - c.ny * c.w * 0.95);
  }
  return { dark, pale, rings };
}

// colours along a stem, from the screen edge to the growing tip: [shaded body, lit face, highlight]
const WOODY = [
  ['#3b2f1c', '#3c4122', '#2f5426', '#3a6f2c'],
  ['#7a6744', '#74733d', '#5a8838', '#78aa4a'],
  ['#a5916a', '#9f9f5e', '#86b157', '#a6cd70'],
];
const STOPS = [0, 0.3, 0.68, 1];
// a stem further back: green throughout, deeper and flatter
const DISTANT = ['#25452a', '#416c39', '#628c4c'];

function along(g, from, to, colours) {
  const fill = g.createLinearGradient(from, 0, to, 0);
  colours.forEach((c, i) => fill.addColorStop(STOPS[i], c));
  return fill;
}

function paintStem(g, o, t) {
  const p = t >= o.at + o.dur ? 1 : (t - o.at) / o.dur;
  if (p <= 0) return;
  g.save();
  if (p < 1) {
    // the stem is wiped in from the screen edge, fast at first and slowing toward its tip
    const run = o.run * (1 - (1 - p) ** 2);
    g.beginPath();
    g.rect(o.mirror ? o.edge - run : o.edge, -60, run, o.height + 120);
    g.clip();
  }
  if (!o.fills) {
    o.fills = o.tones === WOODY
      ? WOODY.map((c) => along(g, o.edge, o.tip, c))
      : o.tones;
  }
  // its shadow on whatever lies behind, then the round stem: shaded body, lit face, highlight, and a
  // thread of light bounced back up along its underside
  g.fillStyle = 'rgba(10, 26, 16, 0.15)';
  g.translate(0, o.drop);
  g.fill(o.body);
  g.fillStyle = 'rgba(10, 26, 16, 0.06)';
  g.translate(0, o.drop * 0.7);
  g.fill(o.body);
  g.translate(0, -o.drop * 1.7);
  g.fillStyle = o.fills[0];
  g.fill(o.body);
  g.fillStyle = o.fills[1];
  g.fill(o.face);
  g.fillStyle = o.fills[2];
  g.fill(o.light);
  g.fillStyle = 'rgba(250, 247, 222, 0.5)';
  g.fill(o.glint);
  g.fillStyle = 'rgba(176, 190, 110, 0.2)';
  g.fill(o.bounce);
  if (o.marks) {
    g.lineCap = 'round';
    g.lineWidth = 0.7;
    g.strokeStyle = 'rgba(36, 26, 12, 0.34)';
    g.stroke(o.marks.dark);
    g.strokeStyle = 'rgba(226, 212, 170, 0.3)';
    g.stroke(o.marks.pale);
    g.lineWidth = 0.8;
    g.strokeStyle = 'rgba(24, 40, 16, 0.32)';
    g.stroke(o.marks.rings);
  }
  g.restore();
}

// everything `paintStem` needs for one stem: when and from which edge it is wiped in, and its ribbons
function stemOp(z, strip, { tones, at, dur, mirror, edge, tip, height, drop, marks }) {
  return {
    z, op: 'stem', tones, at, dur, mirror, edge, tip, run: Math.abs(tip - edge) + 8, height, drop, marks,
    body: ribbon(strip),
    face: ribbon(strip, 0.22, 0.72),
    light: ribbon(strip, 0.46, 0.34),
    glint: ribbon(strip, 0.6, 0.1),
    bounce: ribbon(strip, -0.74, 0.12),
  };
}

// a thin green stalk (a flowering side shoot), drawn as far as it has grown
function paintStalk(g, o, t) {
  const p = t >= o.at + o.dur ? 1 : (t - o.at) / o.dur;
  if (p <= 0) return;
  const upto = (o.pts.length - 1) * (p >= 1 ? 1 : 1 - (1 - p) ** 2);
  const whole = Math.floor(upto);
  const path = new Path2D();
  path.moveTo(o.pts[0][0], o.pts[0][1]);
  for (let i = 1; i <= whole; i++) path.lineTo(o.pts[i][0], o.pts[i][1]);
  if (whole < o.pts.length - 1) {
    const a = o.pts[whole];
    const b = o.pts[whole + 1];
    const f = upto - whole;
    path.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
  }
  g.save();
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.translate(0, o.w * 0.8);
  g.lineWidth = o.w + 0.6;
  g.strokeStyle = 'rgba(10, 26, 16, 0.18)';
  g.stroke(path);
  g.translate(0, -o.w * 0.8);
  g.lineWidth = o.w;
  g.strokeStyle = '#3d6e2c';
  g.stroke(path);
  g.translate(0, -o.w * 0.2);
  g.lineWidth = o.w * 0.5;
  g.strokeStyle = '#93c25a';
  g.stroke(path);
  g.restore();
}

// one drawing from the sheet, scaled up from its foot as it opens
function paintDrawing(g, levels, o, t, dpr) {
  const p = t >= o.at + o.dur ? 1 : (t - o.at) / o.dur;
  if (p <= 0) return;
  // "back out": past full size, then settling
  const e = p >= 1 ? 1 : 1 + (o.over + 1) * (p - 1) ** 3 + o.over * (p - 1) ** 2;
  const k = o.k * e;
  if (k < 0.002) return;
  const [, sx, sy, sw, sh, ax, ay] = o.s;
  const onDevice = k * dpr;
  const level = onDevice > 0.6 ? 0 : onDevice > 0.3 ? 1 : 2;
  const f = 1 / (1 << level);
  g.save();
  g.translate(o.x, o.y);
  if (p < 1 && o.spin) g.rotate(o.spin * (1 - e) * RAD); // swings round into place as it opens
  g.scale(o.mirror ? -k : k, k);
  if (o.turn) g.rotate(o.turn * RAD);
  g.drawImage(levels[level], sx * f, sy * f, sw * f, sh * f, -ax, -ay, sw, sh);
  g.restore();
}

// Paint a planted vine as it stands at time `t` (omit it for full-grown). The context is expected to be
// scaled so that one unit is one CSS pixel; `dpr` is that scale.
export function paint(g, scene, levels, t = Infinity, dpr = 1) {
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = 'high';
  for (let i = 0; i < scene.ops.length; i++) {
    const o = scene.ops[i];
    if (o.op === 'stem') paintStem(g, o, t);
    else if (o.op === 'stalk') paintStalk(g, o, t);
    else paintDrawing(g, levels, o, t, dpr);
  }
}

// layers, back to front
const FAR = 0;      // leaves behind everything, in shade and out of focus
const RUNNER = 1;   // the second, thinner stem that weaves behind the first on wide screens
const TUFT = 2;     // new growth on the runner
const STEM = 3;
const LEAVES = 4;
const STALKS = 5;
const FLOWERS = 6;

function finish(ops) {
  ops.forEach((o, i) => { o.n = i; });
  ops.sort((a, b) => a.z - b.z || a.n - b.n);
  let end = 0;
  ops.forEach((o) => { end = Math.max(end, o.at + o.dur); });
  return { ops, end };
}

/*
 * A divider band: one vine grows in from each edge and the two meet under a cluster of blooms in the
 * centre. Each has a tapering stem, woody at the screen edge and green at its tip, leaves in whorls, and
 * short side shoots carrying trumpet flowers and buds. Placement is seeded from the band's id: every
 * divider grows differently, and the same divider grows the same way every time.
 */
export function plantDivider(width, height, uid) {
  const ops = [];
  const k = height / 130;
  const mid = height * 0.55;
  // Below 1200px each side is a single stem (no second runner behind it); phones and tablets also get
  // fewer, gentler bends and smaller, closer-set leaves and flowers so the short stems are not crowded.
  // Very wide screens get extra bends instead of longer ones, so the vine never runs flat.
  const single = width <= 1200;
  const phone = width <= 600;
  const tablet = width <= 900;
  const segs = phone ? 3 : tablet ? 4 : Math.max(5, Math.round(width / 340));
  const leafSize = phone ? 0.96 : tablet ? 1.12 : 1.36;
  const bloomSize = phone ? 0.86 : tablet ? 0.98 : 1.16;
  const gap = phone ? 36 : tablet ? 42 : 48; // distance between leaf nodes
  const cx = width / 2;

  const sprout = (z, kind, x, y, heading, size, at, open, spin, rand) => {
    ops.push({ z, ...place(kind, x, y, heading, size, rand, height), at, dur: open.dur, over: open.over, spin });
  };
  // an open flower seen from the front: any of them (or, `square`, the one that faces the viewer squarely),
  // either way round, placed by the centre of its face
  const bloom = (x, y, radius, at, rand, square = false) => {
    const { unit, list } = SPRITES.bloom;
    const s = list[square ? 0 : Math.floor(rand() * list.length)];
    ops.push({ z: FLOWERS, s, k: radius / unit, x, y, turn: (rand() - 0.5) * 24, mirror: rand() < 0.5, at, dur: OPEN.bloom.dur, over: OPEN.bloom.over, spin: -70 });
  };

  const vine = (mirror, main) => {
    const rand = rng(`${uid}/${mirror ? 'r' : 'l'}/${main ? 'stem' : 'runner'}`);
    const dir = mirror ? -1 : 1;
    const stem = traceStem(main
      // the two stems bend opposite ways and run on under the crown
      ? { width, mirror, segs, y: mid, amp: 20 * k, inset: 8, phase: mirror ? 1 : 0, wobble: rand() * 6.28 }
      // the runner weaves across its stem at its own pace and stops short of the centre
      : { width, mirror, segs: segs + 0.5 + rand() * 0.9, y: mid + 2 * k, amp: 15 * k, inset: 78 + rand() * 60, phase: rand() * 2, wobble: rand() * 6.28 });
    // The stem is wiped in from the screen edge (fast, then slowing); `when` is the moment that wipe passes
    // distance u, so each node sprouts just behind the growing tip.
    const start = main ? 0 : 0.08;
    const dur = main ? 0.85 : 0.8;
    const when = (u) => start + dur * (1 - Math.sqrt(Math.max(0, 1 - u / stem.len)));
    const nodes = [];

    // a short side shoot ending in a cluster: usually an open trumpet, with buds pushing out beside it
    const spray = (p, at) => {
      const roomUp = p.y - 4;
      const roomDown = height - 4 - p.y;
      const R = BLOOM * bloomSize;
      let up = roomUp > roomDown; // toward the roomier side of the band ...
      if (rand() < 0.25 && Math.min(roomUp, roomDown) > R + 14 * k) up = !up; // ... most of the time
      const room = up ? roomUp : roomDown;
      const open = rand() < 0.8;
      const sideOn = open && up && rand() < 0.55; // seen from the side, the trumpet stands up off the shoot
      const lift = Math.min(room - (sideOn ? R * 1.9 : open ? R : 15 * bloomSize), (18 + rand() * 16) * k);
      if (lift < 6) return;
      const v = up ? -1 : 1;
      const run = (9 + rand() * 13) * k;
      const tip = { x: p.x + dir * run, y: p.y + v * lift };
      const c = { x: p.x + dir * run * 0.85, y: p.y + v * lift * 0.18 }; // leaves along the stem, then turns away
      const pts = [];
      for (let i = 0; i <= 10; i++) {
        const f = i / 10;
        pts.push([(1 - f) ** 2 * p.x + 2 * f * (1 - f) * c.x + f * f * tip.x, (1 - f) ** 2 * p.y + 2 * f * (1 - f) * c.y + f * f * tip.y]);
      }
      ops.push({ z: STALKS, op: 'stalk', pts, w: (phone ? 1.1 : tablet ? 1.3 : 1.5), at, dur: 0.1 });
      const out = Math.atan2(tip.y - c.y, tip.x - c.x) / RAD; // the way the shoot is heading at its tip

      // two small new leaves partway along the shoot
      const hx = 0.25 * p.x + 0.5 * c.x + 0.25 * tip.x;
      const hy = 0.25 * p.y + 0.5 * c.y + 0.25 * tip.y;
      const toTip = Math.atan2(tip.y - p.y, tip.x - p.x) / RAD;
      [1, -1].forEach((sideways) => {
        sprout(LEAVES, 'young', hx, hy, toTip + sideways * (48 + rand() * 24), YOUNG * leafSize * (0.6 + rand() * 0.16), at + 0.05, OPEN.leaf, -sideways * 28, rand);
      });

      sprout(FLOWERS, 'bud', tip.x, tip.y, out + dir * (40 + rand() * 22), BUD * bloomSize * (0.86 + rand() * 0.2), at + 0.07, OPEN.bud, 0, rand);
      sprout(FLOWERS, 'budlet', tip.x, tip.y, out - dir * (46 + rand() * 24), BUDLET * bloomSize * (0.8 + rand() * 0.25), at + 0.09, OPEN.bud, 0, rand);
      if (sideOn) {
        sprout(FLOWERS, 'trumpet', tip.x, tip.y, out + (rand() - 0.5) * 24, R * (0.9 + rand() * 0.14), at + 0.1, OPEN.trumpet, 0, rand);
      } else if (open) {
        const reach = R * 0.3; // the shoot ends behind the flower's face
        bloom(tip.x + Math.cos(out * RAD) * reach, tip.y + Math.sin(out * RAD) * reach, R * (0.9 + rand() * 0.16), at + 0.1, rand);
      }
    };

    // A leaf node. The plant carries its leaves in whorls of three or four: a pair spread either side of the
    // stem, often another lying along the stem behind it, and one more in front. Now and then a node also
    // carries a flowering shoot, or a lone bud in the leaf axil.
    const node = (u, flowering) => {
      const p = stem.at(u);
      const t = u / stem.len;
      const at = when(u) + 0.02;
      const age = (1.1 - 0.3 * t ** 1.5) * (main ? 1 : 0.68); // older, larger leaves toward the screen edge
      nodes.push(u);
      [1, -1].forEach((sideways, n) => { // +1: the leaf on the upper side of the stem
        const young = main ? t > 0.92 : rand() < 0.3;
        const behind = !main || rand() < 0.22;
        const size = (young ? YOUNG : LEAF) * leafSize * age * (0.8 + rand() * 0.3) * (rand() < 0.12 ? 1.18 : 1);
        const q = stem.at(u + (n ? 1 : -1) * (1 + rand() * 2.5)); // the pair is not attached at exactly one point
        sprout(young ? (main ? LEAVES : TUFT) : behind ? FAR : LEAVES, young ? 'young' : behind ? 'back' : 'leaf', q.x, q.y,
          p.ang - dir * sideways * (46 + rand() * 32), size, at + n * 0.012, OPEN.leaf, dir * sideways * 28, rand);
      });
      if (main && rand() < 0.36) {
        sprout(FAR, 'back', p.x, p.y, p.ang + (rand() - 0.5) * 40, LEAF * leafSize * age * (0.74 + rand() * 0.2), at + 0.02, OPEN.leaf, 0, rand);
      }
      if (main && rand() < 0.45) {
        sprout(LEAVES, 'leaf', p.x, p.y, p.ang - dir * (rand() < 0.5 ? 1 : -1) * (14 + rand() * 60), LEAF * leafSize * age * (0.62 + rand() * 0.2), at + 0.03, OPEN.leaf, 0, rand);
      }
      if (flowering) spray(p, at);
      else if (main && rand() < 0.2) {
        sprout(FLOWERS, 'budlet', p.x, p.y, p.ang - dir * (rand() < 0.5 ? 1 : -1) * (28 + rand() * 26), BUDLET * bloomSize * (0.8 + rand() * 0.2), at + 0.05, OPEN.bud, 0, rand);
      }
    };

    if (main) {
      // nodes are spaced evenly within each bend; the one nearest the bend's apex may carry the flowers
      const bend = stem.len / segs;
      const perBend = Math.max(1, Math.round(bend / gap));
      for (let b = 0; b < segs; b++) {
        for (let j = 0; j < perBend; j++) {
          const u = bend * (b + (j + 0.5 + (rand() - 0.5) * 0.36) / perBend);
          const left = stem.len - u; // still to run before the centre
          if (left < 30 * k) continue; // the centre belongs to the crown
          // roomy bends nearly all flower, tight ones (phones) on every other bend, and none crowd the crown
          const flowering = j === Math.floor(perBend / 2) && left > 78 * bloomSize && (perBend >= 2 ? rand() < 0.86 : (segs - b) % 2 === 0);
          node(u, flowering);
        }
      }
    } else {
      for (let u = gap * (0.3 + rand() * 0.5); u < stem.len - 16; u += gap * (1.1 + rand() * 0.6)) node(u, false);
      // the runner ends in a growing tip: a pair of new leaves around a bud
      const p = stem.at(stem.len);
      [1, -1].forEach((sideways) => {
        sprout(TUFT, 'young', p.x, p.y, p.ang - dir * sideways * (24 + rand() * 22), YOUNG * leafSize * (0.56 + rand() * 0.14), start + dur, OPEN.leaf, dir * sideways * 20, rand);
      });
      sprout(TUFT, 'budlet', p.x, p.y, p.ang + (rand() - 0.5) * 16, BUDLET * bloomSize * 0.75, start + dur + 0.03, OPEN.bud, 0, rand);
    }

    const strip = stemStrip(stem, (main ? 2.9 : 1.5) * k, (main ? 1.2 : 0.45) * k, nodes, rand);
    const edge = mirror ? width + 20 : -20;
    ops.push(stemOp(main ? STEM : RUNNER, strip, {
      tones: main ? WOODY : DISTANT, at: start, dur, mirror, edge, tip: stem.at(stem.len).x, height,
      drop: (main ? 1.4 : 1.1) * k,
      marks: main ? barkMarks(strip, stem, nodes, 0.42, rand) : null,
    }));
  };

  if (!single) { vine(false, false); vine(true, false); }
  vine(false, true);
  vine(true, true);

  // The crown, where the two vines meet over the stem tips: a rosette of leaves, buds pushing out between
  // them, a second flower half hidden behind, and one large open bloom on top. It is seeded like the
  // rest, so no two bands carry quite the same crown.
  const rand = rng(`${uid}/crown`);
  const turn = rand() * 360;
  for (let i = 0; i < 7; i++) {
    const behind = i % 2 === 1;
    const heading = turn + i * (360 / 7) + (rand() - 0.5) * 26;
    sprout(behind ? FAR : LEAVES, behind ? 'back' : 'leaf', cx + Math.cos(heading * RAD) * 5, mid + Math.sin(heading * RAD) * 5, heading,
      LEAF * leafSize * (0.78 + rand() * 0.32), 0.8 + i * 0.01, OPEN.leaf, behind ? 26 : -26, rand);
  }
  const lean = -90 + (rand() - 0.5) * 110; // the second flower sits above the first, to one side
  // a third, seen from the side, stands up behind them on the other side
  sprout(FLOWERS, 'trumpet', cx - Math.cos(lean * RAD) * 6 * bloomSize, mid - 3 * k, -90 - (lean + 90) * 0.7 + (rand() - 0.5) * 16, BLOOM * bloomSize * 0.78, 0.84, OPEN.trumpet, 0, rand);
  [['bud', 100, 0.95], ['budlet', 195, 0.9], ['bud', -105, 0.85], ['budlet', 150, 0.8]].forEach(([kind, a, size], i) => {
    const heading = lean + a + (rand() - 0.5) * 20;
    sprout(FLOWERS, kind, cx + Math.cos(heading * RAD) * 7 * bloomSize, mid + Math.sin(heading * RAD) * 7 * bloomSize, heading,
      (kind === 'bud' ? BUD : BUDLET) * bloomSize * size, 0.85 + i * 0.012, OPEN.bud, 0, rand);
  });
  bloom(cx + Math.cos(lean * RAD) * 15 * bloomSize, mid + Math.sin(lean * RAD) * 15 * bloomSize, BLOOM * bloomSize * 0.8, 0.87, rand);
  bloom(cx, mid, BLOOM * bloomSize * 1.28, 0.9, rand, true);

  return finish(ops);
}
