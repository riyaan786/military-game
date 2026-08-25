// ======================================================
// behaviorSystem.js
// ======================================================
//
// THIS FILE CONTROLS:
// - reactions
// - AI decisions
// - evasion
// - target selection
// - combat responses
// - retreat logic
// - radar reactions
// - missile reactions
//
// THIS IS ONE OF THE MOST IMPORTANT FILES
// IN THE ENTIRE GAME.
// ======================================================

// ======================================================
// GLOBAL AI SETTINGS
// ======================================================
const AI_SETTINGS = {
  reactionUpdateInterval: 1,
  aggressionLevel: 0.72,
  retreatThreshold: 0.25,
  friendlySupportRadiusKM: 120,
  threatEvaluationEnabled: true,
  missilePredictionEnabled: true,
  moraleSystemEnabled: false
};

// ======================================================
// AIRCRAFT BEHAVIORS
// ======================================================
const AIRCRAFT_BEHAVIORS = {
  missileDetected: {
    actions: [
      "deploy_chaff",
      "deploy_flares",
      "turn_away_from_missile",
      "increase_speed",
      "descend_altitude",
      "activate_electronic_warfare"
    ],
    reactionTimeSeconds: 2,
    panicChance: 0.08
  },
  lowFuel: {
    actions: ["return_to_base", "reduce_speed", "avoid_combat"],
    fuelThreshold: 20
  },
  enemyDetected: {
    actions: ["lock_target", "evaluate_threat", "launch_missile", "maintain_distance"]
  },
  radarLocked: {
    actions: ["evade", "break_lock", "change_direction", "drop_altitude"]
  },
  damaged: {
    actions: ["retreat", "call_support", "reduce_aggression"],
    hpThreshold: 40
  },
  outOfMissiles: {
    actions: ["retreat", "return_to_base"]
  }
};

// ======================================================
// AIR DEFENSE SYSTEM BEHAVIORS
// ======================================================
const AIR_DEFENSE_BEHAVIORS = {
  targetDetected: {
    actions: ["track_target", "calculate_intercept", "prioritize_target", "prepare_launch"]
  },
  stealthTargetDetected: {
    actions: ["increase_radar_power", "multi_radar_tracking", "thermal_tracking", "attempt_lock"]
  },
  incomingMissile: {
    actions: ["activate_countermeasures", "change_priority", "engage_missile"]
  },
  overloaded: {
    actions: ["prioritize_highest_threat", "ignore_low_priority_targets"],
    maxTargetsBeforeOverload: 20
  },
  lowMissiles: {
    actions: ["conserve_ammo", "engage_high_value_targets_only"],
    missileThreshold: 3
  },
  heavilyDamaged: {
    actions: ["shutdown_radar", "retreat", "emergency_reload_abort"],
    hpThreshold: 25
  }
};

// ======================================================
// MISSILE BEHAVIORS
// ======================================================
const MISSILE_BEHAVIORS = {
  launched: {
    actions: ["ignite_engine", "track_target", "accelerate"]
  },
  targetEvading: {
    actions: ["predict_target_path", "increase_turn_rate", "correct_course"]
  },
  lostLock: {
    actions: ["search_target", "self_destruct_after_timeout"],
    timeoutSeconds: 10
  },
  closeToTarget: {
    actions: ["activate_proximity_fuse", "detonate"],
    detonationDistanceKM: 0.2
  },
  hitTarget: {
    actions: ["explode", "apply_damage", "spawn_fire", "spawn_smoke"]
  }
};

// ======================================================
// SHIP BEHAVIORS
// ======================================================
const SHIP_BEHAVIORS = {
  enemyAircraftDetected: {
    actions: ["activate_ship_radar", "launch_sam", "alert_fleet"]
  },
  incomingMissile: {
    actions: ["activate_ciws", "launch_decoys", "evasive_maneuver"]
  },
  submarineThreatDetected: {
    actions: ["deploy_sonar", "launch_antisub_weapons", "change_course"]
  },
  damaged: {
    actions: ["retreat", "damage_control", "reduce_speed"]
  }
};

// ======================================================
// SUBMARINE BEHAVIORS
// ======================================================
const SUBMARINE_BEHAVIORS = {
  enemyShipDetected: {
    actions: ["remain_hidden", "calculate_torpedo_solution", "launch_torpedo"]
  },
  sonarPingDetected: {
    actions: ["reduce_speed", "change_depth", "go_silent"]
  },
  detected: {
    actions: ["evade", "deploy_countermeasures", "retreat"]
  }
};

// ======================================================
// BUILDING / BASE BEHAVIORS
// ======================================================
const BUILDING_BEHAVIORS = {
  airbaseUnderAttack: {
    actions: ["launch_aircraft", "activate_air_defense", "alert_all_units"]
  },
  radarStationDestroyed: {
    actions: ["disable_detection_area", "notify_command"]
  }
};

// ======================================================
// BEHAVIOR ENGINE — THE BRAIN
// ======================================================
class BehaviorEngine {
  constructor() {
    this.reactions = new Map(); // unitId -> { type, timer, action }
    this.threatTable = [];
    this.tick = 0;
  }

  // Evaluate a unit's situation and return actions to execute
  evaluate(unit, threats, worldState) {
    this.tick++;
    const behaviors = [];
    
    // Skip if not time to re-evaluate
    if (this.tick % (AI_SETTINGS.reactionUpdateInterval * 60) !== 0) return behaviors;

    if (!unit || !unit.alive) return behaviors;

    // Determine unit type and get relevant behavior set
    const unitType = this._getUnitType(unit);

    switch (unitType) {
      case 'aircraft':
        behaviors.push(...this._evaluateAircraft(unit, threats));
        break;
      case 'airDefense':
        behaviors.push(...this._evaluateAirDefense(unit, threats));
        break;
      case 'missile':
        behaviors.push(...this._evaluateMissile(unit, threats));
        break;
      case 'ship':
        behaviors.push(...this._evaluateShip(unit, threats));
        break;
      case 'submarine':
        behaviors.push(...this._evaluateSubmarine(unit, threats));
        break;
    }

    return behaviors;
  }

  // Execute behaviors on a unit
  execute(unit, behaviors, delta) {
    if (!unit || !unit.ai) {
      unit.ai = { state: 'idle', timer: 0, detected: false, threats: [] };
    }

    behaviors.forEach(b => this._runAction(unit, b, delta));
  }

  // ============ AIRCRAFT EVALUATION ============
  _evaluateAircraft(unit, threats) {
    const behaviors = [];
    const ai = unit.ai || {};
    
    // Check for incoming missiles (highest priority)
    const incomingMissiles = threats.filter(t => t.isSAM && !t.alive === false);
    if (incomingMissiles.length > 0 && !ai.evading) {
      const closest = incomingMissiles.reduce((a, b) => {
        const da = Math.hypot(a.x - unit.x, a.y - unit.y);
        const db = Math.hypot(b.x - unit.x, b.y - unit.y);
        return da < db ? a : b;
      });
      const dist = Math.hypot(closest.x - unit.x, closest.y - unit.y);
      
      // Trigger evasion within range
      if (dist < 300) {
        behaviors.push('deploy_flares', 'turn_away_from_missile', 'increase_speed');
        ai.evading = true;
        ai.evadeTimer = AIRCRAFT_BEHAVIORS.missileDetected.reactionTimeSeconds * 60;
        
        // Panic check
        if (Math.random() < AIRCRAFT_BEHAVIORS.missileDetected.panicChance) {
          behaviors.push('descend_altitude');
        }
      }
    } else if (ai.evadeTimer > 0) {
      ai.evadeTimer--;
      if (ai.evadeTimer <= 0) ai.evading = false;
    }

    // Check for missile lock
    if (unit.detected && !ai.evading) {
      behaviors.push('lock_target', 'evaluate_threat');
    }

    // Check HP for damage response
    if (unit.hp < AIRCRAFT_BEHAVIORS.damaged.hpThreshold) {
      behaviors.push('retreat', 'reduce_aggression');
    }

    // Check missiles remaining
    if (unit.missileIndex !== undefined && unit.missileIndex >= (unit.missiles?.length || 0)) {
      behaviors.push('return_to_base');
    }

    return behaviors;
  }

  // ============ AIR DEFENSE EVALUATION ============
  _evaluateAirDefense(unit, threats) {
    const behaviors = [];
    const ai = unit.ai || {};
    
    // Check for incoming missiles aimed at this AD
    const incoming = threats.filter(t => !t.isSAM && t.tx !== undefined);
    if (incoming.length > 0) {
      behaviors.push('activate_countermeasures', 'change_priority');
      
      // Try to engage incoming with another missile
      if (unit.missiles > 0 && ai.reloadTimer <= 0) {
        behaviors.push('engage_missile');
      }
    }

    // Stealth detection
    const stealthTargets = threats.filter(t => t.stealth);
    if (stealthTargets.length > 0) {
      behaviors.push('increase_radar_power', 'multi_radar_tracking', 'thermal_tracking');
    }

    // Low ammo
    if (unit.missiles <= AIR_DEFENSE_BEHAVIORS.lowMissiles.missileThreshold) {
      behaviors.push('conserve_ammo', 'engage_high_value_targets_only');
    }

    // Heavy damage
    if (unit.hp < AIR_DEFENSE_BEHAVIORS.heavilyDamaged.hpThreshold) {
      behaviors.push('shutdown_radar', 'retreat');
    }

    return behaviors;
  }

  // ============ MISSILE EVALUATION ============
  _evaluateMissile(unit, threats) {
    const behaviors = [];
    
    // Track target
    behaviors.push('track_target', 'accelerate');

    // Check distance to target for proximity detonation
    if (unit.tx !== undefined && unit.ty !== undefined) {
      const dist = Math.hypot(unit.tx - unit.x, unit.ty - unit.y) * 0.8;
      if (dist < MISSILE_BEHAVIORS.closeToTarget.detonationDistanceKM * 5) {
        behaviors.push('activate_proximity_fuse');
      }
    }

    return behaviors;
  }

  // ============ SHIP EVALUATION ============
  _evaluateShip(unit, threats) {
    const behaviors = [];
    return behaviors;
  }

  // ============ SUBMARINE EVALUATION ============
  _evaluateSubmarine(unit, threats) {
    const behaviors = [];
    return behaviors;
  }

  // ============ ACTION EXECUTION ============
  _runAction(unit, action, delta) {
    switch (action) {
      case 'deploy_chaff':
      case 'deploy_flares':
        // Visual effect — chaff/flare burst
        if (window.addEffect) {
          for (let i = 0; i < 5; i++) {
            window.addEffect('particle', unit.x, unit.y, 0.6,
              (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3,
              3, '#ffffff');
          }
        }
        break;

      case 'turn_away_from_missile':
        // Redirect F-35 away from nearest threat
        if (unit.targetX && unit.speed) {
          // Jink: perpendicular to current heading
          unit.targetX = unit.x + (Math.random() - 0.5) * 200;
          unit.targetY = unit.y + (Math.random() - 0.5) * 200;
        }
        break;

      case 'increase_speed':
        if (unit.speed) unit.speed *= 1.5;
        break;

      case 'descend_altitude':
        // Visual only since we're 2D
        break;

      case 'retreat':
        // Fly back toward start
        if (unit.targetX) {
          unit.targetX = unit.x - 300;
          unit.targetY = unit.y + (Math.random() - 0.5) * 100;
        }
        break;

      case 'return_to_base':
        // Same as retreat
        if (unit.targetX) {
          unit.targetX = 100;
          unit.targetY = unit.y;
        }
        break;

      case 'reduce_aggression':
        // Lower engagement priority
        break;

      case 'lock_target':
      case 'evaluate_threat':
        // Handled by weapons system
        break;

      case 'track_target':
        // Update missile target to current F-35 position
        if (unit.isSAM && unit.tx !== undefined) {
          // Redirect SAM toward current F-35 position (lead pursuit)
          // This is handled in the main sim loop
        }
        break;

      default:
        break;
    }
  }

  // ============ UTILITY ============
  _getUnitType(unit) {
    if (!unit) return 'unknown';
    if (unit.isSAM !== undefined) return 'missile';
    if (unit.missiles !== undefined && unit.missileIndex === undefined) return 'airDefense';
    if (unit.missileIndex !== undefined) return 'aircraft';
    if (unit.isShip) return 'ship';
    if (unit.isSubmarine) return 'submarine';
    return 'unknown';
  }

  // Evaluate threat level of a target
  evaluateThreat(target, self) {
    if (!target || !target.alive) return 0;
    const dist = Math.hypot(target.x - self.x, target.y - self.y) * 0.8;
    let threat = 0;
    
    // Proximity = higher threat
    threat += Math.max(0, 100 - dist) / 10;
    
    // Missiles incoming = highest threat
    if (target.isSAM) threat += 50;
    
    // If target is tracking us
    if (target.detected) threat += 20;
    
    return threat;
  }
}

// Singleton instance
const BEHAVIOR_ENGINE = new BehaviorEngine();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BehaviorEngine, BEHAVIOR_ENGINE, AI_SETTINGS,
    AIRCRAFT_BEHAVIORS, AIR_DEFENSE_BEHAVIORS, MISSILE_BEHAVIORS,
    SHIP_BEHAVIORS, SUBMARINE_BEHAVIORS, BUILDING_BEHAVIORS };
}