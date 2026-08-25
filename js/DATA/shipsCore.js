// ======================================================
// shipsCore.js — NAVAL CORE SYSTEM v1.0
// Ship classes, weapon layers, sensors, damage, AA
// ======================================================

// ===================== SHIP CLASSES (FINAL CORE) =====================
const NAVAL_SHIPS_CORE = {
  destroyers:["arleigh_burke_f3","type052d","type45","sejong","ddg1000","hobart","ins_kolkata"],
  cruisers:["ticonderoga","type055","slava"],
  frigates:["fremm","type26","meko","gowind","sigma"],
  carriers:["nimitz","ford","queen_elizabeth","cdg","liaoning","kuznetsov"],
  submarines:["virginia","astute","kilo","yasen","scorpene","borei"],
  special:["zumwalt","kirov","lhd_america","lpd_san_antonio","fast_attack","corvette"]
};

// ===================== SHIP WEAPON LAYERS =====================
function getShipWeaponLayers(ship) {
  const w = ship.compatibleWeapons || [];
  return {
    longRangeStrike: w.filter(id => ["tomahawk","kalibr","cj10","storm_shadow","bulava"].includes(id)),
    antiShip: w.filter(id => ["harpoon","exocet","rbs15","yj12","agm158c","p800_oniks","brahmos","yj18","yj21"].includes(id)),
    airDefense: w.filter(id => ["sm2","sm6","essm","aster15","aster30","sea_ceptor","hhq9","barak8","s300f"].includes(id)),
    closeDefense: w.filter(id => ["mk45","oto76","ags_155"].includes(id))
  };
}

// ===================== NAVAL AA SYSTEMS =====================
const NAVAL_AA_SYSTEMS = {
  aegis:["sm2","sm6","sm3","essm"],
  samp_t:["aster15","aster30"],
  chinese_hq9:["hhq9"],
  israeli_barak:["barak8"],
  russian_naval:["s300f","s400naval"]
};

// ===================== SENSOR SYSTEM =====================
function getShipSensor(ship) {
  return {
    radarKM: ship.radarKM || 0,
    sonarKM: ship.role?.includes("sub") ? Math.min(100, (ship.hp||400)/5) : ship.radarKM ? Math.max(5, ship.radarKM/20) : 0,
    antiStealth: ship.stealth ? 0.1 : 0.05,
    ecm: ship.stealth ? 60 : 30,
    trackingCapacity: Math.min((ship.vlsCells||0) + 20, 300),
    simultaneousTargets: Math.max(1, Math.floor((ship.vlsCells||0)/8))
  };
}

// ===================== DAMAGE MODEL =====================
function createDamageModel() {
  return { hull:100, fire:0, flooding:0, radarDamage:0, engineDamage:0 };
}
function applyDamage(dmg, model) {
  model.hull = Math.max(0, model.hull - (dmg * 0.6));
  model.fire = Math.min(100, model.fire + (dmg * 0.1));
  model.flooding = Math.min(100, model.flooding + (dmg * 0.05));
  model.radarDamage = Math.min(100, model.radarDamage + (dmg * 0.05));
  model.engineDamage = Math.min(100, model.engineDamage + (dmg * 0.03));
  // Effects
  const blinded = model.radarDamage >= 100;
  const drifting = model.engineDamage >= 100;
  const sunk = model.hull <= 0 || model.flooding >= 100;
  return { blinded, drifting, sunk, model };
}

// ===================== COMBAT LOGIC =====================
function navalCombatTick(missile, ship) {
  if (!missile.alive || !ship.alive) return { hit:false };
  const sensor = getShipSensor(ship);
  const dist = Math.hypot(missile.x-ship.x, missile.y-ship.y) * 11.16;
  
  // Radar check
  if (sensor.radarDamage >= 50 || dist > sensor.radarKM * 1.2) return { hit:false, reason:"no_radar" };
  
  // ECM reduces hit chance
  const ecmFactor = 1 - (sensor.ecm / 200);
  const baseHit = missile.hitProb || 0.80;
  const hitChance = baseHit * ecmFactor;
  
  // SM-6 long range intercept
  const hasSM6 = ship.compatibleWeapons?.includes("sm6");
  if (hasSM6 && dist < 240 && Math.random() < 0.88) return { hit:false, intercepted:"sm6" };
  
  // ESSM mid range
  const hasESSM = ship.compatibleWeapons?.includes("essm");
  if (hasESSM && dist < 50 && Math.random() < 0.80) return { hit:false, intercepted:"essm" };
  
  // CIWS last line (dist < 5km)
  if (dist < 5 && Math.random() < 0.65) return { hit:false, intercepted:"ciws" };
  
  const hit = Math.random() < hitChance;
  if (hit) {
    const dmgModel = ship.damageModel || createDamageModel();
    const result = applyDamage(missile.damage || 200, dmgModel);
    ship.damageModel = result.model;
    return { hit:true, ...result };
  }
  return { hit:false, reason:"miss" };
}

// ===================== CARRIER STRIKE GROUP =====================
function generateCarrierGroup(carrierId, side, baseX, baseY) {
  const spacing = 8;
  const group = [];
  const carrier = SHIPS_DB?.[carrierId];
  if (!carrier) return group;
  
  group.push({ spec:carrier, side, x:baseX, y:baseY, role:"carrier" });
  group.push({ spec:SHIPS_DB.arleigh_burke_f3, side, x:baseX+spacing, y:baseY+spacing, role:"aa_shield" });
  group.push({ spec:SHIPS_DB.arleigh_burke_f3, side, x:baseX-spacing, y:baseY-spacing, role:"aa_shield" });
  group.push({ spec:SHIPS_DB.ticonderoga, side, x:baseX, y:baseY+spacing*1.5, role:"command_radar" });
  group.push({ spec:SHIPS_DB.fremm, side, x:baseX+spacing*0.7, y:baseY-spacing*0.7, role:"asw" });
  group.push({ spec:SHIPS_DB.fremm, side, x:baseX-spacing*0.7, y:baseY+spacing*0.7, role:"asw" });
  group.push({ spec:SHIPS_DB.virginia, side, x:baseX, y:baseY+spacing*2, role:"stealth_escort" });
  return group;
}