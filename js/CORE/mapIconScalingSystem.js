// ======================================================
// mapIconScalingSystem.js
// ======================================================
//
// PURPOSE:
// Prevent military unit icons from becoming
// absurdly huge or tiny while zooming.
//
// Similar to:
// Command: Modern Operations style scaling.
//
// ======================================================

// ======================================================
// GLOBAL MAP SETTINGS
// ======================================================
const MAP_SETTINGS = {
  currentZoom: 1,
  minZoom: 0.2,
  maxZoom: 8
};

// ======================================================
// ICON SCALE SETTINGS
// ======================================================
const ICON_SCALE_SETTINGS = {
  aircraft: { minScale: 0.12, maxScale: 0.55, baseScale: 0.22 },
  ships: { minScale: 0.18, maxScale: 0.70, baseScale: 0.30 },
  submarines: { minScale: 0.15, maxScale: 0.50, baseScale: 0.24 },
  airDefense: { minScale: 0.20, maxScale: 0.65, baseScale: 0.32 },
  missiles: { minScale: 0.08, maxScale: 0.25, baseScale: 0.12 }
};

// ======================================================
// APPLY ICON SCALE
// ======================================================
function updateUnitScale(unit) {
  if (!unit) return;
  const zoom = MAP_SETTINGS.currentZoom;
  let settings;

  if (unit.type === "aircraft") settings = ICON_SCALE_SETTINGS.aircraft;
  else if (unit.type === "ship") settings = ICON_SCALE_SETTINGS.ships;
  else if (unit.type === "submarine") settings = ICON_SCALE_SETTINGS.submarines;
  else if (unit.type === "air_defense") settings = ICON_SCALE_SETTINGS.airDefense;
  else if (unit.type === "missile") settings = ICON_SCALE_SETTINGS.missiles;
  else return;

  let scale = settings.baseScale / zoom;
  scale = Math.max(settings.minScale, Math.min(settings.maxScale, scale));
  
  if (unit.sprite) unit.sprite.setScale(scale);
  return scale;
}

// ======================================================
// ZOOM
// ======================================================
function zoomIn(camera) {
  MAP_SETTINGS.currentZoom = Math.min(MAP_SETTINGS.maxZoom, MAP_SETTINGS.currentZoom + 0.2);
  if (camera) camera.setZoom(MAP_SETTINGS.currentZoom);
}

function zoomOut(camera) {
  MAP_SETTINGS.currentZoom = Math.max(MAP_SETTINGS.minZoom, MAP_SETTINGS.currentZoom - 0.2);
  if (camera) camera.setZoom(MAP_SETTINGS.currentZoom);
}

// ======================================================
// UPDATE ALL UNIT ICONS
// ======================================================
function updateAllUnitScales(units) {
  if (!units) return;
  for (let i = 0; i < units.length; i++) {
    updateUnitScale(units[i]);
  }
}