// ======================================================
// intelligentTargetAllocationSystem.js
// ======================================================
//
// PURPOSE:
// Prevent units from wasting weapons.
//
// Used for:
// - SAM systems
// - aircraft
// - ships
// - bombers
// - submarines
//
// ======================================================

// ======================================================
// GLOBAL TARGET DATABASE
// ======================================================
const GLOBAL_TARGET_DATABASE = [];

// ======================================================
// TARGET STRUCTURE
// ======================================================
function createTargetData(target) {
  return {
    id: target.id || Math.random().toString(36).slice(2),
    type: target.type,
    hp: target.hp || 100,
    positionX: target.x,
    positionY: target.y,
    alreadyAssignedWeapons: 0,
    requiredWeaponsToKill: 1,
    threatLevel: 0,
    currentlyTargetedBy: [],
    // ----- STATUS CHECKS -----
    // Default all gates to false — sensor/detection system must populate these.
    // A false default means "unknown/unconfirmed" — the allocator will NOT engage.
    detected: target.detected !== undefined ? target.detected : false,
    identified: target.identified !== undefined ? target.identified : false,
    // hostile is now determined by sideManager.isHostile() — kept here for backward compat
    hostile: target.hostile !== undefined ? target.hostile : false,
    trackQuality: target.trackQuality !== undefined ? target.trackQuality : 0,
    // Store the target's side for side-based hostility check
    side: target.side || 'neutral'
  };
}

// ======================================================
// THREAT LEVEL CALCULATION
// ======================================================
function calculateThreatLevel(target) {
  let threat = 0;

  if (target.type === "aircraft") threat += 100;
  if (target.stealth === true) threat += 80;
  if (target.role === "bomber") threat += 120;
  if (target.role === "awacs") threat += 200;
  if (target.type === "missile") threat += 300;
  if (target.hp < 30) threat += 20;

  return threat;
}

// ======================================================
// REQUIRED WEAPONS CALCULATION
// ======================================================
function calculateWeaponsNeeded(target) {
  if (target.type === "missile") return 1;
  if (target.role === "fighter") return 1;
  if (target.role === "bomber") return 2;
  if (target.type === "destroyer") return 4;
  if (target.type === "carrier") return 10;
  return 1;
}

// ======================================================
// MISSILE INVENTORY CHECK
// ======================================================
function hasAvailableWeapons(unit) {
  // unit.missileCount: how many missiles the unit currently has
  // unit.maxMissiles: maximum capacity (optional)
  if (unit.missileCount !== undefined) {
    return unit.missileCount > 0;
  }
  // If no inventory system exists, assume weapons are available
  return true;
}

// ======================================================
// RELOAD STATUS CHECK
// ======================================================
function isReadyToFire(unit) {
  // unit.isReloading: boolean flag indicating the unit is currently reloading
  // unit.reloadTimer: countdown turns until reload completes (unit cannot fire while > 0)
  if (unit.isReloading === true) return false;
  if (unit.reloadTimer !== undefined && unit.reloadTimer > 0) return false;
  // If no reload system exists, assume unit is ready
  return true;
}

// ======================================================
// TRACK QUALITY THRESHOLD
// ======================================================
const TRACK_QUALITY_MINIMUM = 0.4;

function hasValidTrack(target) {
  return target.trackQuality >= TRACK_QUALITY_MINIMUM;
}

// ======================================================
// UPDATE TARGET DATABASE
// ======================================================
function updateTargetDatabase(allTargets) {
  GLOBAL_TARGET_DATABASE.length = 0;
  for (let i = 0; i < allTargets.length; i++) {
    const target = createTargetData(allTargets[i]);
    target.threatLevel = calculateThreatLevel(allTargets[i]);
    target.requiredWeaponsToKill = calculateWeaponsNeeded(allTargets[i]);
    GLOBAL_TARGET_DATABASE.push(target);
  }
}

// ======================================================
// SORT TARGETS
// ======================================================
function sortTargetsByThreat() {
  GLOBAL_TARGET_DATABASE.sort((a, b) => b.threatLevel - a.threatLevel);
}

// ======================================================
// FIND BEST TARGET
// ======================================================
function findBestTarget(unit) {
  // --- Unit-level pre-checks ---
  // 1. Missile inventory check
  if (!hasAvailableWeapons(unit)) return null;

  // 2. Reload status check
  if (!isReadyToFire(unit)) return null;

  sortTargetsByThreat();

  for (let i = 0; i < GLOBAL_TARGET_DATABASE.length; i++) {
    const target = GLOBAL_TARGET_DATABASE[i];

    // --- Over-targeting prevention ---
    if (target.alreadyAssignedWeapons >= target.requiredWeaponsToKill) continue;

    // --- Range check ---
    const distance = Math.hypot(unit.x - target.positionX, unit.y - target.positionY);
    if (unit.weaponRange && distance > unit.weaponRange) continue;

    // --- NEW: Status check gates ---

    // 3. Detected check
    if (!target.detected) continue;

    // 4. Identified check (friend or foe)
    if (!target.identified) continue;

    // 5. Hostile check (only engage confirmed hostiles)
    if (!target.hostile) continue;

    // 6. Track quality check (reject poor-quality tracks)
    if (!hasValidTrack(target)) continue;

    // --- Assign target ---
    target.alreadyAssignedWeapons += 1;
    target.currentlyTargetedBy.push(unit.id || "unknown");
    return target;
  }
  return null;
}

// ======================================================
// AIR DEFENSE FIRING
// ======================================================
function airDefenseEngageTargets(samSystem) {
  const target = findBestTarget(samSystem);
  if (target === null) return;
  launchSAMMissile(samSystem, target);
}

// ======================================================
// AIRCRAFT STRIKE LOGIC
// ======================================================
function aircraftStrikeLogic(aircraft) {
  const target = findBestTarget(aircraft);
  if (target === null) return;
  launchWeapon(aircraft, target);
}

// ======================================================
// MASS AIR RAID EXAMPLE
// ======================================================
//
// 100 enemy fighters detected
//
// S-400 battery calculates:
//
// - SAM 1 -> Fighter A
// - SAM 2 -> Fighter B
// - SAM 3 -> Fighter C
//
// instead of:
//
// ALL SAMS -> Fighter A
//
// ======================================================

// ======================================================
// STRIKE PACKAGE EXAMPLE
// ======================================================
//
// 20 F-35s attacking:
//
// - Bunker 1
// - Radar Site 1
// - Airbase 1
// - SAM Site 1
//
// instead of:
//
// ALL aircraft bombing SAME bunker
//
// ======================================================

// Placeholder functions (to be connected to combat system)
function launchSAMMissile(sam, target) { console.log(`SAM ${sam.id} engages target ${target.id}`); }
function launchWeapon(unit, target) { console.log(`${unit.id} fires at ${target.id}`); }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GLOBAL_TARGET_DATABASE, createTargetData, calculateThreatLevel,
    calculateWeaponsNeeded, updateTargetDatabase, sortTargetsByThreat,
    findBestTarget, airDefenseEngageTargets, aircraftStrikeLogic,
    hasAvailableWeapons, isReadyToFire, hasValidTrack
  };
}