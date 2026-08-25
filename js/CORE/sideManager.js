// ============================================================================
// sideManager.js — CMO SIDE & HOSTILITY MANAGER
// ============================================================================
// Hostility is derived from the sides relationship matrix, not per-target flags.
// This prevents desync between target database and side definitions.
// ============================================================================

const SIDES = {
  BLUE: 'blue',
  RED: 'red',
  NEUTRAL: 'neutral'
};

// Relationship matrix:
//   'friendly'  → same side or allied (no engagement)
//   'hostile'   → enemy (may engage)
//   'neutral'   → non-hostile, non-friendly (no engagement unless attacked)
const DEFAULT_RELATIONSHIPS = {
  blue:   { blue: 'friendly', red: 'hostile', neutral: 'neutral' },
  red:    { blue: 'hostile',  red: 'friendly', neutral: 'neutral' },
  neutral:{ blue: 'neutral',  red: 'neutral', neutral: 'friendly' }
};

// Custom sides can be added at runtime
const customRelationships = [];

function getRelationship(attackerSide, targetSide) {
  // Check custom relationships first
  for (const cr of customRelationships) {
    if (cr.attacker === attackerSide && cr.target === targetSide) {
      return cr.relationship;
    }
  }
  // Fall back to defaults
  const row = DEFAULT_RELATIONSHIPS[attackerSide];
  if (!row) return 'neutral';
  return row[targetSide] || 'neutral';
}

function isHostile(attackerSide, targetSide) {
  return getRelationship(attackerSide, targetSide) === 'hostile';
}

function isFriendly(attackerSide, targetSide) {
  return getRelationship(attackerSide, targetSide) === 'friendly';
}

function isNeutral(attackerSide, targetSide) {
  return getRelationship(attackerSide, targetSide) === 'neutral';
}

function setRelationship(attackerSide, targetSide, relationship) {
  // Remove existing custom relationship for this pair
  const idx = customRelationships.findIndex(
    cr => cr.attacker === attackerSide && cr.target === targetSide
  );
  if (idx !== -1) customRelationships.splice(idx, 1);
  
  customRelationships.push({
    attacker: attackerSide,
    target: targetSide,
    relationship: relationship
  });
}

function getSideDisplayName(sideId) {
  const names = {
    blue: 'BLUFOR',
    red: 'OPFOR',
    neutral: 'NEUTRAL'
  };
  return names[sideId] || sideId.toUpperCase();
}

function getSideColor(sideId) {
  const colors = {
    blue: '#4a8cf5',
    red: '#e55a5a',
    neutral: '#8ab4e8'
  };
  return colors[sideId] || '#888888';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SIDES, DEFAULT_RELATIONSHIPS,
    getRelationship, isHostile, isFriendly, isNeutral,
    setRelationship, getSideDisplayName, getSideColor
  };
}