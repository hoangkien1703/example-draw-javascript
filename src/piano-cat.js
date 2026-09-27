// piano-cat.js: the scene. A black cat sleeps on an upright piano, a lamp glows,
// and an orange blocky creature plays the keys. Coordinates are in pixels of a
// 1176 x 1176 canvas, measured straight off the reference frame.
(function () {
const cv = document.getElementById('c');
const P = createPencil(cv);
const { W, H, ctx, rand, pick, col, roughPoly, rectPts, polyPath, roughRect, crayon, pline } = P;
const R = P.random;

// ---------- scene pieces ----------
const CREAM = [242, 233, 214];

function paper() {
  ctx.fillStyle = `rgb(${CREAM})`;
  ctx.fillRect(0, 0, W, H);
  // faint mottling
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = col(R() < 0.5 ? [255, 250, 238] : [225, 212, 188], rand(0.03, 0.08));
    const r = rand(8, 40);
    ctx.beginPath(); ctx.arc(rand(0, W), rand(0, H), r, 0, 7); ctx.fill();
  }
}

const BLUE = [158, 186, 216], BLUE_L = [180, 202, 224], BLUE_D = [138, 170, 208];

function blueBand(y, h, o = {}) {
  crayon(roughRect(-10, y, W + 20, h, 1.2), [0, y, W, h], Object.assign({
    colors: [BLUE, BLUE_L, [166, 190, 218]], angle: 0.0, angleVar: 0.22, len: [10, 34], width: [1.4, 3],
    alpha: [0.18, 0.5], density: 0.75, tooth: 0.65, light: 8, curve: 4
  }, o));
}

function piano() {
  // top lid surface
  blueBand(242, 78, { colors: [[176, 196, 218], [192, 208, 226], [160, 184, 212]], density: 0.8, alpha: [0.15, 0.45] });
  pline(0, 242, W, 241, { color: [120, 135, 150], width: 1.3, alpha: 0.55 });
  // darker rail
  blueBand(318, 26, { colors: [BLUE_D, [140, 170, 206]], density: 1.4, alpha: [0.35, 0.8] });
  pline(0, 319, W, 320, { color: [110, 140, 175], alpha: 0.5 });
  pline(0, 343, W, 342, { color: [110, 140, 175], alpha: 0.45 });
  // upper front panel
  blueBand(343, 415, { colors: [[172, 195, 220], BLUE_L, [156, 183, 214]], density: 1, alpha: [0.18, 0.5] });
  // lower rail above keys
  blueBand(754, 40, { colors: [BLUE, BLUE_D, [138, 170, 208]], density: 1.5, alpha: [0.35, 0.85] });
  pline(0, 755, W, 754, { color: [110, 140, 175], alpha: 0.5 });
  blueBand(792, 30, { colors: [[160, 186, 214], BLUE], density: 1.1, alpha: [0.3, 0.75], angle: -0.35, angleVar: 0.08, len: [14, 40] });
  pline(0, 792, W, 793, { color: [125, 150, 180], alpha: 0.4 });
  // below the keys
  blueBand(962, 40, { colors: [BLUE, [140, 172, 208]], density: 1.2, alpha: [0.3, 0.8] });
  pline(0, 962, W, 962, { color: [120, 145, 175], alpha: 0.45 });
  pline(0, 1002, W, 1001, { color: [110, 140, 175], alpha: 0.55 });
  blueBand(1002, 58, { colors: [BLUE_D, BLUE, [120, 156, 200]], density: 1.6, alpha: [0.35, 0.85], angle: -1.05, angleVar: 0.12, len: [14, 44] });
  blueBand(1002, 58, { colors: [BLUE], density: 0.4, alpha: [0.15, 0.4] });
  pline(0, 1060, W, 1061, { color: [110, 140, 175], alpha: 0.5 });
  // lower panel
  blueBand(1060, 120, { colors: [[172, 194, 218], [186, 204, 224], BLUE], density: 0.85, alpha: [0.2, 0.55] });
  crayon(roughRect(14, 1076, 1148, 110, 1), [14, 1076, 1148, 110], { colors: [[250, 244, 232]], density: 0.35, alpha: [0.1, 0.3], len: [60, 200], width: [2, 4], tooth: 0.3, angleVar: 0.03 });
  pline(14, 1076, 1162, 1076, { color: [150, 170, 195], alpha: 0.35 });
}

function keys() {
  const top = 822, bot = 944, bkH = 76, bkW = 46;
  // white keys base
  crayon(roughRect(-5, top, W + 10, bot - top, 0.6), [0, top, W, bot - top], {
    colors: [[250, 245, 232], [238, 230, 212]], density: 0.5, alpha: [0.15, 0.4], len: [8, 30], angle: Math.PI / 2, angleVar: 0.06, tooth: 0.3
  });
  pline(0, top, W, top, { color: [110, 110, 110], alpha: 0.55, width: 1.1 });
  // white key separators
  for (let x = 27 - 75; x < W + 75; x += 75) {
    pline(x + rand(-1, 1), top + 2, x + rand(-1, 1), bot - 2, { color: [150, 148, 145], alpha: 0.45, width: 1, passes: 1 });
  }
  // key front edge: dotted graphite
  crayon(roughRect(-5, bot - 4, W + 10, 10, 0.8), [0, bot - 4, W, 10], {
    colors: [[120, 118, 115], [150, 148, 144]], density: 1.1, alpha: [0.35, 0.8], len: [3, 10], width: [1, 2], angle: Math.PI / 2, angleVar: 0.4, tooth: 0.55
  });
  pline(0, bot + 7, W, bot + 7, { color: [160, 158, 150], alpha: 0.3 });
  // black keys: groups of 2 and 3, one octave = 525px
  const centers = [];
  for (let base = 27 - 525; base < W + 525; base += 525) {
    [0, 75, 223, 298, 373].forEach(d => centers.push(base + d));
  }
  centers.forEach(cx => {
    if (cx + bkW / 2 < -10 || cx - bkW / 2 > W + 10) return;
    const x = cx - bkW / 2 + rand(-1.5, 1.5), y = top + rand(-1, 1.5);
    crayon(roughRect(x, y, bkW, bkH + rand(-2, 2), 1.2), [x, y, bkW, bkH], {
      colors: [[124, 120, 115], [138, 134, 128], [110, 106, 102]], density: 3.2, alpha: [0.3, 0.7], len: [6, 18],
      angle: Math.PI / 2, angleVar: 1.2, tooth: 0.3, width: [1.4, 3], curve: 2
    });
    pline(x, y, x, y + bkH, { color: [70, 68, 66], alpha: 0.5, passes: 1 });
    pline(x + bkW, y, x + bkW, y + bkH, { color: [70, 68, 66], alpha: 0.5, passes: 1 });
    pline(x, y + bkH, x + bkW, y + bkH, { color: [70, 68, 66], alpha: 0.45, passes: 1 });
  });
}

function sheetMusic() {
  const x0 = 165, y0 = 350, x1 = 1090, y1 = 716;
  // paper sheet
  ctx.save(); ctx.beginPath(); polyPath(ctx, roughPoly(rectPts(x0, y0, x1 - x0, y1 - y0), 0.6)); ctx.fillStyle = 'rgb(243,237,222)'; ctx.fill(); ctx.restore();
  crayon(roughRect(x0, y0, x1 - x0, y1 - y0, 0.6), [x0, y0, x1 - x0, y1 - y0], {
    colors: [[246, 240, 226], [240, 233, 216]], density: 1.4, alpha: [0.6, 1], len: [40, 140], width: [3, 7], tooth: 0.08, light: 3
  });
  ctx.save(); ctx.beginPath(); polyPath(ctx, roughPoly(rectPts(x0, y0, x1 - x0, y1 - y0), 0.6)); ctx.fillStyle = 'rgba(245,239,225,0.55)'; ctx.fill(); ctx.restore();
  pline(x0, y0, x1, y0, { color: [140, 138, 132], alpha: 0.5 });
  pline(x0, y1, x1, y1, { color: [140, 138, 132], alpha: 0.5 });
  pline(x0, y0, x0, y1, { color: [140, 138, 132], alpha: 0.5 });
  pline(x1, y0, x1, y1, { color: [140, 138, 132], alpha: 0.5 });
  // centre fold + binding clip
  pline(625, y0, 625, y1, { color: [170, 168, 162], alpha: 0.35, passes: 1 });
  crayon(roughRect(615, 352, 22, 92, 1), [615, 352, 22, 92], {
    colors: [[170, 168, 165], [200, 198, 195]], density: 1.2, alpha: [0.3, 0.7], len: [4, 12], angle: Math.PI / 2, angleVar: 0.6, tooth: 0.5
  });

  const staves = [398, 506, 621];
  const sp = 11;
  const sides = [[200, 603, [200, 332, 465, 603]], [657, 1072, [657, 795, 932, 1072]]];
  staves.forEach((sy, si) => {
    sides.forEach(([a, b, bars], side) => {
      for (let l = 0; l < 5; l++) pline(a, sy + l * sp, b, sy + l * sp + rand(-0.6, 0.6), { color: [120, 118, 114], alpha: 0.55, width: 0.9, passes: 1 });
      bars.forEach(bx => pline(bx, sy, bx, sy + 4 * sp, { color: [100, 98, 95], alpha: 0.6, width: 1, passes: 1 }));
      if (si === 2 && side === 1) {
        // final empty bar drawn heavier
        pline(787, sy - 1, 787, sy + 4 * sp + 1, { color: [60, 58, 56], width: 2.6, alpha: 0.85 });
        pline(1068, sy - 1, 1068, sy + 4 * sp + 1, { color: [60, 58, 56], width: 2.6, alpha: 0.85 });
        pline(787, sy, 1068, sy, { color: [70, 68, 66], width: 1.4, alpha: 0.7 });
        pline(787, sy + 4 * sp, 1068, sy + 4 * sp, { color: [70, 68, 66], width: 1.4, alpha: 0.7 });
      }
    });
  });

  // notes (hand-placed to follow the reference loosely)
  const notes = [
    // staff 1 left
    [215, 0, 4.2], [258, 0, 2.0], [298, 0, 2.2], [350, 0, 3.0], [420, 0, 3.8], [485, 0, 2.6], [525, 0, 1.5], [567, 0, 0.8],
    // staff 1 right
    [673, 0, 3.4], [716, 0, 2.2], [760, 0, 1.4], [810, 0, 1.2], [855, 0, 1.5], [898, 0, 2.8], [948, 0, 3.8], [993, 0, 1.4], [1037, 0, 2.6],
    // staff 2 left
    [215, 1, 2.6], [283, 1, 3.4],
    // staff 2 right
    [745, 1, 4.0], [812, 1, 2.6], [855, 1, 1.8], [898, 1, 1.2], [950, 1, 2.4], [1021, 1, 3.0],
    // staff 3 left
    [215, 2, 4.2], [258, 2, 2.4],
    // staff 3 right (peeking past the arm)
    [756, 2, 2.2]
  ];
  notes.forEach(([nx, s, pos]) => {
    const ny = staves[s] + pos * sp;
    crayon(c => { c.ellipse(nx, ny, 7, 5.4, -0.4, 0, 7); }, [nx - 9, ny - 8, 18, 16], {
      colors: [[50, 48, 46], [70, 68, 64], [35, 34, 33]], density: 5, alpha: [0.45, 0.95], len: [2, 6], width: [1, 2], tooth: 0.45, angleVar: 1.5, pad: 0
    });
    pline(nx + 6, ny - 2, nx + 6 + rand(-0.5, 0.5), ny - 36, { color: [80, 78, 74], width: 1, alpha: 0.7, passes: 1 });
  });
}

function ledge() {
  crayon(roughRect(115, 716, 945, 40, 1), [115, 716, 945, 40], {
    colors: [[176, 198, 222], [160, 188, 216]], density: 1, alpha: [0.3, 0.7], len: [30, 120], tooth: 0.5
  });
  pline(115, 716, 1060, 716, { color: [120, 140, 165], alpha: 0.45 });
  pline(115, 716, 115, 755, { color: [120, 140, 165], alpha: 0.4 });
  pline(1060, 716, 1060, 755, { color: [120, 140, 165], alpha: 0.4 });
}

function pencil() {
  const y = 722, h = 18;
  crayon(roughRect(590, y, 246, h, 0.6), [590, y, 246, h], {
    colors: [[240, 205, 85], [232, 190, 70], [245, 215, 110]], density: 2.2, alpha: [0.5, 0.95], len: [20, 70], tooth: 0.3
  });
  pline(590, y, 836, y, { color: [150, 120, 50], alpha: 0.6 });
  pline(590, y + h, 836, y + h, { color: [150, 120, 50], alpha: 0.6 });
  pline(590, y + h / 2, 836, y + h / 2, { color: [200, 160, 60], alpha: 0.35, passes: 1 });
  // wood cone
  crayon(c => { c.moveTo(836, y); c.lineTo(862, y + h / 2); c.lineTo(836, y + h); c.closePath(); }, [836, y, 28, h], {
    colors: [[228, 196, 150], [215, 180, 130]], density: 2, alpha: [0.5, 0.9], len: [4, 12], tooth: 0.3
  });
  crayon(c => { c.moveTo(854, y + 5); c.lineTo(866, y + h / 2); c.lineTo(854, y + h - 5); c.closePath(); }, [852, y + 3, 16, 12], {
    colors: [[60, 55, 50]], density: 3, alpha: [0.6, 1], len: [3, 8], tooth: 0.2
  });
  pline(836, y, 864, y + h / 2, { color: [120, 95, 60], alpha: 0.6, passes: 1 });
  pline(836, y + h, 864, y + h / 2, { color: [120, 95, 60], alpha: 0.6, passes: 1 });
}

function creature() {
  const ORANGE = [232, 108, 66], ORANGE_D = [214, 86, 50], ORANGE_L = [242, 136, 92];
  const parts = [
    [328, 452, 362, 290],    // body
    [265, 580, 66, 82],      // left arm
    [688, 567, 58, 84],      // right arm
    [335, 738, 66, 94], [433, 738, 67, 94], [522, 738, 68, 94], [624, 738, 66, 94] // legs
  ];
  const polys = parts.map(([x, y, w, h]) => roughPoly(rectPts(x, y, w, h), 1.2));
  const shape = c => polys.forEach(p => polyPath(c, p));
  // base colour: dense diagonal hatching
  crayon(shape, [262, 448, 488, 388], {
    colors: [ORANGE, ORANGE_D, ORANGE_L], density: 3.4, alpha: [0.4, 0.9], len: [6, 20], width: [1.2, 2.6],
    angle: -0.9, angleVar: 1.4, tooth: 0.75, light: 12, curve: 2
  });
  // second layer to deepen, less tooth
  crayon(shape, [262, 448, 488, 388], {
    colors: [[222, 98, 58], [230, 112, 70]], density: 1, alpha: [0.2, 0.5], len: [6, 18], angle: 0.6, angleVar: 1.5, tooth: 0.45
  });
  // lighter top face (the box's lid)
  crayon(roughRect(330, 452, 358, 26, 1), [330, 452, 358, 26], {
    colors: [[244, 160, 118], [238, 142, 100]], density: 2.4, alpha: [0.4, 0.85], len: [8, 24], tooth: 0.4
  });
  // darker right side & bottom edges for volume
  crayon(roughRect(672, 470, 18, 270, 1), [672, 470, 18, 270], {
    colors: [[190, 70, 40]], density: 1.2, alpha: [0.2, 0.5], len: [20, 50], angle: Math.PI / 2, tooth: 0.4
  });
  crayon(roughRect(265, 646, 66, 16, 1), [265, 646, 66, 16], { colors: [[190, 70, 40]], density: 1, alpha: [0.2, 0.5], len: [15, 40], tooth: 0.4 });
  crayon(roughRect(688, 636, 58, 15, 1), [688, 636, 58, 15], { colors: [[190, 70, 40]], density: 1, alpha: [0.2, 0.5], len: [15, 40], tooth: 0.4 });
  // edge lines
  polys.forEach(p => {
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      if (R() < 0.8) pline(a[0], a[1], b[0], b[1], { color: [180, 65, 38], alpha: 0.35, width: 1, passes: 1 });
    }
  });
  // eyes
  [[380, 578, 53, 55], [555, 572, 53, 55]].forEach(([x, y, w, h]) => {
    crayon(roughRect(x, y, w, h, 1), [x, y, w, h], {
      colors: [[62, 30, 26], [80, 38, 30], [45, 25, 22]], density: 3.2, alpha: [0.55, 1], len: [10, 30], angle: -0.8, angleVar: 0.3, tooth: 0.35, width: [1.2, 2.4]
    });
    crayon(roughRect(x, y, w, h, 1), [x, y, w, h], {
      colors: [[120, 50, 35]], density: 0.5, alpha: [0.2, 0.5], len: [15, 35], angle: 0.8, tooth: 0.5
    });
  });
}

function cat() {
  const body = c => {
    c.moveTo(122, 241);
    c.bezierCurveTo(104, 205, 116, 152, 170, 132);
    c.bezierCurveTo(222, 110, 300, 114, 345, 132);
    c.bezierCurveTo(362, 140, 376, 146, 386, 140);
    c.bezierCurveTo(390, 128, 394, 114, 399, 103);
    c.bezierCurveTo(408, 112, 414, 118, 420, 123);
    c.bezierCurveTo(436, 119, 450, 118, 458, 119);
    c.lineTo(467, 104);
    c.bezierCurveTo(478, 124, 486, 150, 483, 176);
    c.bezierCurveTo(480, 200, 470, 214, 456, 222);
    c.bezierCurveTo(464, 226, 466, 238, 456, 242);
    c.lineTo(424, 242);
    c.bezierCurveTo(414, 240, 412, 234, 416, 228);
    c.bezierCurveTo(400, 236, 380, 240, 360, 242);
    c.closePath();
  };
  // tail as a tapering ribbon
  const tailPts = [];
  const P = [[160, 206], [110, 200], [70, 214], [52, 262], [44, 312], [56, 356], [90, 372], [120, 360]];
  function catmull(p, t) {
    const n = p.length - 1, f = t * n, i = Math.min(n - 1, Math.floor(f)), u = f - i;
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(n, i + 2)];
    const h = (a, b, c2, d) => 0.5 * ((2 * b) + (-a + c2) * u + (2 * a - 5 * b + 4 * c2 - d) * u * u + (-a + 3 * b - 3 * c2 + d) * u * u * u);
    return [h(p0[0], p1[0], p2[0], p3[0]), h(p0[1], p1[1], p2[1], p3[1])];
  }
  const N = 80;
  for (let i = 0; i <= N; i++) tailPts.push(catmull(P, i / N));
  const left = [], right = [];
  tailPts.forEach((pt, i) => {
    const a = tailPts[Math.max(0, i - 1)], b = tailPts[Math.min(N, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const w = 11.5 - 3.5 * (i / N);
    left.push([pt[0] - dy / L * w, pt[1] + dx / L * w]);
    right.push([pt[0] + dy / L * w, pt[1] - dx / L * w]);
  });
  const tailPoly = left.concat(right.reverse());
  const tail = c => polyPath(c, tailPoly);

  const BLACK = [28, 24, 22], BLACK2 = [45, 38, 34];
  const opts = {
    colors: [BLACK, BLACK2, [20, 18, 18]], density: 3.6, alpha: [0.55, 1], len: [8, 28], width: [1.2, 2.6],
    angle: -0.3, angleVar: 0.9, tooth: 0.85, light: 8
  };
  const solid = (shape, a) => { ctx.save(); ctx.beginPath(); shape(ctx); ctx.fillStyle = `rgba(22,19,18,${a})`; ctx.fill(); ctx.restore(); };
  solid(tail, 0.8);
  crayon(tail, [30, 180, 140, 205], Object.assign({}, opts, { angle: 1.2 }));
  // warm highlight along the tail's outer curve
  const inner = left.slice(12, 72), mid = inner.map((p, k) => { const q = tailPts[12 + k]; return [p[0] * 0.45 + q[0] * 0.55, p[1] * 0.45 + q[1] * 0.55]; }), innerPoly = inner.concat(mid.reverse());
  crayon(c => polyPath(c, innerPoly), [30, 180, 140, 205], { colors: [[150, 100, 62], [175, 120, 78]], density: 0.7, alpha: [0.2, 0.5], len: [5, 14], tooth: 0.6, angle: 1.3 });
  solid(body, 0.82);
  crayon(body, [100, 100, 390, 145], opts);
  crayon(body, [100, 100, 390, 145], Object.assign({}, opts, { density: 0.8, tooth: 0.7 }));
  // paper showing through the black pencil: clustered light specks
  ctx.save(); ctx.beginPath(); body(ctx); tail(ctx); ctx.clip();
  for (let i = 0; i < 11000; i++) {
    const x = rand(30, 490), y = rand(98, 385);
    const r = R() < 0.9 ? rand(0.35, 0.8) : rand(0.8, 1.3);
    ctx.fillStyle = col(R() < 0.8 ? [236, 228, 214] : [200, 180, 160], rand(0.2, 0.7));
    ctx.beginPath(); ctx.ellipse(x, y, r * rand(1, 1.8), r, rand(-0.6, 0.6), 0, 7); ctx.fill();
  }
  ctx.restore();
  // fuzzy fur on the outline: short strokes crossing the edge
  ctx.save(); ctx.lineCap = 'round';
  const fur = document.createElement('canvas').getContext('2d');
  for (let i = 0; i < 2600; i++) {
    const x = rand(100, 490), y = rand(98, 246);
    fur.beginPath(); body(fur);
    const inside = fur.isPointInPath(x, y);
    if (!inside) continue;
    // only near the edge: test a shifted point
    const a = rand(0, Math.PI * 2), d = rand(3, 7);
    if (fur.isPointInPath(x + Math.cos(a) * d, y + Math.sin(a) * d)) continue;
    ctx.strokeStyle = col(BLACK, rand(0.25, 0.7));
    ctx.lineWidth = rand(0.8, 1.6);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * d * rand(0.6, 1.1), y + Math.sin(a) * d * rand(0.6, 1.1)); ctx.stroke();
  }
  ctx.restore();
  // inner ears
  crayon(c => { c.moveTo(401, 112); c.lineTo(416, 126); c.lineTo(400, 132); c.closePath(); }, [396, 108, 24, 26], {
    colors: [[178, 128, 104], [150, 104, 84]], density: 2.2, alpha: [0.45, 0.9], len: [3, 9], tooth: 0.45
  });
  crayon(c => { c.moveTo(465, 112); c.lineTo(470, 132); c.lineTo(456, 124); c.closePath(); }, [452, 108, 22, 28], {
    colors: [[178, 128, 104], [150, 104, 84]], density: 2.2, alpha: [0.45, 0.9], len: [3, 9], tooth: 0.45
  });
  // closed eyes and paw outline in grey pencil
  const soft = { color: [175, 165, 155], width: 2.2, alpha: 0.85, passes: 2 };
  pline(407, 170, 424, 175, soft);
  pline(441, 172, 456, 167, soft);
  ctx.save(); ctx.lineWidth = 1.3; ctx.strokeStyle = 'rgba(120,112,104,0.55)';
  [[408, 231, 15], [444, 231, 15]].forEach(([px, py, r]) => { ctx.beginPath(); ctx.ellipse(px + rand(-1, 1), py, r, 9, 0, Math.PI * 1.05, Math.PI * 2.05); ctx.stroke(); });
  ctx.restore();
}

function lamp() {
  // glow halo
  const gx = 1010, gy = 110;
  crayon(c => c.arc(gx, gy, 150, 0, 7), [gx - 150, gy - 150, 300, 300], {
    colors: [[250, 225, 110], [248, 214, 90], [252, 236, 150]], density: 0.7, alpha: [0.15, 0.5], len: [6, 22],
    width: [0.8, 1.6], angleVar: 3.2, tooth: 0.45, curve: 6
  });
  const g = ctx.createRadialGradient(gx, gy + 20, 20, gx, gy + 20, 170);
  g.addColorStop(0, 'rgba(255,238,160,0.35)'); g.addColorStop(1, 'rgba(255,238,160,0)');
  ctx.fillStyle = g; ctx.fillRect(gx - 180, gy - 170, 360, 360);
  // shade
  const shade = roughPoly([[953, 16], [1086, 16], [1121, 152], [918, 152]], 1);
  crayon(c => polyPath(c, shade), [915, 12, 210, 144], {
    colors: [[252, 214, 95], [253, 226, 125], [248, 204, 80]], density: 2.2, alpha: [0.45, 0.9], len: [14, 45], angle: -0.8, angleVar: 0.35, tooth: 0.45
  });
  crayon(c => polyPath(c, roughPoly([[928, 112], [1111, 112], [1121, 152], [918, 152]], 1)), [915, 110, 210, 44], {
    colors: [[242, 170, 55], [235, 155, 45]], density: 1.8, alpha: [0.35, 0.85], len: [14, 40], tooth: 0.45
  });
  crayon(c => polyPath(c, roughPoly([[958, 18], [1020, 18], [1005, 80], [945, 80]], 1)), [940, 16, 84, 66], {
    colors: [[255, 238, 170]], density: 0.8, alpha: [0.2, 0.5], len: [10, 30], tooth: 0.4
  });
  const edge = { color: [200, 140, 40], alpha: 0.55, width: 1.1, passes: 1 };
  pline(953, 16, 1086, 16, edge); pline(1086, 16, 1121, 152, edge); pline(1121, 152, 918, 152, edge); pline(918, 152, 953, 16, edge);
  // stem
  crayon(roughRect(1014, 152, 13, 76, 0.8), [1014, 152, 13, 76], {
    colors: [[215, 150, 70], [195, 130, 60], [230, 175, 90]], density: 2.4, alpha: [0.45, 0.9], len: [8, 22], angle: Math.PI / 2, tooth: 0.4
  });
  pline(1014, 154, 1014, 228, { color: [170, 110, 50], alpha: 0.5, passes: 1 });
  pline(1027, 154, 1027, 228, { color: [170, 110, 50], alpha: 0.5, passes: 1 });
  // base
  crayon(c => c.ellipse(1021, 234, 43, 9, 0, 0, 7), [976, 224, 90, 20], {
    colors: [[225, 165, 95], [240, 190, 120]], density: 2, alpha: [0.45, 0.9], len: [8, 22], tooth: 0.35
  });
  ctx.save(); ctx.strokeStyle = 'rgba(180,115,55,0.55)'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.ellipse(1021, 234, 43, 9, 0, 0, 7); ctx.stroke(); ctx.restore();
}

function lampPool() {
  const g2 = ctx.createRadialGradient(1020, 262, 5, 1020, 262, 120);
  g2.addColorStop(0, 'rgba(255,248,225,0.55)'); g2.addColorStop(1, 'rgba(255,248,225,0)');
  ctx.save(); ctx.fillStyle = g2; ctx.beginPath(); ctx.ellipse(1020, 265, 130, 40, 0, 0, 7); ctx.fill(); ctx.restore();
}

function grain() {
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (R() - 0.5) * 10;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}


function draw(seed) {
  P.reset(seed);
  paper();
  lamp();
  piano();
  lampPool();
  sheetMusic();
  ledge();
  pencil();
  keys();
  creature();
  cat();
  grain();
  cv.dataset.done = '1';
}

let seed = 1703;
const fromUrl = Number(new URLSearchParams(location.search).get('seed'));
if (fromUrl) seed = fromUrl;
draw(seed);
const btn = document.getElementById('redraw');
if (btn) btn.addEventListener('click', () => { seed = (seed * 16807 + 11) % 2147483647; draw(seed); });
})();
