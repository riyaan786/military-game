// ============================================================================
// game_render.js — CMO GAME v7.1 — FIXED FREEZE-ON-DETECTION BUG
// ============================================================================
// All icons rendered via canvas text with black outlines + side colors
// No PNG/SVG sprites needed. Smoke, blast, radar all code-based.
//
// FIXED (v7.1): In the aircraft draw loop, `icon` and `fSize` were declared
// with `const` INSIDE the `if (a.groupId) {...} else {...}` branches, but
// the "Detected indicator" block right after that if/else referenced both
// of them anyway. Since const is block-scoped, that threw an uncaught
// `ReferenceError: icon is not defined` the instant a SELECTED aircraft got
// marked as radar-detected (a.dt && a === S.sel) — e.g. flying a plane at
// an enemy SAM site. Because this render loop's drawing code has no
// try/catch around it (only the tick() call inside it does), that error
// killed the entire requestAnimationFrame chain: no more frames get
// scheduled, so the game just silently freezes with no error shown on
// screen. Fix: hoist icon/fSize out of the branches so they're in scope
// for everything below, including the detected-indicator and waypoint-line
// code that follows.
// ============================================================================

// ---- ICON DEFINITIONS (Unicode) ----
const ICONS = {
  aircraft:    { char: '✈', sc: 0.55 },
  drone:       { char: '◈', sc: 0.5 },
  ship:        { char: '⊰⊱', sc: 0.5 },
  carrier:     { char: '⊰══⊱', sc: 0.55 },
  submarine:   { char: '⊰⊱', sc: 0.45 },
  building:    { char: '⌂', sc: 0.25 },
  airbase:     { char: '⌘', sc: 0.55 },
  sam:         { char: '▲', sc: 0.38 },
  bm:          { char: '▸', sc: 0.45 },
  missile:     { char: '▸', sc: 0.35 },
  blast:       { char: '✺', sc: 0.7 },
  smoke:       { char: '◍', sc: 0.5 },
  radar:       { char: '◉', sc: 0.55 }
};

// ---- Draw char with black outline + side color fill ----
function drawUIIcon(char, x, y, side, fontSize, alpha, rotation) {
  if (!char) return;
  const col = side === 'blue' ? '#2b6fdb' : side === 'red' ? '#db2b2b' : '#8ab4e8';
  cx.save();
  cx.translate(x, y);
  if (rotation !== undefined) cx.rotate(rotation);
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.font = `bold ${fontSize}px "Segoe UI", sans-serif`;
  // Black outline
  cx.strokeStyle = 'rgba(0,0,0,0.85)';
  cx.lineWidth = Math.max(1.5, fontSize * 0.12);
  cx.lineJoin = 'round';
  if (alpha !== undefined) cx.globalAlpha = alpha;
  cx.strokeText(char, 0, 0);
  // Side color fill
  cx.fillStyle = col;
  cx.fillText(char, 0, 0);
  cx.restore();
}

// ---- Radar circle (white outline) ----
function drawRadarCircle(x, y, radiusKM) {
  const r = radiusKM / W.kpp / S.zoom;
  const baseR = radiusKM / W.kpp;
  cx.save();
  cx.strokeStyle = 'rgba(255,255,255,0.15)';
  cx.lineWidth = 1.5 / S.zoom;
  cx.beginPath();
  cx.arc(x, y, baseR, 0, Math.PI * 2);
  cx.stroke();
  // Inner pulsing ring
  const pulsePhase = (S.tick * 0.02) % 1;
  const pulseR = baseR * (0.5 + pulsePhase * 0.5);
  cx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - pulsePhase)})`;
  cx.beginPath();
  cx.arc(x, y, pulseR, 0, Math.PI * 2);
  cx.stroke();
  cx.restore();
}

// ---- Selection circle ----
function drawSelectionCircle(x, y, r) {
  cx.save();
  cx.strokeStyle = 'rgba(255,255,255,0.5)';
  cx.lineWidth = 1.5 / S.zoom;
  cx.setLineDash([2 / S.zoom, 3 / S.zoom]);
  cx.beginPath();
  cx.arc(x, y, r, 0, Math.PI * 2);
  cx.stroke();
  cx.setLineDash([]);
  cx.restore();
}

// ---- HP bar ----
function drawHPBar(x, y, hp, maxHP, w) {
  const pct = Math.max(0, hp / maxHP);
  const bw = w || 12;
  const bh = 2;
  cx.save();
  cx.fillStyle = 'rgba(0,0,0,0.6)';
  cx.fillRect(x - bw / 2, y + 10, bw, bh);
  cx.fillStyle = pct > 0.5 ? 'rgba(80,200,80,0.9)' : pct > 0.25 ? 'rgba(200,180,60,0.9)' : 'rgba(220,60,60,0.9)';
  cx.fillRect(x - bw / 2, y + 10, bw * pct, bh);
  cx.restore();
}

// ============ SMOKE SYSTEM ============
let smokeParticles = [];

function spawnSmoke(x, y, intensity, duration) {
  const count = intensity === 'heavy' ? 8 : intensity === 'medium' ? 4 : 2;
  const dur = duration || (intensity === 'heavy' ? 300 : intensity === 'medium' ? 150 : 60);
  for (let i = 0; i < count; i++) {
    smokeParticles.push({
      x: x + (Math.random() - 0.5) * 3,
      y: y + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.2 + Math.random() * 0.4),
      life: dur + Math.random() * 30,
      maxLife: dur + 30,
      size: 0.5 + Math.random() * 0.8,
      intensity: intensity
    });
  }
}

function updateSmoke() {
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    const p = smokeParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy -= 0.002;
    p.life--;
    if (p.life <= 0) { smokeParticles.splice(i, 1); }
  }
}

function drawSmoke() {
  smokeParticles.forEach(p => {
    const alpha = Math.max(0, p.life / p.maxLife) * 0.5;
    const size = p.size * (1 + (1 - p.life / p.maxLife) * 0.8);
    const fontSize = Math.max(4, size * 12 / S.zoom);
    cx.save();
    cx.globalAlpha = alpha;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.font = `bold ${fontSize}px "Segoe UI", sans-serif`;
    cx.fillStyle = p.intensity === 'heavy' ? '#555' : '#888';
    cx.fillText('◍', p.x, p.y);
    cx.restore();
  });
}

// ============ RENDER STATE ============
let lt = 0, acc = 0, hudTimer = 0;

// ============ MAIN RENDER LOOP ============
function r(t) {
  if (!t) t = performance.now();
  const dt = lt ? Math.min((t - lt) / 1000, 1) : 0;
  lt = t;

  // Clear canvas
  cx.fillStyle = '#060a10';
  cx.fillRect(0, 0, cw, ch);

  // Draw map (always, even before game starts)
  // Uses dual-resolution: low-res for wide views, high-res clipped for zoomed-in
  if (A.map) {
    const camX = S && S.camX ? S.camX : W.mapW / 2;
    const camY = S && S.camY ? S.camY : W.mapH / 2;
    const zoom = S && S.zoom ? S.zoom : 0.5;
    cx.save();
    cx.translate(cw / 2, ch / 2);
    cx.scale(zoom, zoom);
    cx.translate(-camX, -camY);

    // HIGH-RES SOURCE CLIPPING: When zoomed in > 0.3, draw only the visible region
    // of the 16384×8192 high-res map instead of stretching the low-res one
    if (zoom > 0.3 && A.mapHigh && A.mapHigh.complete && A.mapHigh.naturalWidth > 0) {
      // Calculate visible world rect (in game coords: 3600×1800)
      const halfW = cw / 2 / zoom;
      const halfH = ch / 2 / zoom;
      const vpLeft = camX - halfW;
      const vpTop = camY - halfH;
      const vpRight = camX + halfW;
      const vpBottom = camY + halfH;

      // Scale factors: high-res map is 16384×8192, game world is 3600×1800
      const sclX = A.mapHigh.naturalWidth / W.mapW;   // ~4.55
      const sclY = A.mapHigh.naturalHeight / W.mapH;   // ~4.55

      // Convert visible world rect to high-res image pixel coords
      const sx = Math.max(0, vpLeft * sclX);
      const sy = Math.max(0, vpTop * sclY);
      const sw = Math.min(A.mapHigh.naturalWidth - sx, (vpRight - vpLeft) * sclX);
      const sh = Math.min(A.mapHigh.naturalHeight - sy, (vpBottom - vpTop) * sclY);

      // Draw only the visible slice of the high-res map onto the world coords
      if (sw > 0 && sh > 0) {
        cx.drawImage(
          A.mapHigh,
          sx, sy, sw, sh,             // source: high-res pixel region
          sx / sclX, sy / sclY,       // dest: world coords (convert back)
          sw / sclX, sh / sclY
        );
      }
    } else {
      // Low zoom: use the low-res map stretched across the full world
      cx.drawImage(A.map, 0, 0);
    }
    cx.restore();
  } else {
    cx.fillStyle = 'rgba(80,150,240,0.3)';
    cx.font = '12px sans-serif';
    cx.textAlign = 'center';
    cx.fillText('LOADING...', cw / 2, ch / 2);
    requestAnimationFrame(r);
    return;
  }

  // Don't render units or run ticks until game started
  if (!S || !S.gameStarted) { requestAnimationFrame(r); return; }
  if (!S.pause) { acc += dt * S.spd; while (acc >= 1 / 60) { acc -= 1 / 60; try { tick(); } catch(e) { console.error('Tick error:',e); acc=0; } } }

  const sc = Math.max(S.zoom, 0.05);
  const fontSize = Math.max(4, Math.min(12, 7 * sc));

  cx.save();
  cx.translate(cw / 2, ch / 2);
  cx.scale(sc, sc);
  cx.translate(-S.camX, -S.camY);

  // ---- DRAW SMOKE (behind everything) ----
  updateSmoke();
  drawSmoke();

  // ---- DRAW SAM radar circles ----
  S.sam.forEach(s => {
    if (!s.alive) return;
    drawRadarCircle(s.x, s.y, s.rngR);
  });

  // ---- DRAW selection box ----
  if (S.selBox) {
    const bx = S.selBox;
    cx.strokeStyle = 'rgba(43,111,219,0.5)';
    cx.lineWidth = 1 / sc;
    cx.setLineDash([4 / sc, 6 / sc]);
    cx.strokeRect(bx.x1, bx.y1, bx.x2 - bx.x1, bx.y2 - bx.y1);
    cx.setLineDash([]);
    cx.fillStyle = 'rgba(43,111,219,0.05)';
    cx.fillRect(bx.x1, bx.y1, bx.x2 - bx.x1, bx.y2 - bx.y1);
  }

  // ---- DRAW BASES & BUILDINGS ----
  S.bases.forEach(b => {
    if (!b.alive) return;
    const fSize = fontSize * ICONS.airbase.sc;
    // Buildings use their own icon, airbases use the airbase icon
    const iconChar = b.isBuilding ? (b.buildingIcon || '■') : ICONS.airbase.char;
    drawUIIcon(iconChar, b.x, b.y, b.side, fSize);
  });

  // ---- DRAW SAMs ----
  S.sam.forEach(s => {
    if (!s.alive) return;
    const fSize = fontSize * ICONS.sam.sc;
    if (S.sel === s) drawSelectionCircle(s.x, s.y, fSize * 0.9);
    drawUIIcon(ICONS.sam.char, s.x, s.y, s.side, fSize);
    if (S.sel === s) drawHPBar(s.x, s.y, s.hp, 350, 14 / sc);
  });

  // ---- DRAW SHIPS ----
  S.ships.forEach(s => {
    if (!s.alive) return;
    const isCarrier = s.maxHP > 800;
    const isSub = s.maxHP < 200 && s.maxHP > 0;
    let icon = ICONS.ship;
    if (isCarrier) { icon = ICONS.carrier; }
    else if (isSub) { icon = ICONS.submarine; }
    const fSize = fontSize * icon.sc;
    // Carriers don't rotate (horizontal), subs don't rotate either
    const rot = (isCarrier || isSub) ? undefined : (s.h - 90) * Math.PI / 180;
    if (S.sel === s) drawSelectionCircle(s.x, s.y, fSize * 1.0);
    drawUIIcon(icon.char, s.x, s.y, s.side, fSize, undefined, rot);
    if (S.sel === s) drawHPBar(s.x, s.y, s.hp, s.maxHP, 14 / sc);
  });

  // ---- DRAW AIRCRAFT ----
  // FIX: `icon` and `fSize` used to be declared with const INSIDE each
  // branch of the if(a.groupId){...}else{...} below, but the
  // "Detected indicator" block after that if/else also referenced them.
  // That threw a ReferenceError (icon/fSize not defined) the moment a
  // SELECTED aircraft became radar-detected, which silently killed the
  // whole render loop. Both are now computed ONCE, before the branch, so
  // they're in scope for everything below.
  const renderedGroups = {};
  S.ac.forEach(a => {
    if (!a.alive || a.spawnDelay > 0) return;
    const isDrone = a.role === 'recon_drone' || a.role === 'strike_drone' || a.role === 'ucav';
    const icon = isDrone ? ICONS.drone : ICONS.aircraft;
    const fSize = fontSize * icon.sc;
    const rot = (a.h - 90) * Math.PI / 180;

    // Check if grouped
    if (a.groupId) {
      if (renderedGroups[a.groupId]) return;
      renderedGroups[a.groupId] = true;
      const cnt = S.ac.filter(x => x.alive && x.groupId === a.groupId).length;
      if (S.sel === a || S.sels.includes(a)) drawSelectionCircle(a.x, a.y, fSize * 0.9);
      drawUIIcon(icon.char, a.x, a.y, a.side, fSize, undefined, rot);
      // Group count badge
      if (cnt > 1) {
        cx.save();
        cx.fillStyle = 'rgba(0,0,0,0.7)';
        cx.font = `bold ${Math.max(5, fontSize * 0.6)}px "Segoe UI", sans-serif`;
        cx.textAlign = 'center';
        cx.fillText('×' + cnt, a.x + fSize * 0.6 + 2 / sc, a.y - fSize * 0.6 - 2 / sc);
        cx.fillStyle = '#ffcc44';
        cx.fillText('×' + cnt, a.x + fSize * 0.6, a.y - fSize * 0.6);
        cx.restore();
      }
    } else {
      if (S.sel === a || S.sels.includes(a)) drawSelectionCircle(a.x, a.y, fSize * 0.9);
      drawUIIcon(icon.char, a.x, a.y, a.side, fSize, undefined, rot);
    }
    // Detected indicator
    if (a.dt && a === S.sel) {
      cx.save();
      cx.fillStyle = 'rgba(255,200,64,0.9)';
      cx.font = `bold ${Math.max(5, fontSize * 0.7)}px "Segoe UI", sans-serif`;
      cx.textAlign = 'center';
      cx.fillText('‼', a.x, a.y - fSize * icon.sc * 0.8 - 4 / sc);
      cx.restore();
    }
    // Waypoint line
    if (Math.hypot(a.tx - a.x, a.ty - a.y) > 3) {
      cx.strokeStyle = a.side === 'blue' ? 'rgba(43,111,219,0.15)' : 'rgba(219,43,43,0.15)';
      cx.lineWidth = 1 / sc;
      cx.setLineDash([3 / sc, 4 / sc]);
      cx.beginPath();
      cx.moveTo(a.x, a.y);
      cx.lineTo(a.tx, a.ty);
      cx.stroke();
      cx.setLineDash([]);
    }
  });

  // ---- DRAW BALLISTIC MISSILES (launchers) ----
  S.bm.forEach(b => {
    if (!b.alive) return;
    const fSize = fontSize * ICONS.bm.sc;
    if (S.sel === b) drawSelectionCircle(b.x, b.y, fSize * 0.9);
    drawUIIcon(ICONS.bm.char, b.x, b.y, 'red', fSize);
  });

  // ---- DRAW MISSILES (in flight) ----
  S.mis.forEach(m => {
    if (!m.alive) return;
    // Trail
    if (m.tr && m.tr.length > 1) {
      cx.save();
      cx.beginPath();
      cx.moveTo(m.tr[0].x, m.tr[0].y);
      for (let i = 1; i < m.tr.length; i++) cx.lineTo(m.tr[i].x, m.tr[i].y);
      cx.strokeStyle = m.isBallistic ? 'rgba(255,170,64,0.6)' : m.side === 'blue' ? 'rgba(43,111,219,0.35)' : 'rgba(219,43,43,0.35)';
      cx.lineWidth = m.isBallistic ? 2.5 / sc : 1.5 / sc;
      cx.stroke();
      cx.restore();
    }
    // Missile icon
    const fSize = fontSize * ICONS.missile.sc;
    const ma = Math.atan2(m.ty - m.y, m.tx - m.x);
    // Ballistic missiles: orange/red trail with ▸ icon
    if (m.isBallistic) {
      drawUIIcon('▸', m.x, m.y, 'red', fSize * 1.5, undefined, ma);
    } else if (m.isSAM) {
      drawUIIcon('●', m.x, m.y, m.side, fSize * 0.8);
    } else if (m.side === 'blue') {
      drawUIIcon('▸', m.x, m.y, 'blue', fSize, undefined, ma);
    } else {
      drawUIIcon(ICONS.missile.char, m.x, m.y, 'red', fSize, undefined, ma);
    }
  });

  // ---- DRAW EXPLOSIONS ----
  S.exp.forEach(e => {
    const a = Math.max(0, e.l / e.ml);
    const sz = (e.sz || 10) * (1 + (1 - a) * 0.5);
    cx.save();
    cx.globalAlpha = a * 0.8;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.font = `bold ${sz}px "Segoe UI", sans-serif`;
    // Black outline
    cx.strokeStyle = 'rgba(0,0,0,0.6)';
    cx.lineWidth = Math.max(1, sz * 0.08);
    cx.strokeText('✺', e.x, e.y);
    cx.fillStyle = '#ff5500';
    cx.fillText('✺', e.x, e.y);
    cx.restore();
  });

  // ---- SPONTANEOUS SMOKE from destroyed units ----
  // Ships that are dead
  S.ships.forEach(s => {
    if (!s.alive) {
      if (!s._smokeTimer) s._smokeTimer = 0;
      s._smokeTimer++;
      if (s._smokeTimer % 30 === 0) spawnSmoke(s.x, s.y, 'medium', 120);
    }
  });
  // SAMs that are dead
  S.sam.forEach(s => {
    if (!s.alive) {
      if (!s._smokeTimer) s._smokeTimer = 0;
      s._smokeTimer++;
      if (s._smokeTimer % 40 === 0) spawnSmoke(s.x, s.y, 'light', 80);
    }
  });

  cx.restore();

  // ---- HUD UPDATE ----
  hudTimer += dt;
  if (hudTimer > 0.25) {
    hudTimer = 0;
    _('tbInfo').textContent = 'T:' + S.tick + (S.gameover ? ' END' : '') + '|' + S.spd + '×' + (S.pause ? ' PAUSED' : '');
    const sec = S.tick / 60 | 0;
    _('logTime').textContent = String(sec / 3600 | 0).padStart(2, '0') + ':' + String((sec % 3600) / 60 | 0).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
    if (S.sel) {
      _('siSelName').textContent = S.sel.name || '—';
      _('siSelType').textContent = S.sel.t || (S.sel.spec?.id || '—');
      const sd = sides.find(s => s.id === S.sel.side);
      _('siSelSide').textContent = sd ? sd.name : '—';
      if (S.sel.t === 'ac') _('siSelHP').textContent = 'FUEL:' + (S.sel.fu | 0) + '%' + (S.sel.isTanker ? ' [TANKER]' : S.sel.isAwacs ? ' [AWACS]' : '');
      else if (S.sel.t === 'ship') _('siSelHP').textContent = 'HP:' + (S.sel.hp | 0) + '/' + (S.sel.maxHP || 300);
      else if (S.sel.t === 'base') _('siSelHP').textContent = 'AC:' + (S.sel.ac || 0) + '/' + (S.sel.maxAC || 100);
      else _('siSelHP').textContent = 'HP:' + (S.sel.hp || 0);
      _('siSelWpn').textContent = S.sel.wp ? S.sel.wp.map(w => w.id + ':' + w.cnt).join(' ') : (S.sel.maxM !== undefined ? 'M:' + S.sel.maxM : '—');
    } else {
      ['siSelName', 'siSelType', 'siSelSide', 'siSelHP', 'siSelWpn'].forEach(i => _(i).textContent = '—');
    }
    _('siStatus').textContent = S.gameover ? 'END' : 'ACTIVE';
  }

  requestAnimationFrame(r);
}
requestAnimationFrame(r);