// ============================================================================
// CMO — CORE ENGINE v2.1 — TICK RATE FIX
// ============================================================================
// All timing, physics, and speed logic in ONE place.
// Don't modify speeds anywhere else.
//
// FIXED (v2.1): pxPerTick() and createSAMSite()'s reloadMax previously
// assumed "1 tick = 1 real second", but tick() is actually invoked
// GAME_TICK_RATE (60) times per real second — every other per-tick constant
// in the codebase (a2aCooldown=45, a2gCooldown=60, detectionDelay=3*60,
// fuel drain rate) is already calibrated to that 60-ticks/sec reality.
// Because pxPerTick/reloadMax were NOT dividing/scaling by GAME_TICK_RATE,
// every aircraft and missile moved 60x too fast, AND every SAM's reload
// (e.g. reloadS:8 -> meant to be an 8-SECOND cooldown) was being treated as
// an 8-TICK cooldown -> ~0.13 real seconds -> the SAM dumped its entire
// missile stock almost instantly instead of firing one shot every 8s.
// That one mismatch was the cause of both "shooting way too many missiles"
// and "everything moves way too fast".
// ============================================================================

// ============================================================================
// WORLD CONSTANTS
// ============================================================================
const WORLD = {
  mapW: 3600,
  mapH: 1800,
  kpp: 11.16
};

// ============================================================================
// TIME CONTROL — everything derives from these values
// ============================================================================
const GAME_TICK_RATE = 60;          // tick() is called 60x per real second
const GAME_COMPRESSION = 5;         // 1x = real-time (raise this to speed up sim time)

function pxPerSecond(kmh) {
  return (kmh / 3600) / WORLD.kpp;
}

// FIX: this now correctly returns px-per-FRAME given tick() runs at
// GAME_TICK_RATE frames/sec, instead of silently assuming 1 tick = 1 sec.
function pxPerTick(kmh) {
  return (pxPerSecond(kmh) * GAME_COMPRESSION) / GAME_TICK_RATE;
}

function machToPxPerTick(mach) {
  return pxPerTick(mach * 1225);  // Mach 1 = 1225 km/h
}

// Convert a duration in seconds (as used throughout airDefense.js/weapons
// data, e.g. reloadS, detectionDelay-in-seconds, etc.) into a tick count
// for this engine's 60-tick/sec loop. Use this anywhere a spec gives you
// seconds and you need to store/compare it against S.tick or a per-tick
// countdown.
function secondsToTicks(sec) {
    return (sec || 0) * GAME_TICK_RATE;  // real seconds -> ticks. GC only scales movement, NOT cooldown/reload timing
}

// ============================================================================
// MISSILE SPEEDS — derived from mach only
// ============================================================================
function missileGameSpeed(missileId) {
  try {
    const db = (typeof MISSILE_DB !== 'undefined') ? MISSILE_DB : (typeof WEAPONS_DB !== 'undefined') ? WEAPONS_DB : null;
    const entry = db ? db[missileId] : null;
    if (entry && entry.mach) return machToPxPerTick(entry.mach);
    return machToPxPerTick(4);  // fallback to Mach 4
  } catch(e) {
    return machToPxPerTick(4);
  }
}

// ============================================================================
// UNIT CREATORS
// ============================================================================
function createAircraft(spec, side, x, y) {
  const cruiseKMH = spec.cruiseKMH || (spec.speed && spec.speed.cruiseKMH) || 850;
  const isTanker = spec.role === 'tanker';
  const isAwacs = spec.role === 'awacs';
  return {
    id: 'ac' + Date.now() + '_' + (Math.random() * 99999 | 0),
    t: 'ac', side, name: (spec && spec.name) || 'Unknown Aircraft',
    x, y, tx: x, ty: y, h: 0,
    spd: pxPerTick(cruiseKMH),
    maxSpd: pxPerTick(spec.maxKMH || (spec.speed && spec.speed.maxKMH) || 1930),
    fu: isTanker ? 200 : 70, hp: (spec && spec.hp) || 100, alive: true, dt: false,
    alt: 12000,
    thr: 100, wc: 0, spawnDelay: 0,
    radarKM: (spec && spec.radarKM) || 200,
    stealth: spec.stealth || false,
    rcs: spec.rcs || 5,
        ecm: spec.ecm || 50,
    cm: (spec && spec.cm) || 40,        // countermeasures (flares/chaff) — expended vs inbound missiles
    evadeT: 0, flareT: 0,
    spec: spec,
    wp: spec.defaultLoadout ? spec.defaultLoadout.map(w => ({...w})) : [{id:'aim120c',cnt:4}]
  };
}

function createSAMSite(spec, side, x, y) {
  return {
    id: 'sam' + Date.now() + '_' + (Math.random() * 99999 | 0),
    t: 'sam', side, name: (spec && spec.name) || 'Unknown SAM',
    x, y, alive: true, hp: (spec && spec.hp) || 350,
    maxM: (spec && spec.maxMissiles) || 16,
    rngR: (spec && spec.radarKM) || 600,
    rngE: (spec && spec.engageKM) || 380,
    // FIX: reloadS from airDefense.js is in SECONDS (e.g. s400 reloadS:8
    // means "8 seconds between shots"). This must be converted to TICKS
    // since S.sam's reload/reloadMax counters are decremented once per
    // tick() call, and tick() runs GAME_TICK_RATE (60) times per second —
    // previously this stored the raw seconds value as a tick count, giving
    // an 8-tick (~0.13 real-second) cooldown instead of an 8-second one.
    reload: 0, reloadMax: secondsToTicks((spec && spec.reloadS) || 8),
    spec: spec
  };
}

// ============================================================================
// HELPERS
// ============================================================================
function latLngToXY(lat, lng) {
  return {x:(lng+180)/360*WORLD.mapW, y:(90-lat)/180*WORLD.mapH};
}
function distanceKM(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) * WORLD.kpp;
}

function printSpeedTable() {
  console.log('=== CMO SPEED TABLE ===');
  console.log(`Tick rate: ${GAME_TICK_RATE}/sec, Compression: ${GAME_COMPRESSION}x, Map: ${WORLD.mapW}x${WORLD.mapH}`);
  const ac = [['F-35 cruise',850],['F-35 max',1930],['Airliner',900],['Helicopter',250]];
  ac.forEach(([n,s])=>console.log(`  ${n}: ${pxPerTick(s).toFixed(6)} px/tick (${(pxPerTick(s)*GAME_TICK_RATE).toFixed(4)} px/sec)`));
  console.log('Missiles (derived from mach):');
  try {
    const db = typeof MISSILE_DB !== 'undefined' ? MISSILE_DB : {};
    Object.entries(db).forEach(([id,dbEntry])=>console.log(`  ${id} (Mach ${dbEntry.mach}): ${missileGameSpeed(id).toFixed(6)} px/tick`));
  } catch(e) {}
  console.log('SAM reload example: reloadS:8 ->', secondsToTicks(8), 'ticks (~', (secondsToTicks(8)/GAME_TICK_RATE).toFixed(1), 'real sec)');
}

window.CMO = {
  WORLD, pxPerTick, machToPxPerTick, missileGameSpeed, secondsToTicks,
  createAircraft, createSAMSite, latLngToXY, distanceKM,
  printSpeedTable, GAME_TICK_RATE, GAME_COMPRESSION
};

console.log('CMO Engine v2.1 loaded (tick-rate fix)');