// ============================================================================
// terrain.js — COMBINED TERRAIN SYSTEM (final merged file)
// ============================================================================
// This replaces THREE previously separate files:
//   1. worldTerrainRegions.js  (region boxes, getTerrainAtPosition, coarse
//                               isOceanPosition)
//   2. terrainSystem.js        (radar masking, mountain blocking, stealth
//                               bonus, radar horizon, terrain-following)
//   3. terrainPixelReader.js   (pixel-accurate isOceanPosition)
//
// WHY THIS FILE EXISTS: (1) and (2) each declared their own top-level
// `const TERRAIN_TYPES = {...}` with DIFFERENT shapes. Loading both in the
// same page throws `SyntaxError: Identifier 'TERRAIN_TYPES' has already
// been declared` and silently breaks every script that loads after it.
// This file merges them into ONE TERRAIN_TYPES object with every field
// either file used (radarVisibilityMultiplier, stealthBonus,
// movementPenalty, isWater, elevationMeters), so nothing collides.
//
// Only load THIS file for terrain — delete the old <script> tags for
// worldTerrainRegions.js, terrainSystem.js, and terrainPixelReader.js.
//
// PIXEL-ACCURATE OCEAN DETECTION requires the page to be served over
// http(s), not opened as a file:// URL:
//   python3 -m http.server 8000      (then open http://localhost:8000)
// Reading pixels out of a canvas that drew a file:// image throws a
// SecurityError ("tainted canvas") — that's a browser restriction, not a
// bug in this file. Until the map image finishes loading/indexing (or if
// pixel reading fails, e.g. still on file://), isOceanPosition() falls
// back to the coarse WORLD_TERRAIN_REGIONS boxes below so placement still
// works during that brief window.
// ============================================================================

// ============================================================================
// TERRAIN TYPES — merged shape (union of both original files' fields)
// ============================================================================
const TERRAIN_TYPES = {
  ocean:            { elevationMeters: 0,    radarVisibilityMultiplier: 1.00, stealthBonus: 0.00, movementPenalty: 1.00, isWater: true  },
  plains:           { elevationMeters: 200,  radarVisibilityMultiplier: 1.00, stealthBonus: 0.00, movementPenalty: 1.00, isWater: false },
  desert:           { elevationMeters: 300,  radarVisibilityMultiplier: 0.92, stealthBonus: 0.03, movementPenalty: 1.02, isWater: false },
  forest:           { elevationMeters: 400,  radarVisibilityMultiplier: 0.78, stealthBonus: 0.10, movementPenalty: 1.06, isWater: false },
  hills:            { elevationMeters: 1200, radarVisibilityMultiplier: 0.82, stealthBonus: 0.12, movementPenalty: 1.10, isWater: false },
  mountains:        { elevationMeters: 4500, radarVisibilityMultiplier: 0.45, stealthBonus: 0.22, movementPenalty: 1.20, isWater: false },
  extremeMountains: { elevationMeters: 8000, radarVisibilityMultiplier: 0.22, stealthBonus: 0.35, movementPenalty: 1.40, isWater: false }
};

// ============================================================================
// WORLD TERRAIN REGIONS (3600 x 1800 map coordinates)
// Used for: elevation/stealth/radar-masking lookups everywhere, AND as the
// fallback for isOceanPosition() during the brief window before the pixel
// map has finished loading (see bottom of file).
// ============================================================================
const WORLD_TERRAIN_REGIONS = [
  // ---- MAJOR OCEANS ----
  { name: "Pacific Ocean",        type: "ocean", x: 0,    y: 200,  width: 900, height: 1400 },
  { name: "Atlantic Ocean",       type: "ocean", x: 1500, y: 200,  width: 500, height: 1400 },
  { name: "Indian Ocean",         type: "ocean", x: 2400, y: 600,  width: 500, height: 1000 },
  { name: "Mediterranean Sea",    type: "ocean", x: 2050, y: 520,  width: 280, height: 100 },
  { name: "Red Sea",              type: "ocean", x: 2250, y: 600,  width: 30,  height: 150 },
  { name: "Persian Gulf",         type: "ocean", x: 2170, y: 670,  width: 60,  height: 80 },
  { name: "Black Sea",            type: "ocean", x: 2240, y: 460,  width: 80,  height: 50 },
  { name: "Sea of Japan",         type: "ocean", x: 3100, y: 400,  width: 80,  height: 150 },
  { name: "East China Sea",       type: "ocean", x: 3000, y: 560,  width: 120, height: 100 },
  { name: "South China Sea",      type: "ocean", x: 2900, y: 680,  width: 200, height: 250 },
  { name: "Bay of Bengal",        type: "ocean", x: 2520, y: 700,  width: 100, height: 200 },
  { name: "Caribbean Sea",        type: "ocean", x: 1650, y: 780,  width: 150, height: 100 },
  { name: "Baltic Sea",           type: "ocean", x: 2030, y: 370,  width: 100, height: 60 },
  { name: "North Sea",            type: "ocean", x: 1990, y: 370,  width: 40,  height: 70 },
  { name: "Arctic Ocean",         type: "ocean", x: 1200, y: 0,    width: 800, height: 120 },
  { name: "Southern Ocean",       type: "ocean", x: 0,    y: 1600, width: 3600, height: 200 },

  // ---- MOUNTAIN RANGES ----
  { name: "Himalayas",            type: "extremeMountains", x: 2450, y: 580,  width: 250, height: 120 },
  { name: "Iranian Mountains",    type: "mountains",         x: 2150, y: 610,  width: 200, height: 80 },
  { name: "Alps",                 type: "mountains",         x: 2050, y: 420,  width: 80,  height: 50 },
  { name: "Andes",                type: "extremeMountains", x: 1700, y: 1600, width: 40,  height: 150 },
  { name: "Rocky Mountains",      type: "mountains",         x: 1000, y: 500,  width: 120, height: 350 },

  // ---- OTHER TERRAIN ----
  { name: "Amazon Rainforest",    type: "forest", x: 1700, y: 1650, width: 200, height: 100 },
  { name: "Sahara Desert",        type: "desert", x: 1800, y: 680,  width: 400, height: 180 },
  { name: "Gobi Desert",          type: "desert", x: 2850, y: 460,  width: 150, height: 100 }
];

// ============================================================================
// REGION LOOKUP
// ============================================================================
function getTerrainAtPosition(x, y) {
  for (let i = 0; i < WORLD_TERRAIN_REGIONS.length; i++) {
    const region = WORLD_TERRAIN_REGIONS[i];
    if (x >= region.x && x <= region.x + region.width &&
        y >= region.y && y <= region.y + region.height) {
      return region;
    }
  }
  return { name: "Open Plains", type: "plains" };
}

function getTerrainStats(type) {
  return TERRAIN_TYPES[type] || TERRAIN_TYPES.plains;
}

function applyTerrainEffects(unit, terrain) {
  const stats = getTerrainStats(terrain.type);
  if (unit.currentRadarVisibility === undefined) unit.currentRadarVisibility = 1.0;
  unit.currentRadarVisibility *= stats.radarVisibilityMultiplier;
  if (unit.currentStealthBonus === undefined) unit.currentStealthBonus = 0;
  unit.currentStealthBonus += stats.stealthBonus;
  if (unit.currentMovementPenalty === undefined) unit.currentMovementPenalty = 1.0;
  unit.currentMovementPenalty = Math.max(unit.currentMovementPenalty, stats.movementPenalty);
}

// ============================================================================
// RADAR MASKING / MOUNTAIN BLOCKING / STEALTH (from terrainSystem.js)
// These take a `terrain` object — pass the result of getTerrainAtPosition(),
// which now carries elevationMeters via the merged TERRAIN_TYPES above.
// ============================================================================
function calculateTerrainMasking(aircraft, radar, terrain) {
  const stats = getTerrainStats(terrain.type);
  let visibility = radar.radarPower;
  if (aircraft.altitudeMeters < 1500) visibility *= 0.72;   // low-altitude reduces detection
  visibility *= stats.radarVisibilityMultiplier;             // terrain blocks radar
  visibility -= (aircraft.stealthFactor || 0);                // stealth reduces visibility
  visibility -= (aircraft.electronicWarfareStrength || 0) * 0.2; // ECM helps
  return Math.max(0, visibility);
}

function radarCanDetectTarget(radar, aircraft, terrain) {
  return calculateTerrainMasking(aircraft, radar, terrain) > 0.35;
}

function isRadarBlockedByMountain(aircraft, terrain) {
  const stats = getTerrainStats(terrain.type);
  return stats.elevationMeters > aircraft.altitudeMeters;
}

function missileHitsTerrain(missile, terrain) {
  const stats = getTerrainStats(terrain.type);
  return missile.altitudeMeters < stats.elevationMeters;
}

function calculateStealthBonus(aircraft, terrain) {
  let bonus = getTerrainStats(terrain.type).stealthBonus || 0;
  if (aircraft.altitudeMeters < 1000) bonus += 0.15;
  return bonus;
}

function calculateRadarHorizon(radarAltitudeMeters) {
  return Math.sqrt(12.74 * radarAltitudeMeters);
}

function terrainFollowingFlight(aircraft, terrain) {
  const stats = getTerrainStats(terrain.type);
  const safeAltitude = stats.elevationMeters + 300;
  if (aircraft.altitudeMeters < safeAltitude) {
    aircraft.altitudeMeters = safeAltitude;
  }
}

// ============================================================================
// PIXEL-ACCURATE OCEAN DETECTION (from terrainPixelReader.js)
// Overrides isOceanPosition below with a real lookup against the actual
// world_small.jpg pixels instead of the coarse boxes above. Falls back to
// the region boxes only while the image is still loading/indexing.
// ============================================================================
(function () {
  const MAP_IMAGE_SRC = 'assets/world_small.jpg';
  let mapImageData = null, mapImgW = 0, mapImgH = 0, ready = false;

  function loadAndIndex(img) {
    const off = document.createElement('canvas');
    off.width = img.naturalWidth || img.width;
    off.height = img.naturalHeight || img.height;
    const octx = off.getContext('2d', { willReadFrequently: true });
    octx.drawImage(img, 0, 0, off.width, off.height);
    try {
      const data = octx.getImageData(0, 0, off.width, off.height);
      mapImageData = data.data;
      mapImgW = off.width;
      mapImgH = off.height;
      ready = true;
      console.log('[terrain.js] Pixel terrain map indexed: ' + mapImgW + 'x' + mapImgH);
    } catch (err) {
      console.error('[terrain.js] Could not read map pixels — likely opened via file:// instead of http(s)://. Run e.g. `python3 -m http.server` and open http://localhost:8000. Falling back to coarse region boxes until this is fixed.', err);
      ready = false;
    }
  }

  function initFromExistingAsset() {
    if (typeof A !== 'undefined' && A.map && A.map.complete && A.map.naturalWidth) {
      loadAndIndex(A.map);
      return true;
    }
    return false;
  }

  if (!initFromExistingAsset()) {
    const img = new Image();
    img.onload = () => loadAndIndex(img);
    img.onerror = () => console.error('[terrain.js] Failed to load ' + MAP_IMAGE_SRC);
    img.src = MAP_IMAGE_SRC;
    const poll = setInterval(() => {
      if (ready) { clearInterval(poll); return; }
      if (initFromExistingAsset()) clearInterval(poll);
    }, 250);
    setTimeout(() => clearInterval(poll), 15000);
  }

  // Blue-dominant -> ocean; near-white/gray (ice/snow/cloud) -> land.
  // Starting-point thresholds — tell me if a specific region misreads on
  // your actual world_small.jpg and I'll tune these.
  function classifyPixel(r, g, b) {
    const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
    if (minC > 180 && (maxC - minC) < 25) return false;
    if (b > r + 12 && b >= g) return true;
    return false;
  }

  function pixelIsOcean(px, py) {
    if (!ready) return null;
    const ix = Math.max(0, Math.min(mapImgW - 1, Math.floor(px)));
    const iy = Math.max(0, Math.min(mapImgH - 1, Math.floor(py)));
    const idx = (iy * mapImgW + ix) * 4;
    return classifyPixel(mapImageData[idx], mapImageData[idx + 1], mapImageData[idx + 2]);
  }

  // world-space (x,y) in WORLD.mapW x WORLD.mapH (3600x1800) -> true if water
  window.isOceanPosition = function (x, y) {
    const W = (typeof CMO !== 'undefined' && CMO.WORLD) ? CMO.WORLD : { mapW: 3600, mapH: 1800 };
    if (ready) {
      const result = pixelIsOcean((x / W.mapW) * mapImgW, (y / W.mapH) * mapImgH);
      if (result !== null) return result;
    }
    return getTerrainAtPosition(x, y).type === 'ocean'; // fallback while loading
  };

  window.isTerrainPixelReaderReady = function () { return ready; };
})();

// ============================================================================
// EXPORT (Node/module compatibility, matching original files)
// ============================================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TERRAIN_TYPES,
    WORLD_TERRAIN_REGIONS,
    getTerrainAtPosition,
    getTerrainStats,
    applyTerrainEffects,
    calculateTerrainMasking,
    radarCanDetectTarget,
    isRadarBlockedByMountain,
    missileHitsTerrain,
    calculateStealthBonus,
    calculateRadarHorizon,
    terrainFollowingFlight
    // isOceanPosition is attached to window, not exported here, since it
    // depends on browser canvas/Image APIs.
  };
}