// ============================================================================
// game.js — CMO GAME v6.5 — TERRAIN CHECK FIX (ships must be on water)
// FIXED: removed the dummy isOceanPosition(x,y){return false} override that
// was silently disabling ALL terrain checks in the game (SAM/BM/building
// land-only placement, and ship water-only placement). The real region-based
// isOceanPosition() from worldTerrainRegions.js is now used instead — it's
// pure coordinate math, so it does NOT need an HTTP server / pixel reading.
// Also added an explicit water-only guard to placeShip(), which never had
// one to begin with.
// FUEL FIX, ICON FIX, DETECTION DELAY, MISSION LOCK (carried over from v6.4)
// FIXED: non-combat aircraft no longer auto-armed/able to fire; base/carrier
// launch now spawns the type you actually added; game-over check scoped to
// BLUFOR only (and accounts for landed/parked aircraft); SAM detection map
// now gets periodically cleaned of dead-aircraft entries.
// ============================================================================
const _ = id => document.getElementById(id);
const W = CMO.WORLD;
let S = {
  ac:[], sam:[], bm:[], mis:[], exp:[], bases:[], ships:[],
  tick:0, pause:false, spd:1, gameover:false,
  camX:0, camY:0, zoom:0.5, camLock:true,
  pan:false, panX:0, panY:0,
  sel:null, sels:[], addMode:null, selBox:null,
  bmPendingTarget:null, bmLaunchMode:false,
  gameStarted:false, missionName:null
};
const sides = [
  {id:'blue', name:'BLUFOR', color:'#2b6fdb', posture:'Friendly'},
  {id:'red', name:'OPFOR', color:'#db2b2b', posture:'Hostile'},
  {id:'neutral', name:'NEUTRAL', color:'#8ab4e8', posture:'Neutral'}
];

const NON_COMBAT_ROLES = ['tanker','awacs','bomber','stealth_bomber','utility_helicopter','maritime_patrol'];

// Detection delay system: each SAM can have a detection delay counter
let detectionDelays = {};

const cv = document.createElement('canvas');
const cx = cv.getContext('2d');
document.body.prepend(cv);
    let cw, ch, dpr;
function resize() {
  dpr = window.devicePixelRatio || 1;
  const r = cv.getBoundingClientRect();
  cw = r.width || innerWidth;
  ch = r.height || innerHeight;
  cv.width  = cw * dpr;
  cv.height = ch * dpr;
  cv.style.width  = cw + 'px';
  cv.style.height = ch + 'px';
}
setTimeout(resize, 50);
addEventListener('resize', resize);

const A = {};
let ld = 0, total = 2;
function lg(m) { const el = _('logMsg'); if(el) el.textContent = m; }

// NOTE: isOceanPosition() is intentionally NOT redefined here anymore.
// The real implementation lives in worldTerrainRegions.js and is a plain
// region/coordinate lookup against WORLD_TERRAIN_REGIONS — it does not
// require an HTTP server or pixel reading, so there is no reason to stub
// it out. Previously this file had:
//   function isOceanPosition(x, y) { return false; }
// which silently disabled EVERY terrain check in the game (SAM/BM/building
// land-only placement, and ship water-only placement all did nothing).

function la(k, s) {
  const I = new Image();
  I.onload = () => { A[k]=I; ld++; if(ld>=total) _('logMsg')&&(_('logMsg').textContent='ALL ASSETS LOADED'); };
  I.onerror = () => { ld++; }; I.src = s;
}
la('map','assets/world_small.jpg');
la('mapHigh','assets/world_shaded_43k.jpg');

// MEDIUM-RES fallback cache (2×) for while the 53MB high-res map loads.
(function(){
  const I = new Image();
  I.onload = function() {
    const oc = document.createElement('canvas');
    oc.width  = W.mapW * 2;
    oc.height = W.mapH * 2;
    const octx = oc.getContext('2d');
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(I, 0, 0, oc.width, oc.height);
    A.mapMedium = oc;
    console.log('[map] medium-res cache ready', oc.width + '×' + oc.height);
  };
  I.src = 'assets/world_small.jpg';
})();

function ll(lat,lng){return{x:(lng+180)/360*W.mapW,y:(90-lat)/180*W.mapH};}

function safeRef(name, fallback) {
  try { return eval(name) || fallback; } catch(e) { return fallback; }
}

const AIRCRAFT_LOOKUP = {};
function initAircraftLookup() {
  const defs = [
    ['f35a','F35A_DATA'],['f22','F22_DATA'],['f16','F16_DATA'],['f15e','F15E_DATA'],
    ['fa18e','FA18E_DATA'],['eurofighter','EUROFIGHTER_DATA'],['rafale','RAFALE_DATA'],
    ['gripen','GRIPEN_DATA'],['su35','SU35_DATA'],['su30sm','SU30SM_DATA'],
    ['su27','SU27_DATA'],['su25','SU25_DATA'],['su57','SU57_DATA'],['mig29','MIG29_DATA'],['mig31','MIG31_DATA'],['j20','J20_DATA'],
    ['j10c','J10C_DATA'],['j16','J16_DATA'],['a10','A10_DATA'],['av8b','AV8B_DATA'],
    ['f14','F14_DATA'],['f4','F4_DATA'],
    ['rafale_c','RAFALE_C_DATA'],['rafale_m','RAFALE_M_DATA'],
    ['mirage2000_5','MIRAGE2000_5_DATA'],['mirage2000d','MIRAGE2000D_DATA'],
    ['e2c','E2C_DATA'],['a330mrtt','A330MRTT_DATA'],
    ['atl2','ATLANTIQUE2_DATA'],['alphajet','ALPHAJET_DATA'],
    ['tiger_had','TIGER_HAD_DATA'],['nh90','NH90_DATA'],
    ['b52','B52_DATA'],['b1b','B1B_DATA'],['b2','B2_DATA'],
    ['tu95','TU95_DATA'],['tu160','TU160_DATA'],['h6k','H6K_DATA'],
    ['e3','E3_DATA'],['e7','E7_DATA'],['kc135','KC135_DATA'],['kc46','KC46_DATA'],['p8','P8_DATA'],
    ['j20_mighty','J20_MIGHTY'],['j35','J35_FC31'],['j11b','J11B'],['j15','J15'],
    ['f16v','F16V'],['idf','IDF'],['e2k','E2K'],
    ['f15k','F15K'],['fa50','FA50'],
    ['f15j','F15J'],['f2a','F2A'],['p1','P1'],
    ['f35i','F35I'],['f15i','F15I'],['f16i','F16I'],['g550','G550'],['herontp','HERON_TP'],
    ['f14_iran','F14_IRAN'],['f4_iran','F4_IRAN'],['su24_iran','SU24_IRAN'],
    ['tfx','TFX'],['hurjet','HURJET'],['tb2','TB2'],['akinci','AKINCI'],
    ['mig23ml','MIG23ML'],['mig21bis','MIG21BIS'],['su25','SU25'],
    ['fa50ph','FA50PH'],['p3','P3'],
    ['f15ex','F15EX_DATA'],['rafale_f4','RAFALE_F4_DATA'],['kf21','KF21_DATA'],
    ['b21','B21_DATA'],['ac130j','AC130J_DATA'],['mq28','MQ28_DATA'],
    ['e8c','E8C_DATA'],['mc130j','MC130J_DATA'],['c17','C17_DATA'],
    ['e2d','E2D_DATA'],['v22','V22_DATA'],
    ['shahed149','SHAHED149_DATA'],['mohajer6','MOHAJER6_DATA'],
    ['ababil3','ABABIL3_DATA'],['samad3','SAMAD3_DATA'],
    ['wing_loong_ii','WINGLOONG2_DATA'],
    ['su57e','SU57E_DATA'],['tejas_mk2','TEJAS_MK2_DATA'],
    ['mig35','MIG35_DATA'],['su34','SU34_DATA'],
    ['l15','L15_DATA'],['j35b','J35B_DATA'],
    ['f15e_2026','F15E_2026_DATA'],['griffin','GRIFFIN_DATA'],
    ['mq20_avenger','MQ20_AVENGER_DATA'],['jas39e','JAS39E_DATA'],
    ['kf21n','KF21N_DATA'],['f16v_mlu','TAIWAN_F16V_DATA'],
    ['rafale_f3r','RAFALE_F3R_DATA'],['eurofighter_t3','EUROFIGHTER_T3_DATA'],
    ['jh7a','JH7A_DATA'],['q5','Q5_DATA'],
    ['mirage2000_9','M2000_9_DATA'],['su22','SU22_DATA'],
    ['b1b_lam','B1B_LAM_DATA'],['mirage4000','MIRAGE4000_DATA'],
    ['f14d','F14D_DATA'],['av8b_plus','AV8B_PLUS_DATA'],
    ['h160m','H160M_DATA']
  ];
  defs.forEach(([id,varName])=>AIRCRAFT_LOOKUP[id]=safeRef(varName));
}
initAircraftLookup();

function createAircraftFromId(aircraftId, side, x, y) {
  const spec = AIRCRAFT_LOOKUP[aircraftId] || F35A_DATA;
  const a = CMO.createAircraft(spec, side, x, y);
  a.tx=x;a.ty=y;
  a.role = spec.role || 'fighter';
  // Build loadout: start with default, normalize count -> cnt
  a.wp = (spec.defaultLoadout || []).map(w=>({id:w.id, cnt:(w.cnt || w.count || 0)}));
  a.compatibleWeapons = (spec.compatibleWeapons || []).slice();
  // Find compatible A2A and A2G weapons — but ONLY auto-arm actual combat
  // roles. Tankers/AWACS/bombers/etc. must not get a free AMRAAM+JASSM
  // stapled on, since that also makes them able to fire (see A2G tick loop).
  const compat = a.compatibleWeapons;
  const isNonCombat = NON_COMBAT_ROLES.includes(a.role);
  if (!isNonCombat) {
    const hasA2A = a.wp.some(w => { const d = WEAPONS_DB[w.id]||MISSILE_DB[w.id]; return d && (d.type==='air_to_air'||d.type==='a2a'); });
    const hasA2G = a.wp.some(w => { const d = WEAPONS_DB[w.id]||MISSILE_DB[w.id]; return d && (d.type==='air_to_ground'||d.type==='a2g'||d.type==='anti_ship'||d.type==='cruise'); });
    if (!hasA2A) {
      const a2aPick = compat.find(id => { const d = WEAPONS_DB[id]||MISSILE_DB[id]; return d && (d.type==='air_to_air'||d.type==='a2a'); }) || 'aim120c';
      a.wp.push({id:a2aPick, cnt:2});
      // Keep compatibleWeapons in sync so this fallback weapon can actually
      // be fired (the A2A tick loop requires compatibleWeapons.includes(w.id))
      if (!compat.includes(a2aPick)) compat.push(a2aPick);
    }
    if (!hasA2G) {
      const a2gPick = compat.find(id => { const d = WEAPONS_DB[id]||MISSILE_DB[id]; return d && (d.type==='air_to_ground'||d.type==='a2g'||d.type==='anti_ship'||d.type==='cruise'); }) || 'agm158';
      a.wp.push({id:a2gPick, cnt:2});
      if (!compat.includes(a2gPick)) compat.push(a2gPick);
    }
    if (a.wp.length === 0) { a.wp = [{id:'aim120c',cnt:4},{id:'agm158',cnt:2}]; if(!compat.includes('aim120c'))compat.push('aim120c'); if(!compat.includes('agm158'))compat.push('agm158'); }
  }
  a.alt = 12000;
  a.thr=100; a.rt=null; a.rtTarget=null; a.landingAt=null; a.refuelingAt=null; a.isTanker=false; a.isAwacs=false;
  a.radarKM = spec.radarKM || 200;
  a.stealth = spec.stealth || false;
  a.rcs = spec.rcs || 5;
  a.ecm = spec.ecm || 50;
  if(spec.role === 'tanker'){ a.isTanker=true; a.fuelTransferKG = spec.fuelTransferKG||90000; }
  if(spec.role === 'awacs'){ a.isAwacs=true; }
  a.spawnDelay = 0;
  a.a2aCooldown = 0;
  a.a2gCooldown = 0;
  a.missionLock = false;
  return a;
}
window.showMissionBrief = function(scenario) {
  var d = document.createElement('div');
  d.id = 'briefOverlay';
  d.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(6,10,16,0.95);z-index:9999;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px';
  var missions = {
    middle_east: { title:'MIDDLE EAST · Iran Strike', color:'#ffaa40', bg:'rgba(50,30,10,0.6)',
      brief:'Massive coalition strike to neutralize Iranian air defenses. F-35A stealth fighters, Rafales, and B-2 bombers penetrate deep into Iran to destroy S-400 batteries, ballistic missile launchers, and command infrastructure.',
      objectives:['Destroy all S-400 SAM sites','Eliminate ballistic missile launchers','Neutralize enemy airbases','Return to base — mission complete!'] },
    north_africa: { title:'NORTH AFRICA · Desert Storm', color:'#60d080', bg:'rgba(20,50,20,0.6)',
      brief:'Desert Storm-style campaign against Libyan coastal defenses. F-16s, A-10 Warthogs, and F-15E Strike Eagles assault heavily defended SAM sites along the Mediterranean.',
      objectives:['Destroy Libyan S-300/S-400 SAMs','Eliminate coastal defense systems','Take out enemy supply bases','Clear the skies — air supremacy!'] },
    ukraine_russia: { title:'UKRAINE · Eastern Front', color:'#6699ff', bg:'rgba(20,30,60,0.6)',
      brief:'Ukrainian Air Force offensive against Russian occupiers in Kherson and Zaporizhzhia. Su-27s, MiG-29s, Su-25s, and Bayraktar TB2s strike S-400s, Iskander missiles, and forward bases.',
      objectives:['Destroy Russian S-400 and Buk SAMs','Eliminate Iskander & Kinzhal BMs','Destroy Kherson, Melitopol & Nova Kakhovka','All OPFOR eliminated — Ukraine prevails!'] }
  };
  var m = missions[scenario] || { title:'BLANK SCENARIO', color:'#8ab4e8', bg:'rgba(20,30,50,0.6)',
    brief:'Sandbox mode — place units and build your own battle.',
    objectives:['Place your units on the map','Press PLAY to start','Destroy all enemy forces!'] };
  d.innerHTML = '<div style="max-width:520px;width:100%;text-align:center;animation:fadeIn 0.3s"><style>@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}</style><h2 style="color:'+m.color+';font-size:22px;font-weight:700;margin-bottom:4px">\uD83C\uDF0D '+m.title+'</h2><div style="height:2px;width:70px;background:'+m.color+';margin:12px auto;opacity:0.4"></div><div style="font-size:12px;color:#c8ddf0;line-height:1.7;margin-bottom:16px;padding:0 8px">'+m.brief+'</div><div style="background:'+m.bg+';border:1px solid '+m.color+'44;border-radius:8px;padding:12px 18px;text-align:left;margin-bottom:20px"><div style="color:'+m.color+';font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px">\uD83C\uDFAF OBJECTIVES</div>'+m.objectives.map(function(o,i){return '<div style="color:#e0e8f0;font-size:12px;padding:3px 0;display:flex;align-items:center;gap:8px"><span style="display:inline-flex;width:20px;height:20px;border-radius:50%;background:'+m.color+'33;color:'+m.color+';font-size:10px;font-weight:700;align-items:center;justify-content:center;flex-shrink:0">'+(i+1)+'</span> '+o+'</div>'}).join('')+'</div><div style="display:flex;gap:10px;justify-content:center"><button onclick="document.getElementById(\'briefOverlay\').remove();S.pause=false;_(\'btnPause\').textContent=\'\u23F8 PAUSE\';lg(\'\uD83D\uDE80 MISSION STARTED!\')" style="padding:12px 40px;background:linear-gradient(180deg,'+m.color+','+m.color+'88);border:none;color:#fff;font-size:14px;font-weight:700;cursor:pointer;border-radius:6px;letter-spacing:1px">\u25B6 START MISSION</button><button onclick="document.location.reload()" style="padding:12px 24px;background:rgba(40,60,80,0.4);border:1px solid rgba(255,255,255,0.08);color:#8ab4e8;font-size:13px;cursor:pointer;border-radius:6px;letter-spacing:0.5px">\u2B05 BACK</button></div></div>';
  document.body.appendChild(d);
};

function createShip(spec, side, x, y) {
  if (!spec) return null;
  const spd = CMO.pxPerTick(spec.speedKMH || 55);
  const isCarrier = spec.role === 'supercarrier' || spec.role === 'carrier' || spec.role === 'light_carrier' || spec.role === 'medium_carrier' || spec.role === 'next_gen_supercarrier' || spec.role === 'heavy_carrier_cruiser';
  return {
    id: 'shp' + Date.now() + '_' + (Math.random() * 99999 | 0),
    t: 'ship', side,
    name: spec.name || 'Unknown Ship',
    x, y, tx: x, ty: y, h: 0,
    spd: spd,
    hp: spec.hp || 300, maxHP: spec.hp || 300,
    radarKM: spec.radarKM || 300,
    stealth: spec.stealth || false,
    vls: spec.vlsCells || 0,
    alive: true, dt:false,
    spec: spec, role: spec.role || 'destroyer',
    wp: spec.defaultLoadout ? spec.defaultLoadout.map(w=>({...w})) : [],
    compatibleWeapons: spec.compatibleWeapons || [],
    isCarrier: isCarrier,
    acCap: spec.airWingCapacity || 0,
    ac: spec.defaultLoadout ? spec.defaultLoadout.reduce((sum,w)=>sum+(w.count||0),0) : 0,
    runways: spec.runwayCount || 0,
    compatibleAircraft: spec.compatibleAircraft || [],
    maxAC: spec.airWingCapacity || 0
  };
}

window.startScenario = function(scenario) {
  try { hideModal(); } catch(e) {}
  // Hide login gate if visible — entering game area
  const g = document.getElementById('loginGate');
  if (g) g.style.display = 'none';
  window._cmoAuthed = true;
  console.log('CMO: Starting scenario:', scenario);
  _('mainMenu').style.display = 'none';
  _('topbar').style.display='flex';
  _('sidebar').style.display='block';
  _('logbar').style.display='flex';
  detectionDelays = {};
  
  S = {
    ac:[], sam:[], bm:[], mis:[], exp:[], bases:[], ships:[],
    tick:0, pause:true, spd:1, gameover:false,
    camX:W.mapW/2, camY:W.mapH/2, zoom:1.5, camLock:true,
    pan:false, panX:0, panY:0,
    sel:null, sels:[], addMode:null, selBox:null,
    bmPendingTarget:null, bmLaunchMode:false,
    gameStarted:true, missionName:scenario
  };

  if(scenario === 'f35a_vs_s400') {
    const st=ll(34.5,44.0), tg=ll(35.7,51.4);
    const f=createAircraftFromId('f35a','blue',st.x,st.y);
    f.tx=tg.x;f.ty=tg.y;
    f.wp=[{id:'agm158',cnt:4},{id:'aim120c',cnt:4}];
    S.ac.push(f);
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.s400,'red',tg.x,tg.y));
    S.bases.push({id:'ab_blu1',x:st.x-20,y:st.y-10,name:'Ali AB',side:'blue',runways:4,maxAC:100,ac:0,t:'base',hp:350,maxHP:350,alive:true});
    S.bases.push({id:'ab_red1',x:tg.x+15,y:tg.y+10,name:'Tehran AB',side:'red',runways:4,maxAC:100,ac:0,t:'base',hp:350,maxHP:350,alive:true});
    const tk=createAircraftFromId('kc135','blue',st.x+40,st.y-20);
    tk.tx=st.x+40; tk.ty=st.y-20; S.ac.push(tk);
    for(let i=0;i<2;i++){
      const m=createAircraftFromId('mig29','red',tg.x+15-(i*10),tg.y-5);
      m.tx=tg.x+15-(i*10); m.ty=tg.y-5;
      m.role='multirole';
      m.wp=[{id:'kh29',cnt:4},{id:'r73',cnt:2},{id:'r77',cnt:2}];
      m.compatibleWeapons=['kh29','r77','r73'];
      S.ac.push(m);
    }
    lg('MiG-29 loaded with KH-29 A2G missiles');
    const pg = ll(27.0, 51.5);
    const carrier_spec = SHIPS_DB.cvn78;
    if(carrier_spec) { const carrier = createShip(carrier_spec, 'blue', pg.x+5, pg.y-4); if(carrier) S.ships.push(carrier); }
    const ddg_spec = SHIPS_DB.arleigh_burke_f3;
    if(ddg_spec) { const ddg = createShip(ddg_spec, 'blue', pg.x+8, pg.y); if(ddg) S.ships.push(ddg); }
    const hormuz = ll(26.2, 56.0);
    const red1 = createShip(SHIPS_DB.kilo || SHIPS_DB.type052d, 'red', hormuz.x-3, hormuz.y-2);
    if(red1) S.ships.push(red1);
    const red2 = createShip(SHIPS_DB.slava || SHIPS_DB.kilo, 'red', hormuz.x+2, hormuz.y+2);
    if(red2) S.ships.push(red2);
    S.camX=st.x;S.camY=st.y;S.zoom=1.0;
    lg('F-35A INSERTION · Naval forces in Persian Gulf');
  } else if(scenario === 'middle_east') {
    // MIDDLE EAST: Iran Strike — mission only (not blank scenario)
    const b1=ll(28.0,46.5), b2=ll(27.5,47.0), b3=ll(27.0,46.0);
    const t1=ll(34.5,51.0), t2=ll(34.0,50.5), t3=ll(35.0,51.5);
    // BLUFOR: All planes get LONG-RANGE A2G + A2A
    for(let i=0;i<8;i++){
      const f=createAircraftFromId('f35a','blue',b1.x+(i*3),b1.y+(i*1.5));
      f.tx=t1.x+(Math.random()-0.5)*10; f.ty=t1.y+(Math.random()-0.5)*10;
      f.wp=[{id:'agm158',cnt:8},{id:'aim120c',cnt:4}];
      f.compatibleWeapons=['agm158','aim120c','agm158c','gbu31']; f.hp=200; S.ac.push(f);
    }
    for(let i=0;i<4;i++){
      const r=createAircraftFromId('rafale','blue',b2.x+(i*3),b2.y+(i*1.5));
      r.wp=[{id:'storm_shadow',cnt:6},{id:'meteor',cnt:4}];
      r.tx=t2.x+(Math.random()-0.5)*8; r.ty=t2.y+(Math.random()-0.5)*8;
      r.compatibleWeapons=['storm_shadow','meteor','agm158']; r.hp=200; S.ac.push(r);
    }
    // 12 F-15Es with JASSM (370km range) NOT JDAM (28km range!)
    for(let i=0;i<12;i++){
      const e=createAircraftFromId('f15e','blue',b3.x+(i*3),b3.y+5+(i*1.5));
      e.wp=[{id:'aim120d',cnt:8},{id:'agm158',cnt:8},{id:'gbu31',cnt:4}];
      e.tx=t1.x+((i%6)*3); e.ty=t1.y+5+((i/6|0)*3);
      e.compatibleWeapons=['aim120d','agm158','gbu31','aim120c','agm158c']; e.hp=250; S.ac.push(e);
    }
    // B-2s with JASSM
    for(let i=0;i<2;i++){
      const b=createAircraftFromId('b2','blue',b1.x-25+(i*5),b1.y-12);
      b.wp=[{id:'agm158',cnt:12},{id:'gbu31',cnt:8}];
      b.tx=t3.x; b.ty=t3.y; b.compatibleWeapons=['agm158','gbu31']; b.hp=300; S.ac.push(b);
    }
    const tk1=createAircraftFromId('kc135','blue',b1.x-10,b1.y-8); tk1.tx=b1.x-10; tk1.ty=b1.y-8; S.ac.push(tk1);
    const tk2=createAircraftFromId('kc46','blue',b2.x-12,b2.y-6); tk2.tx=b2.x-12; tk2.ty=b2.y-6; S.ac.push(tk2);
    const aw=createAircraftFromId('e3','blue',b1.x-15,b1.y-12); aw.tx=b1.x-15; aw.ty=b1.y-12; S.ac.push(aw);
    // OPFOR Iran: 3s delay, WIDELY spread across central/southern Iran (large gaps)
    const samPositions = [
      {x:t1.x-35,y:t1.y+5,id:'bavar373'},{x:t1.x+35,y:t1.y+2,id:'bavar373'},
      {x:t1.x-15,y:t1.y+22,id:'bavar373'},{x:t2.x-30,y:t2.y+6,id:'khordad15'},
      {x:t2.x+30,y:t2.y+3,id:'khordad15'},{x:t1.x+15,y:t1.y+30,id:'khordad3'},
      {x:t1.x-40,y:t1.y+25,id:'pantsir_iran'},{x:t1.x+40,y:t1.y+24,id:'pantsir_iran'},
      {x:t2.x-25,y:t2.y+28,id:'raad'},{x:t3.x+15,y:t3.y+14,id:'khordad15'},
      {x:t1.x-20,y:t1.y+38,id:'tabas'},{x:t2.x+20,y:t2.y+35,id:'mersad'}
    ];
    samPositions.forEach((sp,i)=>{
      const sam = CMO.createSAMSite(AIR_DEFENSE_DB[sp.id],'red',sp.x,sp.y);
      sam.detectionDelay = 3 * 60;
      sam.maxM = Math.floor(sam.maxM / 2);
      sam.hp = Math.floor(sam.hp / 2);
      S.sam.push(sam);
    });
    // Ballistics spread across 6 wider positions
    const bmPos = [
      {x:t1.x+12,y:t1.y+35},{x:t1.x-14,y:t1.y+38},{x:t2.x+10,y:t2.y+32},
      {x:t2.x-12,y:t2.y+36},{x:t1.x+5,y:t1.y+40},{x:t1.x-8,y:t1.y+42}
    ];
    S.bm.push(createBMFromId('shahab3','red',bmPos[0].x,bmPos[0].y));
    S.bm.push(createBMFromId('emad','red',bmPos[1].x,bmPos[1].y));
    S.bm.push(createBMFromId('kheibar_shekan','red',bmPos[2].x,bmPos[2].y));
    S.bm.push(createBMFromId('fattah1','red',bmPos[3].x,bmPos[3].y));
    S.bm.push(createBMFromId('haj_qasem','red',bmPos[4].x,bmPos[4].y));
    S.bm.push(createBMFromId('dezful','red',bmPos[5].x,bmPos[5].y));
    S.camX=b1.x;S.camY=b1.y;S.zoom=1.2;
    lg('🌍 MIDDLE EAST STRIKE · 12x F-15E + 8x F-35A overwhelming assault');
  } else if(scenario === 'north_africa') {
    // NORTH AFRICA: Desert Storm — BLUFOR vs Libyan coastal defenses
    // BLUFOR from Tunisia/Sicily area, Libya targets on coastline
    const b1=ll(37.0,10.0), b2=ll(36.5,10.5), b3=ll(36.8,9.5);
    // Libya targets along coast (Tripoli → Misrata → Sirte)
    const t1=ll(32.9,13.2), t2=ll(32.4,15.1), t3=ll(31.2,16.6);
    // BLUFOR: heavy strike package
    for(let i=0;i<8;i++){ // 8 F-16s
      const f=createAircraftFromId('f16','blue',b1.x+(i*3),b1.y+(i*2));
      f.wp=[{id:'aim120c',cnt:6},{id:'gbu31',cnt:6}]; f.tx=t1.x; f.ty=t1.y; S.ac.push(f);
    }
    for(let i=0;i<6;i++){ // 6 A-10s
      const a=createAircraftFromId('a10','blue',b2.x+(i*4),b2.y+2);
      a.wp=[{id:'agm65',cnt:8},{id:'gbu31',cnt:8},{id:'aim9x',cnt:4}]; a.tx=t2.x; a.ty=t2.y; S.ac.push(a);
    }
    for(let i=0;i<10;i++){ // 10 F-15Es
      const e=createAircraftFromId('f15e','blue',b3.x+(i*3),b3.y+5+(i*2));
      e.wp=[{id:'aim120d',cnt:8},{id:'agm158',cnt:8},{id:'gbu31',cnt:6}];
      e.compatibleWeapons=['aim120d','agm158','gbu31','aim120c']; e.tx=t3.x; e.ty=t3.y; S.ac.push(e);
    }
    const tk=createAircraftFromId('kc135','blue',b1.x-10,b1.y-6); tk.tx=b1.x-10; tk.ty=b1.y-6; S.ac.push(tk);
    const tk2=createAircraftFromId('kc46','blue',b2.x-12,b2.y-8); tk2.tx=b2.x-12; tk2.ty=b2.y-8; S.ac.push(tk2);
    const aw=createAircraftFromId('e3','blue',b1.x-15,b1.y-10); aw.tx=b1.x-15; aw.ty=b1.y-10; S.ac.push(aw);
    // OPFOR Libya: WEAK SAMs — all pushed DEEP inland (y+20 to y+35) to avoid water near coast
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.pantsir,'red',t1.x-12,t1.y+22));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.pantsir,'red',t1.x+12,t1.y+20));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.buk,'red',t2.x-10,t2.y+22));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.buk,'red',t2.x+10,t2.y+20));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.tor,'red',t1.x-16,t1.y+26));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.tor,'red',t2.x+16,t2.y+24));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.hawk_ph3,'red',t1.x-20,t1.y+28));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.hawk_ph3,'red',t2.x+20,t2.y+26));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.s125_neva,'red',t3.x-8,t3.y+24));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.s125_neva,'red',t3.x+8,t3.y+22));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.rapier_fsc,'red',t1.x+24,t1.y+30));
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.crotale_ng,'red',t2.x-22,t2.y+28));
    // 2 OPFOR bases deep inland
    S.bases.push({id:'ab_tripoli',x:t1.x-4,y:t1.y+32,name:'Gharyan Base',side:'red',runways:2,maxAC:30,ac:0,t:'base',hp:250,maxHP:250,alive:true});
    S.bases.push({id:'ab_misrata',x:t2.x+4,y:t2.y+30,name:'Bani Walid Base',side:'red',runways:2,maxAC:25,ac:0,t:'base',hp:250,maxHP:250,alive:true});
    S.camX=b1.x;S.camY=b1.y;S.zoom=1.4;
    lg('🌍 DESERT STORM · 10x F-15E + 8x F-16 + 6x A-10 vs Libyan coast');
  } else if(scenario === 'ukraine_russia') {
    // UKRAINE: BLUFOR vs Russian SAMs/ballistics north of Crimea (mainland)
    const b1=ll(49.5,27.0), b2=ll(49.0,27.5), b3=ll(49.2,26.5);
    // Russian targets SPREAD WIDE across Kherson/Zaporizhzhia
    const t1=ll(47.0,33.2), t2=ll(46.8,34.8), t3=ll(47.2,34.0);
    
    // ========== SPREAD OUT OPFOR (widely separated) ==========
    const rusSams = [
      CMO.createSAMSite(AIR_DEFENSE_DB.s400,'red',t1.x-6,t1.y-4),
      CMO.createSAMSite(AIR_DEFENSE_DB.s400,'red',t2.x+6,t2.y-3),
      CMO.createSAMSite(AIR_DEFENSE_DB.s350_vityaz,'red',t1.x+8,t1.y+2),
      CMO.createSAMSite(AIR_DEFENSE_DB.pantsir,'red',t2.x-7,t2.y+4),
      CMO.createSAMSite(AIR_DEFENSE_DB.tor,'red',t1.x-9,t1.y+5),
      CMO.createSAMSite(AIR_DEFENSE_DB.buk,'red',t2.x+9,t2.y+1),
      CMO.createSAMSite(AIR_DEFENSE_DB.buk,'red',t3.x-5,t3.y+3)
    ];
    rusSams.forEach(s=>{s.detectionDelay=3*60;S.sam.push(s);});
    
    // Russian BMs spread out
    const rusBms = [
      createBMFromId('iskander','red',t1.x-8,t1.y+8),
      createBMFromId('kinzhal','red',t2.x+7,t2.y+7),
      createBMFromId('atacms','red',t3.x-3,t3.y+6)
    ];
    rusBms.forEach(b=>{if(b){b.missionLock=true;S.bm.push(b);}});
    
    // Russian bases spread out
    S.bases.push({id:'ab_kherson',x:t1.x-12,y:t1.y+10,name:'Kherson Base',side:'red',runways:2,maxAC:30,ac:0,t:'base',hp:300,maxHP:300,alive:true});
    S.bases.push({id:'ab_melitopol',x:t2.x+10,y:t2.y+9,name:'Melitopol Base',side:'red',runways:2,maxAC:30,ac:0,t:'base',hp:300,maxHP:300,alive:true});
    S.bases.push({id:'ab_novak',x:t3.x+3,y:t3.y-8,name:'Nova Kakhovka Base',side:'red',runways:2,maxAC:25,ac:0,t:'base',hp:250,maxHP:250,alive:true});
    
    // Ukrainian bases
    S.bases.push({id:'ab_ukr1',x:b1.x-4,y:b1.y-5,name:'Zhytomyr AB',side:'blue',runways:3,maxAC:60,ac:0,t:'base',hp:350,maxHP:350,alive:true});
    S.bases.push({id:'ab_ukr2',x:b2.x-5,y:b2.y-4,name:'Khmelnytskyi AB',side:'blue',runways:2,maxAC:40,ac:0,t:'base',hp:350,maxHP:350,alive:true});
    
    // ========== COLLECT ALL TARGET POSITIONS for waypoints ==========
    const allTargets = [];
    rusSams.forEach(s=>allTargets.push({x:s.x,y:s.y}));
    rusBms.forEach(b=>{if(b)allTargets.push({x:b.x,y:b.y});});
    allTargets.push({x:t1.x-12,y:t1.y+10},{x:t2.x+10,y:t2.y+9},{x:t3.x+3,y:t3.y-8});
    
    // ========== BLUFOR AIR FORCE ==========
    // 8 Su-27 — each targets a different enemy position
    for(let i=0;i<8;i++){
      const s=createAircraftFromId('su27','blue',b1.x+(i*3),b1.y+(i*2));
      s.wp=[{id:'r77',cnt:8},{id:'r73',cnt:4},{id:'kh29',cnt:8}];
      s.compatibleWeapons=['r77','r73','kh29','kh31']; ;
      s.tx=allTargets[i%allTargets.length].x; s.ty=allTargets[i%allTargets.length].y;
      S.ac.push(s);
    }
    // 8 MiG-29 — each targets a different enemy position
    for(let i=0;i<8;i++){
      const m=createAircraftFromId('mig29','blue',b2.x+(i*3),b2.y+3);
      m.wp=[{id:'r77',cnt:6},{id:'kh29',cnt:8},{id:'kh31',cnt:4}];
      m.compatibleWeapons=['r77','kh29','kh31','r73']; ;
      m.tx=allTargets[(i+3)%allTargets.length].x; m.ty=allTargets[(i+3)%allTargets.length].y;
      S.ac.push(m);
    }
    // 12 Su-25 — hit the bases hard
    const baseTargets = [{x:t1.x-12,y:t1.y+10},{x:t2.x+10,y:t2.y+9},{x:t3.x+3,y:t3.y-8}];
    for(let i=0;i<12;i++){
      const s=createAircraftFromId('su25','blue',b1.x+10+(i*3),b1.y+8+(i*2));
      s.wp=[{id:'kh29',cnt:10},{id:'r73',cnt:4}]; ;
      s.tx=baseTargets[i%3].x; s.ty=baseTargets[i%3].y; S.ac.push(s);
    }
    // 8 more Su-27 — additional strike power
    for(let i=0;i<8;i++){
      const s=createAircraftFromId('su27','blue',b1.x+20+(i*3),b1.y+15);
      s.wp=[{id:'r77',cnt:8},{id:'kh29',cnt:10},{id:'kh31',cnt:4}];
      s.compatibleWeapons=['r77','r73','kh29','kh31']; ;
      s.tx=allTargets[(i+5)%allTargets.length].x; s.ty=allTargets[(i+5)%allTargets.length].y;
      S.ac.push(s);
    }
    
    S.camX=b1.x;S.camY=b1.y;S.zoom=0.8;
    lg('🌍 UKRAINE FRONT · 16x Su-27 + 8x MiG-29 + 12x Su-25 strike Russian positions');
  } else {
    lg('BLANK SCENARIO — place units (land units on land, ships on water)');
  }
  
  updateUnitList(); updateSideList();
  _('btnPause').textContent = '▶ PLAY';
  if(scenario !== 'blank') showMissionBrief(scenario);
};

_('btnPause').onclick=()=>{
  if(!S.gameStarted)return;
  // Check for unassigned units before starting
  if(!S.pause){
    const unassigned = [
      ...S.ac.filter(u=>u.alive&&u.side==='neutral'),
      ...S.ships.filter(u=>u.alive&&u.side==='neutral'),
      ...S.sam.filter(u=>u.alive&&u.side==='neutral'),
      ...S.bm.filter(u=>u.alive&&u.side==='neutral'),
      ...S.bases.filter(u=>u.alive&&u.side==='neutral')
    ];
    if(unassigned.length>0){
      lg('⚠️ '+unassigned.length+' unit(s) need side assignment! Use SIDE ASSIGNMENT panel');
      return;
    }
  }
  S.pause=!S.pause;_('btnPause').textContent=S.pause?'▶ PLAY':'⏸ PAUSE';
};
_('btn05x').onclick=()=>{S.spd=0.5;hl('btn05x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btn1x').onclick=()=>{S.spd=1;hl('btn1x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btn5x').onclick=()=>{S.spd=5;hl('btn5x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btn10x').onclick=()=>{S.spd=10;hl('btn10x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};

_('btnSave').onclick=()=>{
  if(!S){lg('No game to save');return;}
  showSaveSlotModal('save');
};
_('btnLoad').onclick=()=>{
  showSaveSlotModal('load');
};
_('btnMenu').onclick=()=>{document.location.reload();};
function hl(id){['btn05x','btn1x','btn5x','btn10x'].forEach(i=>_(i).classList.remove('active'));_(id).classList.add('active');}

// ---- SAVE SLOT SYSTEM (5 slots, named, cloud-synced via email) ----
function getSaveData() {
  return {
    tick:S.tick, pause:S.pause, spd:S.spd, camX:S.camX, camY:S.camY, zoom:S.zoom,
    ac:S.ac.map(a=>({id:a.id,side:a.side,name:a.name,x:a.x,y:a.y,tx:a.tx,ty:a.ty,h:a.h,fu:a.fu,hp:a.hp,alive:a.alive,role:a.role,wp:a.wp,spd:a.spd,isTanker:a.isTanker,isAwacs:a.isAwacs,landingAt:a.landingAt,spawnDelay:a.spawnDelay,evadeT:a.evadeT||0,flareT:a.flareT||0,cm:a.cm||0})),
    sam:S.sam.map(s=>({id:s.id,side:s.side,name:s.name,x:s.x,y:s.y,hp:s.hp,maxM:s.maxM,reload:s.reload,alive:s.alive})),
    bases:S.bases.map(b=>({id:b.id,name:b.name,side:b.side,x:b.x,y:b.y,ac:b.ac,maxAC:b.maxAC,runways:b.runways,hp:b.hp,isCarrier:b.isCarrier,t:b.t,aircraftType:b.aircraftType})),
    bm:S.bm.map(b=>({id:b.id,side:b.side,name:b.name,x:b.x,y:b.y,alive:b.alive,launched:b.launched,damage:b.damage,rangeKM:b.rangeKM,speedMach:b.speedMach,spd:b.spd})),
    ships:S.ships.map(s=>({id:s.id,side:s.side,name:s.name,x:s.x,y:s.y,tx:s.tx,ty:s.ty,h:s.h,hp:s.hp,alive:s.alive,spd:s.spd,radarKM:s.radarKM,stealth:s.stealth,wp:s.wp,role:s.role,aircraftType:s.aircraftType}))
  };
}

function restoreSaveData(d) {
  Object.assign(S, d);
  S.gameover = false; S.pan = false; S.sel = null; S.sels = []; S.addMode = null; S.bmLaunchMode = false;
  S.gameStarted = true;
  _('btnPause').textContent = '⏸ PAUSE';
  lg('📂 Game loaded! T:' + S.tick);
}

function loadSlotInfo(slot) {
  const local = localStorage.getItem('cmo_save_slot_' + slot);
  const info = { hasLocal: !!local, hasCloud: false, name: 'Slot ' + slot, tick: 0, source: '---' };
  if (local) {
    try {
      const d = JSON.parse(local);
      info.name = d.saveName || 'Slot ' + slot;
      info.tick = d.tick || 0;
      info.source = '📱';
    } catch(e) {}
  }
  // Check cloud (async — will update modal after resolve)
  const sb = window.cmoSupabase;
  if (sb && sb.isAuthenticated) {
    sb.getAllSaves().then(cloudSaves => {
      if (cloudSaves[slot] && cloudSaves[slot].save_data) {
        const d = cloudSaves[slot].save_data;
        info.hasCloud = true;
        info.name = d.saveName || 'Slot ' + slot;
        info.tick = d.tick || 0;
        info.source = '☁ ' + (sb.userEmail ? sb.userEmail.split('@')[0] : 'cloud');
        // Update the slot button in the modal
        const btn = document.getElementById('slotBtn' + slot);
        if (btn) {
          btn.innerHTML = '<span style="color:#66ccff">' + info.name + '</span> ' + info.source + ' · T:' + info.tick;
        }
      }
    }).catch(() => {});
  }
  return info;
}

async function showSaveSlotModal(mode) {
  hideModal(); // close any open modal
  let html = '<h3 style="color:#ffcc44">' + (mode === 'save' ? '💾 SAVE GAME' : '📂 LOAD GAME') + '</h3><p style="color:#c8ddf0;font-size:12px;margin:8px 0">Email: ' + ((window.cmoSupabase && window.cmoSupabase.userEmail) || 'not signed in') + '</p>';
  for (let i = 1; i <= 5; i++) {
    const info = loadSlotInfo(i);
    html += '<div style="margin:6px 0"><button id="slotBtn' + i + '" onclick="' + (mode === 'save' ? 'saveToSlot(' + i + ')' : 'loadFromSlot(' + i + ')') + '" style="width:100%;padding:10px;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer;text-align:left;font-size:13px">' + info.name + ' ' + info.source + ' · T:' + info.tick + '</button></div>';
  }
  html += '<div style="margin-top:12px"><button onclick="hideModal()" style="width:100%;padding:8px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer">CANCEL</button></div>';
  showModal(html);
  // Cloud slots will update their labels asynchronously as they resolve
}

async function saveToSlot(slot) {
  const data = getSaveData();
  const name = prompt('Name this save (Enter = "Slot ' + slot + '"):') || 'Slot ' + slot;
  data.saveName = name;
  
  // Save to cloud first (if authenticated), then local fallback
  const sb = window.cmoSupabase;
  if (sb && sb.isAuthenticated) {
    try {
      await sb.saveGame(slot, data);
      console.log('[save] cloud slot ' + slot);
    } catch(e) {
      console.warn('[save] cloud failed, local fallback:', e);
      localStorage.setItem('cmo_save_slot_' + slot, JSON.stringify(data));
    }
  } else {
    localStorage.setItem('cmo_save_slot_' + slot, JSON.stringify(data));
  }
  hideModal();
  lg('💾 Saved to ' + name + ' (slot ' + slot + ')');
}

async function loadFromSlot(slot) {
  const sb = window.cmoSupabase;
  // Cloud first, then local
  if (sb && sb.isAuthenticated) {
    try {
      const result = await sb.loadGame(slot);
      if (result) {
        restoreSaveData(result);
        hideModal();
        return;
      }
    } catch(e) {
      console.warn('[load] cloud failed, trying local:', e);
    }
  }
  // Local fallback
  const local = localStorage.getItem('cmo_save_slot_' + slot);
  if (local) {
    try {
      const d = JSON.parse(local);
      restoreSaveData(d);
      hideModal();
      return;
    } catch(e) {
      lg('⚠️ Save corrupted');
    }
  }
  lg('📂 No save found in slot ' + slot);
  hideModal();
}

// ---- SIDE ASSIGNMENT SYSTEM ----
window.assignSideToSelected = function(side) {
  if (!S.pause) { lg('⚠️ Must PAUSE the game before changing sides!'); return; }
  const units = S.sels && S.sels.length > 0 ? S.sels : (S.sel ? [S.sel] : []);
  if (units.length === 0) { lg('⚠️ Select units first (click or drag to select)'); return; }
  let count = 0;
  units.forEach(u => {
    if (u.alive === false) return;
    u.side = side;
    count++;
  });
  const sideName = side === 'blue' ? 'BLUFOR' : side === 'red' ? 'OPFOR' : 'NEUTRAL';
  lg('🏳️ ' + count + ' unit(s) assigned to ' + sideName);
  updateUnitList();
  updateUnassignedList();
  S.sels = [];
};

function updateUnassignedList() {
  let h = '';
  // Collect all unassigned (neutral side) units
  const units = [
    ...S.ac.filter(u => u.alive && u.side === 'neutral'),
    ...S.ships.filter(u => u.alive && u.side === 'neutral'),
    ...S.sam.filter(u => u.alive && u.side === 'neutral'),
    ...S.bm.filter(u => u.alive && u.side === 'neutral'),
    ...S.bases.filter(u => u.alive && u.side === 'neutral')
  ];
  if (units.length === 0) {
    h = '<div style="color:#448844;font-size:8px">✅ All units assigned</div>';
  } else {
    h = `<div style="color:#d4a040;font-size:8px">⚠️ ${units.length} unit(s) need side assignment:</div>`;
    units.slice(0, 10).forEach(u => {
      const icon = u.t === 'ac' ? '✈' : u.t === 'ship' ? '🚢' : u.t === 'sam' ? '🚀' : u.t === 'bm' ? '⚡' : '🏠';
      h += `<div style="padding:1px 0;font-size:7px;color:rgba(90,122,138,0.7)">${icon} ${u.name || 'Unit'}</div>`;
    });
    if (units.length > 10) h += `<div style="font-size:7px;color:rgba(90,122,138,0.4)">+${units.length - 10} more...</div>`;
  }
  const el = _('unassignedList');
  if (el) el.innerHTML = h;
}

_('btnAddAC').onclick=()=>{if(S.missionName&&S.missionName!=='blank'){lg('⚠️ Can only add units in Blank Scenario');return;}lg('Click on LAND to place aircraft');S.addMode='ac';};
_('btnAddSAM').onclick=()=>{if(S.missionName&&S.missionName!=='blank'){lg('⚠️ Can only add units in Blank Scenario');return;}lg('Click on LAND to place SAM');S.addMode='sam';};
_('btnAddBM').onclick=()=>{if(S.missionName&&S.missionName!=='blank'){lg('⚠️ Can only add units in Blank Scenario');return;}lg('Click on LAND to place ballistic missile');S.addMode='bm';};
_('btnAddBase').onclick=()=>{if(S.missionName&&S.missionName!=='blank'){lg('⚠️ Can only add units in Blank Scenario');return;}lg('Click on LAND to place airbase');S.addMode='base';};
_('btnAddBuilding').onclick=()=>{if(S.missionName&&S.missionName!=='blank'){lg('⚠️ Can only add units in Blank Scenario');return;}lg('Click on LAND to place building');S.addMode='building';};
_('btnAddShip').onclick=()=>{if(S.missionName&&S.missionName!=='blank'){lg('⚠️ Can only add units in Blank Scenario');return;}lg('Click on WATER to place naval unit');S.addMode='ship';};
_('btnSide').onclick=()=>{
  showModal(`<h3>🚩 SIDE RELATIONS</h3>
    ${sides.map(s=>`<div class="srow"><span class="l"><span class="side-dot" style="background:${s.color};display:inline-block;width:8px;height:8px;border-radius:50%"></span> ${s.name}</span><span class="r">${s.posture}</span></div>`).join('')}
    <div style="margin-top:8px;font-size:8px;color:rgba(90,122,138,0.5)">BLUFOR vs OPFOR = Hostile • Neutral = Non-hostile</div>
    <button onclick="hideModal()" style="width:100%;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:8px">CLOSE</button>`);
};
_('btnMove').onclick=()=>{if(S.sels&&S.sels.length>0){lg('Click map for waypoint — all');S.addMode='wp';return;}if(S.sel&&(S.sel.t==='ac'||S.sel.t==='ship')&&S.sel.alive){lg('Click map for waypoint');S.addMode='wp';}};
_('btnDesel').onclick=()=>{S.sel=null;S.sels=[];S.bmLaunchMode=false;S.addMode=null;lg('DESELECTED');_('btnRefuel').style.display='none';_('btnStopRefuel').style.display='none';_('btnDelete').style.display='none';};
_('btnKill').onclick=()=>{if(!S.sel)return;if(S.sel.missionLock){lg('⚠️ Cannot control mission units!');return;}if(S.sels&&S.sels.length>0){S.sels.forEach(u=>{if(!u.missionLock)u.alive=false;});S.sel=null;S.sels=[];lg('💀 All destroyed');updateUnitList();return;}S.sel.alive=false;S.sel=null;lg('💀 Destroyed');updateUnitList();};
_('btnRefuel').onclick=()=>{
  const a=S.sel;if(!a||a.t!=='ac'||!a.alive||a.isTanker)return;
  const tankers=S.ac.filter(t=>t.alive&&t.isTanker&&t.side===a.side);
  if(!tankers.length){lg('⚠️ No friendly tankers available!');return;}
  // Find nearest tanker
  let best=null,bestD=Infinity;
  tankers.forEach(t=>{const d=Math.hypot(t.x-a.x,t.y-a.y);if(d<bestD){bestD=d;best=t;}});
  a.tx=best.x;a.ty=best.y;
  a.refuelingAt=best.id;
  lg('⛽ '+a.name+' heading to tanker '+best.name+' for refuel');
};
_('btnStopRefuel').onclick=()=>{
  const a=S.sel;if(!a||a.t!=='ac'||!a.alive)return;
  a.refuelingAt=null;
  lg('⛔ Refueling cancelled for '+a.name);
};
_('btnDelete').onclick=()=>{
  if(!S.sel)return;
  if(S.sel.missionLock){lg('⚠️ Cannot control mission units!');return;}
  if(S.sel.t==='base'){
    // Delete all aircraft parked at this base
    const parked = S.ac.filter(a => a.landingAt === S.sel.id);
    parked.forEach(a => { a.alive = false; });
    S.sel.alive = false;
    lg('🗑️ '+S.sel.name+' deleted ('+parked.length+' aircraft lost)');
  } else if(S.sel.t==='ac')S.sel.alive=false;
  else if(S.sel.t==='ship')S.sel.alive=false;
  else if(S.sel.t==='sam')S.sel.alive=false;
  else if(S.sel.t==='bm')S.sel.alive=false;
  else if(S.sel.nm)S.sel.alive=false;
  else S.sel.alive=false;
  lg('🗑️ '+S.sel.name+' deleted');
  S.sel=null;S.sels=[];
  updateUnitList();
};
_('btnCopy').onclick=()=>{if(!S.sel){lg('Select first');return;}
  showModal(`<h3>📋 Copy</h3><label>Copies (max 10):</label><input type="number" id="copyCount" value="5" min="1" max="10">
     <div class="btns" style="display:flex;gap:6px;margin-top:8px"><button onclick="doCopy()" style="flex:1;padding:6px;background:#1a3050;color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer">COPY</button><button onclick="hideModal()" style="flex:1;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer">CANCEL</button></div>`);};
window.doCopy=function(){
  const n=Math.min(parseInt(_('copyCount').value)||1,10);
  const t=S.sel; if(!t||t.missionLock) return;
  let copied = 0;
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2, r=5+(i%5)*3, nx=t.x+Math.cos(a)*r, ny=t.y+Math.sin(a)*r;
    if(t.t==='ac'){const u=createAircraftFromId(t.spec?t.spec.id:'f16',t.side,nx,ny);u.tx=nx;u.ty=ny;S.ac.push(u);copied++;}
    else if(t.t==='ship'&&t.spec){const u=createShip(t.spec,t.side,nx,ny);S.ships.push(u);copied++;}
    else if(t.t==='sam'){S.sam.push(CMO.createSAMSite(t.spec||AIR_DEFENSE_DB.patriot,t.side,nx,ny));copied++;}
    else if(t.t==='base'){S.bases.push({id:'ab_'+Date.now()+i,name:t.name+' Copy',side:t.side,x:nx,y:ny,runways:t.runways||4,maxAC:t.maxAC||100,ac:0,t:'base',hp:350,maxHP:350,alive:true,aircraftType:t.aircraftType});copied++;}
  }
  hideModal();
  lg(`📋 ${copied}/${n} spawned${copied<n?' (some blocked by terrain)':''}`);
  updateUnitList();
};

function showModal(html){_('modalContent').innerHTML=html;_('modal').classList.add('show');}
function hideModal(){_('modal').classList.remove('show');}
function updateSideList(){let h='';sides.forEach(s=>h+=`<div class="srow"><span class="l" style="color:${s.color}">${s.name}</span><span class="r" style="color:${s.posture==='Hostile'?'#db2b2b':'#60d080'}">${s.posture}</span></div>`);const el=_('sideList');if(el)el.innerHTML=h||'None';else console.warn('[game.js] #sideList element not found in HTML — add <div id="sideList"></div> to your markup');}
function updateUnitList(){
  let h='';
  S.ac.forEach(u=>{if(!u.alive)return;const s=u.side==='blue'?'#2b6fdb':'#db2b2b';h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${s}">✈ ${u.name}</span><span class="uhp">${u.fu|0}%</span></div>`;});
  S.ships.forEach(u=>{if(!u.alive)return;const s=u.side==='blue'?'#2b6fdb':'#db2b2b';h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${s}">🚢 ${u.name}</span><span class="uhp">${((u.hp/u.maxHP)*100)|0}%</span></div>`;});
  S.sam.forEach(u=>{if(!u.alive)return;const s=u.side==='blue'?'#2b6fdb':'#db2b2b';h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${s}">🚀 ${u.name}</span><span class="uhp">${u.hp}HP</span></div>`;});
  S.bm.forEach(u=>{if(!u.alive)return;h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:#e88080">🚀 ${u.name}</span><span class="uhp">RDY</span></div>`;});
  S.bases.forEach(u=>{if(!u.alive)return;h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${u.side==='blue'?'#2b6fdb':'#db2b2b'}">🏠 ${u.name}</span><span class="uhp">${u.ac}/${u.maxAC}</span></div>`;});
  _('unitList').innerHTML=h||'None';
}
window.selectUnit=function(id){try{
  // Don't search missiles — selecting missiles by click is never intended and causes freeze
  S.sel=S.ac.find(u=>u.id===id)||S.ships.find(u=>u.id===id)||S.sam.find(u=>u.id===id)||S.bm.find(u=>u.id===id)||S.bases.find(u=>u.id===id)||null;
  S.bmLaunchMode=false;
  if(S.sel){
    if(S.sel.alive === false) { S.sel = null; updateUnitList(); return; }
    if(S.sel.nm) { // Missile in flight
      lg('🚀 '+S.sel.nm+(S.sel.spd?' | '+(S.sel.spd*CMO.WORLD.kpp*60*60/1000|0)+'km/h':''));
    } else {
      lg((S.sel.t||'?')+' '+S.sel.name);
    }
    if(S.sel.t==='base')showBaseMenu();
    else if(S.sel.t==='bm')showBMLaunchMenu();
    else if(S.sel.t==='ship')showShipMenu();
    else if(S.sel.nm)showMissileInfo(S.sel);
  }
  updateUnitList();
  // Show/hide action buttons based on selection
  const hasSel = !!S.sel;
  _('btnRefuel').style.display = hasSel && S.sel.t==='ac' && !S.sel.isTanker ? 'inline-block' : 'none';
  _('btnStopRefuel').style.display = hasSel && S.sel.t==='ac' && !S.sel.isTanker ? 'inline-block' : 'none';
  _('btnDelete').style.display = hasSel ? 'inline-block' : 'none';
}catch(e){console.error('selectUnit error:',e);}};

function showMissileInfo(m){
  if(!m||!m.nm)return;
  const db = (typeof MISSILE_DB !== 'undefined') ? MISSILE_DB : (typeof WEAPONS_DB !== 'undefined') ? WEAPONS_DB : null;
  const entry = db ? db[m.nm] : null;
  const mach = entry && entry.mach ? entry.mach : '?';
  const dmg = m.dmg || (entry && entry.damage) || '?';
  const rng = entry && (entry.rangeKM || entry.range) ? (entry.rangeKM || entry.range)+'km' : '?';
  showModal(`<h3>🚀 ${m.nm}</h3>
    <div class="srow"><span class="l">Speed</span><span class="r">Mach ${mach}</span></div>
    <div class="srow"><span class="l">Damage</span><span class="r">${dmg}</span></div>
    <div class="srow"><span class="l">Range</span><span class="r">${rng}</span></div>
    <div class="srow"><span class="l">Side</span><span class="r">${m.side==='blue'?'BLUFOR':'OPFOR'}</span></div>
    <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CLOSE</button>`);
}
function showBaseMenu(){if(!S.sel||S.sel.t!=='base'||!S.sel.alive)return;
  const isBuilding = S.sel.isBuilding;
  const hasAC = S.sel.ac > 0;
  const hpPct = S.sel.maxHP ? ((S.sel.hp/S.sel.maxHP)*100).toFixed(0) : 'N/A';
  // Buildings just show info, no aircraft ops
  if(isBuilding){
    showModal(`<h3>🏗️ ${S.sel.name}</h3><div class="srow"><span class="l">Condition</span><span class="r">${hpPct}%</span></div>
      <button onclick="hideModal()" style="width:100%;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:4px">CLOSE</button>`);
    return;
  }
  showModal(`<h3> ${S.sel.name}</h3><div class="srow"><span class="l">HP</span><span class="r">${hpPct}%</span></div><div class="srow"><span class="l">Aircraft</span><span class="r">${S.sel.ac}/${S.sel.maxAC}</span></div><div class="srow"><span class="l">Runways</span><span class="r">${S.sel.runways}</span></div>
    <div style="margin-top:8px"><button onclick="addAircraftToBase()" style="width:100%;padding:6px;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer">✈ ADD AIRCRAFT</button></div>
    ${hasAC?`<div style="margin-top:4px"><button onclick="launchFromBaseMenu()" style="width:100%;padding:6px;background:linear-gradient(180deg,#305018,#182808);color:#60d080;border:1px solid rgba(96,208,128,0.3);border-radius:3px;cursor:pointer">🚀 LAUNCH AIRCRAFT (${S.sel.ac} available)</button></div>`:''}
    <button onclick="hideModal()" style="width:100%;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:4px">CLOSE</button>`);}
window.launchFromBaseMenu=function(){hideModal();
  const b=S.sel; if(!b||b.t!=='base'||b.ac<=0)return;
  showModal(`<h3>🚀 LAUNCH from ${b.name}</h3>
    <label>Aircraft to launch (max ${b.ac}):</label>
    <input type="number" id="launchCount" value="${Math.min(b.ac,4)}" min="1" max="${b.ac}">
    <div style="margin-top:6px;font-size:9px;color:rgba(90,122,138,0.7)">Launch mode:</div>
    <div style="display:flex;gap:6px;margin-top:4px">
      <button onclick="doLaunchFromBase('individual')" style="flex:1;padding:5px;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer;font-size:10px">✈ INDIVIDUAL</button>
      <button onclick="doLaunchFromBase('grouped')" style="flex:1;padding:5px;background:linear-gradient(180deg,#305018,#182808);color:#60d080;border:1px solid rgba(96,208,128,0.3);border-radius:3px;cursor:pointer;font-size:10px">🛩 GROUPED</button>
    </div>
    <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);};
window.doLaunchFromBase=function(mode){
  const b=S.sel; if(!b||b.t!=='base'||b.ac<=0)return;
  const n=Math.min(parseInt(_('launchCount').value)||1, b.ac);
  // FIX: use the actual type that was added to this base (set by
  // doAddToBase / doAddToBaseWithLoadout) instead of always spawning F-35A
  const t=b.aircraftType || 'f35a';
  for(let i=0;i<n;i++){
    const offsetX=(Math.random()-0.5)*4, offsetY=(Math.random()-0.5)*4;
    const a=createAircraftFromId(t,b.side,b.x+offsetX,b.y+offsetY);
    a.landingAt=null; a.spawnDelay=0; a.fu=100;
    if(mode==='grouped'){a.groupId='grp_'+b.id; a.name=b.name+' Flight '+(i+1);}
    S.ac.push(a); b.ac--;
  }
  hideModal();
  lg(`🚀 ${n} aircraft launched from ${b.name} (${b.ac}/${b.maxAC} left)`);
  updateUnitList();
};
window.addAircraftToBase=function(){hideModal();
  const maxCanAdd = S.sel ? S.sel.maxAC - S.sel.ac : 0;
  showModal(`<h3>✈️ Select Aircraft</h3><label>Type:</label><select id="baseACType">
    ${Object.keys(AIRCRAFT_LOOKUP).map(v=>`<option value="${v}">${v.toUpperCase()}</option>`).join('')}
    </select><label>Qty (max ${maxCanAdd}):</label><input type="number" id="baseACCount" value="4" min="1" max="${maxCanAdd}">
    <div class="btns" style="display:flex;gap:6px;margin-top:10px">
    <button onclick="doAddToBase()" style="flex:1;padding:6px;background:#1a3050;color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer">ADD</button>
    <button onclick="hideModal()" style="flex:1;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer">CLOSE</button></div>`);};
window.doAddToBase=function(){const b=S.sel;if(!b||b.t!=='base')return;const t=_('baseACType').value;const maxCanAdd = b.maxAC - b.ac;const n=Math.min(parseInt(_('baseACCount').value)||1, Math.max(0, maxCanAdd));
  // FIX: remember which aircraft type this base holds, so LAUNCH spawns the
  // right plane instead of always defaulting to F-35A
  b.aircraftType = t;
  // Ask for loadout type
  const spec = AIRCRAFT_LOOKUP[t]||F35A_DATA;
  const compat = spec.compatibleWeapons||[];
  const hasA2A = compat.some(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2a'||d.type==='air_to_air');});
  const hasA2G = compat.some(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2g'||d.type==='a2s'||d.type==='air_to_ground'||d.type==='anti_ship'||d.type==='cruise');});
  hideModal();
  if(hasA2A||hasA2G){
    showModal(`<h3>✈️ Loadout for ${spec.name||t.toUpperCase()}</h3>
      ${hasA2A?`<button onclick="doAddToBaseWithLoadout('${t}','a2a',${n})" style="display:block;width:100%;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">🎯 AIR-TO-AIR (A2A)</button>`:''}
      ${hasA2G?`<button onclick="doAddToBaseWithLoadout('${t}','a2g',${n})" style="display:block;width:100%;background:linear-gradient(180deg,#305018,#182808);color:#60d080;border:1px solid rgba(96,208,128,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">💥 AIR-TO-GROUND (A2G)</button>`:''}
      ${hasA2A&&hasA2G?`<button onclick="doAddToBaseWithLoadout('${t}','multi',${n})" style="display:block;width:100%;background:linear-gradient(180deg,#305048,#182838);color:#c4a050;border:1px solid rgba(196,160,80,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">🔄 MULTIROLE (A2A + A2G)</button>`:''}
      <button onclick="hideModal()" style="display:block;width:100%;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;padding:5px;margin-top:6px;font-size:10px">CANCEL</button>`);
  } else {
    for(let i=0;i<n;i++){const a=createAircraftFromId(t,b.side,b.x+(Math.random()-0.5)*3,b.y+(Math.random()-0.5)*3);a.spawnDelay=20+i*5;a.landingAt=b.id;b.ac++;S.ac.push(a);}
    lg(`✈️ ${n}x ${t} added to ${b.name} (${b.ac}/${b.maxAC})`);updateUnitList();
  }
};
window.doAddToBaseWithLoadout=function(t,loadout,n){
  const b=S.sel; if(!b||b.t!=='base')return;
  // FIX: keep aircraftType in sync here too (this path bypasses doAddToBase)
  b.aircraftType = t;
  for(let i=0;i<n;i++){
    const a=createAircraftFromId(t,b.side,b.x+(Math.random()-0.5)*3,b.y+(Math.random()-0.5)*3);
    a.spawnDelay=20+i*5;a.landingAt=b.id;b.ac++;
    // Apply loadout
    const spec=AIRCRAFT_LOOKUP[t]||F35A_DATA;
    const compat=spec.compatibleWeapons||[];
    if(loadout==='a2a'){
      a.wp=[];const a2a=compat.filter(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2a'||d.type==='air_to_air');});
      a2a.slice(0,2).forEach((w,i)=>{a.wp.push({id:w,cnt:i===0?4:2});});
      if(!a.wp.length)a.wp=[{id:'aim120c',cnt:4}];
    }else if(loadout==='a2g'){
      a.wp=[];const a2g=compat.filter(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2g'||d.type==='a2s'||d.type==='air_to_ground'||d.type==='anti_ship'||d.type==='cruise');});
      a2g.slice(0,2).forEach((w,i)=>{a.wp.push({id:w,cnt:i===0?4:2});});
      if(!a.wp.length)a.wp=[{id:'agm158',cnt:4}];
    }
    S.ac.push(a);
  }
  hideModal();
  lg(`✈️ ${n}x ${t} (${loadout.toUpperCase()}) added to ${b.name} (${b.ac}/${b.maxAC})`);
  updateUnitList();
};

function showShipMenu(){
  if(!S.sel||S.sel.t!=='ship'||!S.sel.alive)return;
  const isCarrier = S.sel.isCarrier;
  const wplist = S.sel.wp ? S.sel.wp.map(w=>w.id+(w.count?':'+w.count:'')).join(', ') : 'None';
  if(isCarrier){
    const hasAC = S.sel.ac > 0;
    showModal(`<h3>🚢 ${S.sel.name}</h3>
      <div class="srow"><span class="l">HP</span><span class="r">${S.sel.hp}/${S.sel.maxHP}</span></div>
      <div class="srow"><span class="l">Aircraft</span><span class="r">${S.sel.ac}/${S.sel.maxAC}</span></div>
      <div class="srow"><span class="l">Runways</span><span class="r">${S.sel.runways}</span></div>
      <div class="srow"><span class="l">Role</span><span class="r">${S.sel.role}</span></div>
      <div style="margin-top:8px"><button onclick="addAircraftToCarrier()" style="width:100%;padding:6px;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer">✈ ADD AIRCRAFT</button></div>
      ${hasAC?`<div style="margin-top:4px"><button onclick="launchFromCarrierMenu()" style="width:100%;padding:6px;background:linear-gradient(180deg,#305018,#182808);color:#60d080;border:1px solid rgba(96,208,128,0.3);border-radius:3px;cursor:pointer">🚀 LAUNCH AIRCRAFT (${S.sel.ac} available)</button></div>`:''}
      <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:4px">CLOSE</button>`);
  } else {
    showModal(`<h3>🚢 ${S.sel.name}</h3>
      <div class="srow"><span class="l">HP</span><span class="r">${S.sel.hp}/${S.sel.maxHP}</span></div>
      <div class="srow"><span class="l">Speed</span><span class="r">${(S.sel.spec&&S.sel.spec.speedKMH)||55}km/h</span></div>
      <div class="srow"><span class="l">Radar</span><span class="r">${S.sel.radarKM||300}km</span></div>
      <div class="srow"><span class="l">Weapons</span><span class="r">${wplist}</span></div>
      <div class="srow"><span class="l">Role</span><span class="r">${S.sel.role}</span></div>
      <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CLOSE</button>`);
  }
}
window.addAircraftToCarrier=function(){hideModal();
  const c=S.sel; if(!c||c.t!=='ship'||!c.isCarrier)return;
  const maxCanAdd = c.maxAC - c.ac;
  const compatTypes = c.compatibleAircraft && c.compatibleAircraft.length > 0 ? c.compatibleAircraft : Object.keys(AIRCRAFT_LOOKUP);
  showModal(`<h3>✈️ Add Aircraft to ${c.name}</h3>
    <label>Type:</label><select id="carrierACType">
      ${compatTypes.map(v=>`<option value="${v}">${v.toUpperCase()}</option>`).join('')}
    </select>
    <label>Qty (max ${maxCanAdd}):</label><input type="number" id="carrierACCount" value="${Math.min(4,maxCanAdd)}" min="1" max="${maxCanAdd}">
    <div class="btns" style="display:flex;gap:6px;margin-top:10px">
    <button onclick="doAddToCarrier()" style="flex:1;padding:6px;background:#1a3050;color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer">ADD</button>
    <button onclick="hideModal()" style="flex:1;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer">CLOSE</button></div>`);
};
window.doAddToCarrier=function(){const c=S.sel;if(!c||c.t!=='ship'||!c.isCarrier)return;const t=_('carrierACType').value;const maxCanAdd = c.maxAC - c.ac;const n=Math.min(parseInt(_('carrierACCount').value)||1, Math.max(0, maxCanAdd));
  // FIX: remember which aircraft type this carrier holds, so LAUNCH spawns
  // the right plane instead of always using compatibleAircraft[0]
  c.aircraftType = t;
  const spec = AIRCRAFT_LOOKUP[t]||F35A_DATA;
  const compat = spec.compatibleWeapons||[];
  const hasA2A = compat.some(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2a'||d.type==='air_to_air');});
  const hasA2G = compat.some(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2g'||d.type==='a2s'||d.type==='air_to_ground'||d.type==='anti_ship'||d.type==='cruise');});
  hideModal();
  if(hasA2A||hasA2G){
    showModal(`<h3>✈️ Loadout for ${spec.name||t.toUpperCase()}</h3>
      ${hasA2A?`<button onclick="doAddToCarrierWithLoadout('${t}','a2a',${n})" style="display:block;width:100%;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">🎯 AIR-TO-AIR (A2A)</button>`:''}
      ${hasA2G?`<button onclick="doAddToCarrierWithLoadout('${t}','a2g',${n})" style="display:block;width:100%;background:linear-gradient(180deg,#305018,#182808);color:#60d080;border:1px solid rgba(96,208,128,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">💥 AIR-TO-GROUND (A2G)</button>`:''}
      ${hasA2A&&hasA2G?`<button onclick="doAddToCarrierWithLoadout('${t}','multi',${n})" style="display:block;width:100%;background:linear-gradient(180deg,#305048,#182838);color:#c4a050;border:1px solid rgba(196,160,80,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">🔄 MULTIROLE (A2A + A2G)</button>`:''}
      <button onclick="hideModal()" style="display:block;width:100%;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;padding:5px;margin-top:6px;font-size:10px">CANCEL</button>`);
  } else {
    for(let i=0;i<n;i++){const a=createAircraftFromId(t,c.side,c.x+(Math.random()-0.5)*3,c.y+(Math.random()-0.5)*3);a.spawnDelay=20+i*5;a.landingAt=c.id;c.ac++;S.ac.push(a);}
    lg(`✈️ ${n}x ${t} added to ${c.name} (${c.ac}/${c.maxAC})`);updateUnitList();
  }
};
window.doAddToCarrierWithLoadout=function(t,loadout,n){
  const c=S.sel; if(!c||c.t!=='ship'||!c.isCarrier)return;
  // FIX: keep aircraftType in sync here too (this path bypasses doAddToCarrier)
  c.aircraftType = t;
  for(let i=0;i<n;i++){
    const a=createAircraftFromId(t,c.side,c.x+(Math.random()-0.5)*3,c.y+(Math.random()-0.5)*3);
    a.spawnDelay=20+i*5;a.landingAt=c.id;c.ac++;
    const spec=AIRCRAFT_LOOKUP[t]||F35A_DATA;
    const compat=spec.compatibleWeapons||[];
    if(loadout==='a2a'){
      a.wp=[];const a2a=compat.filter(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2a'||d.type==='air_to_air');});
      a2a.slice(0,2).forEach((w,i)=>{a.wp.push({id:w,cnt:i===0?4:2});});
      if(!a.wp.length)a.wp=[{id:'aim120c',cnt:4}];
    }else if(loadout==='a2g'){
      a.wp=[];const a2g=compat.filter(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2g'||d.type==='a2s'||d.type==='air_to_ground'||d.type==='anti_ship'||d.type==='cruise');});
      a2g.slice(0,2).forEach((w,i)=>{a.wp.push({id:w,cnt:i===0?4:2});});
      if(!a.wp.length)a.wp=[{id:'agm158',cnt:4}];
    }
    S.ac.push(a);
  }
  hideModal();
  lg(`✈️ ${n}x ${t} (${loadout.toUpperCase()}) added to ${c.name} (${c.ac}/${c.maxAC})`);
  updateUnitList();
};
window.launchFromCarrierMenu=function(){hideModal();
  const c=S.sel; if(!c||c.t!=='ship'||!c.isCarrier||c.ac<=0)return;
  showModal(`<h3>🚀 LAUNCH from ${c.name}</h3>
    <label>Aircraft to launch (max ${c.ac}):</label>
    <input type="number" id="carrierLaunchCount" value="${Math.min(c.ac,4)}" min="1" max="${c.ac}">
    <div style="margin-top:6px;font-size:9px;color:rgba(90,122,138,0.7)">Launch mode:</div>
    <div style="display:flex;gap:6px;margin-top:4px">
      <button onclick="doLaunchFromCarrier('individual')" style="flex:1;padding:5px;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer;font-size:10px">✈ INDIVIDUAL</button>
      <button onclick="doLaunchFromCarrier('grouped')" style="flex:1;padding:5px;background:linear-gradient(180deg,#305018,#182808);color:#60d080;border:1px solid rgba(96,208,128,0.3);border-radius:3px;cursor:pointer;font-size:10px">🛩 GROUPED</button>
    </div>
    <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);
};
window.doLaunchFromCarrier=function(mode){
  const c=S.sel; if(!c||c.t!=='ship'||!c.isCarrier||c.ac<=0)return;
  const n=Math.min(parseInt(_('carrierLaunchCount').value)||1, c.ac);
  // FIX: prefer the actual type added to this carrier over the generic
  // compatibleAircraft[0] fallback
  const t = c.aircraftType || ((c.compatibleAircraft && c.compatibleAircraft.length > 0) ? c.compatibleAircraft[0] : 'fa18e');
  for(let i=0;i<n;i++){
    const offsetX=(Math.random()-0.5)*4, offsetY=(Math.random()-0.5)*4;
    const a=createAircraftFromId(t,c.side,c.x+offsetX,c.y+offsetY);
    a.landingAt=null; a.spawnDelay=0; a.fu=100;
    if(mode==='grouped'){a.groupId='grp_'+c.id; a.name=c.name+' Flight '+(i+1);}
    S.ac.push(a); c.ac--;
  }
  hideModal();
  lg(`🚀 ${n} aircraft launched from ${c.name} (${c.ac}/${c.maxAC} left)`);
  updateUnitList();
};

function showBMLaunchMenu(){
  if(!S.sel||S.sel.t!=='bm'||!S.sel.alive||S.sel.launched)return;
  if(S.sel.missionLock){lg('⚠️ Cannot control mission units!');hideModal();return;}
  showModal(`<h3>🚀 ${S.sel.name}</h3>
    <div class="srow"><span class="l">Range</span><span class="r">${S.sel.rangeKM}km</span></div>
    <div class="srow"><span class="l">Speed</span><span class="r">Mach ${S.sel.speedMach}</span></div>
    <div class="srow"><span class="l">Damage</span><span class="r">${S.sel.damage}</span></div>
    <div style="margin-top:10px"><button onclick="launchBMButton()" style="width:100%;padding:8px;background:linear-gradient(180deg,#503018,#301808);color:#ffaa40;border:1px solid rgba(255,170,64,0.3);border-radius:3px;cursor:pointer;font-size:11px">🎯 LAUNCH — Select Target on Map</button></div>
    <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:4px">CANCEL</button>`);
}
window.launchBMButton=function(){
  if(!S.sel||S.sel.t!=='bm')return;
  if(S.sel.missionLock){lg('⚠️ Cannot control mission units!');hideModal();return;}
  hideModal();
  S.bmPendingTarget = S.sel;
  S.bmLaunchMode = true;
  S.addMode = 'bm_target';
  lg('🎯 Click on the map to select target for ' + S.sel.name);
};

function launchBM(bm, tx, ty) {
  if (!bm || !bm.alive || bm.launched) return;
  const dKM = Math.hypot(tx - bm.x, ty - bm.y) * W.kpp;
  if (dKM > bm.rangeKM) { lg('⚠️ Target out of range! ('+Math.round(dKM)+'km > '+bm.rangeKM+'km)'); return; }
  bm.tx = tx; bm.ty = ty;
  bm.launched = true;
  lg('🚀 ' + bm.name + ' launched! ETA ' + Math.round(dKM/200) + 's · Range: ' + Math.round(dKM) + 'km');
  S.mis.push({
    id: 'mis' + Date.now() + '_' + (Math.random() * 99999 | 0),
    x: bm.x, y: bm.y, tx: tx, ty: ty,
    spd: bm.spd / 4, dmg: bm.damage, nm: bm.name,
    isSAM: false, isA2A: false, isA2G: false, isNaval: false,
    isBallistic: true, side: bm.side,
    tr: [], alive: true
  });
  bm.alive = false;
  S.bmPendingTarget = null; S.bmLaunchMode = false; S.addMode = null;
  updateUnitList();
}

let dragStart=null;
cv.addEventListener('mousedown',e=>{
  const wx=(e.offsetX-cw/2)/S.zoom+S.camX,wy=(e.offsetY-ch/2)/S.zoom+S.camY;
  if(e.button===0){
    if(S.addMode==='ac'){showAircraftPicker(wx,wy);return;}
    if(S.addMode==='sam'){showSAMPicker(wx,wy);return;}
    if(S.addMode==='bm'){showBMPicker(wx,wy);return;}
    if(S.addMode==='building'){showBuildingPicker(wx,wy);return;}
    if(S.addMode==='base'){S.bases.push({id:'ab_'+Date.now()+'x',x:wx,y:wy,name:'Airbase',side:'blue',runways:4,maxAC:100,ac:0,t:'base',hp:350,maxHP:350,alive:true});lg('🏠 Base placed');S.addMode=null;updateUnitList();return;}
    if(S.addMode==='ship'){showShipPicker(wx,wy);return;}
    if(S.addMode==='wp'){if(S.sels&&S.sels.length>0){S.sels.forEach(u=>{if((u.t==='ac'||u.t==='ship')&&u.alive&&!u.missionLock){u.tx=wx;u.ty=wy;}});lg('✈ WP '+S.sels.length);}else if(S.sel&&(S.sel.t==='ac'||S.sel.t==='ship')&&S.sel.alive&&!S.sel.missionLock){S.sel.tx=wx;S.sel.ty=wy;lg('✈ WP');}S.addMode=null;return;}
    if(S.addMode==='bm_target'&&S.bmPendingTarget){
      let hitAC = false;
      for(let i=0;i<S.ac.length;i++){if(S.ac[i].alive&&Math.hypot(wx-S.ac[i].x,wy-S.ac[i].y)<6){hitAC=true;break;}}
      if(hitAC){lg('⚠️ Cannot target aerial targets with ballistic missiles!');S.addMode=null;S.bmPendingTarget=null;S.bmLaunchMode=false;return;}
      launchBM(S.bmPendingTarget,wx,wy);return;}
    dragStart={x:e.offsetX,y:e.offsetY,wx,wy};S.selBox=null;
    let best=null,bestD=15;
    // Don't search missiles — clicking missiles is never intended and causes freeze
    const allUnits = [...S.ac.filter(u=>u.alive), ...S.ships.filter(u=>u.alive), ...S.sam.filter(u=>u.alive), ...S.bm.filter(u=>u.alive), ...S.bases.filter(b=>b.alive)];
    allUnits.forEach(u=>{const d=Math.hypot(wx-u.x,wy-u.y);if(d<bestD){bestD=d;best=u;}});
    if(best){S.sel=best;S.sels=[];S.bmLaunchMode=false;
      if(best.t==='base')showBaseMenu();
      else if(best.t==='bm')showBMLaunchMenu();
      else if(best.t==='ship')showShipMenu();
      else if(best.nm){showMissileInfo(best);}
      else {lg('Selected: '+best.name);}
    }else{S.sel=null;S.sels=[];S.bmLaunchMode=false;dragStart={x:e.offsetX,y:e.offsetY,wx,wy};}
    updateUnitList();
  }
  if(e.button===1){S.camLock=!S.camLock;lg('📷 Camera: '+(S.camLock?'LOCKED (scroll to zoom)':'FREE (scroll to zoom)'));}
  if(e.button===2){S.pan=true;S.panX=e.clientX;S.panY=e.clientY;S.camLock=false;lg('📷 Camera FREE — right-drag to pan');}
});
cv.addEventListener('mousemove',e=>{if(S.pan){S.camX=Math.max(0,Math.min(W.mapW,S.camX+(S.panX-e.clientX)/S.zoom));S.camY=Math.max(0,Math.min(W.mapH,S.camY+(S.panY-e.clientY)/S.zoom));S.panX=e.clientX;S.panY=e.clientY;}if(dragStart&&!S.addMode){const dx=e.offsetX-dragStart.x,dy=e.offsetY-dragStart.y;if(Math.abs(dx)>5||Math.abs(dy)>5)S.selBox={x1:dragStart.wx,y1:dragStart.wy,x2:(e.offsetX-cw/2)/S.zoom+S.camX,y2:(e.offsetY-ch/2)/S.zoom+S.camY};}});
cv.addEventListener('mouseup',e=>{if(e.button===2)S.pan=false;if(S.selBox&&dragStart){const bx={minX:Math.min(S.selBox.x1,S.selBox.x2),maxX:Math.max(S.selBox.x1,S.selBox.x2),minY:Math.min(S.selBox.y1,S.selBox.y2),maxY:Math.max(S.selBox.y1,S.selBox.y2)};S.sels=[];S.ac.forEach(u=>{if(!u.alive)return;if(u.x>=bx.minX&&u.x<=bx.maxX&&u.y>=bx.minY&&u.y<=bx.maxY)S.sels.push(u);});S.ships.forEach(u=>{if(!u.alive)return;if(u.x>=bx.minX&&u.x<=bx.maxX&&u.y>=bx.minY&&u.y<=bx.maxY)S.sels.push(u);});S.sam.forEach(u=>{if(!u.alive)return;if(u.x>=bx.minX&&u.x<=bx.maxX&&u.y>=bx.minY&&u.y<=bx.maxY)S.sels.push(u);});if(S.sels.length){S.sel=S.sels[0];lg('🔲 '+S.sels.length);}S.selBox=null;updateUnitList();}dragStart=null;});
cv.addEventListener('mouseleave',()=>{S.pan=false;S.selBox=null;dragStart=null;});
cv.addEventListener('contextmenu',e=>{e.preventDefault();S.sel=null;S.sels=[];S.addMode=null;S.bmLaunchMode=false;lg('DESELECTED');updateUnitList();});
cv.addEventListener('wheel',e=>{e.preventDefault();const mx=e.offsetX,my=e.offsetY;const wx=(mx-cw/2)/S.zoom+S.camX,wy=(my-ch/2)/S.zoom+S.camY,f=e.deltaY>0?0.92:1.09;S.zoom=Math.max(0.3,Math.min(8,S.zoom*f));S.camX=Math.max(0,Math.min(W.mapW,wx-(mx-cw/2)/S.zoom));S.camY=Math.max(0,Math.min(W.mapH,wy-(my-ch/2)/S.zoom));});


function showShipPicker(wx, wy){
  // FIX: ships MUST be on water — this check was previously missing entirely
  // (and even if present, was defeated by the isOceanPosition override that
  // has now been removed from this file).
  if(!isOceanPosition(wx, wy)) { lg('⚠️ Ships must be placed on WATER!'); S.addMode = null; return; }
  const types = Object.keys(SHIPS_DB || {});
  if(!types.length) { lg('⚠️ No ships loaded'); S.addMode = null; return; }
  const catList = ['destroyer','cruiser','supercarrier','carrier','next_gen_supercarrier','heavy_carrier_cruiser','light_carrier','medium_carrier','attack_sub','diesel_sub','nuclear_attack_sub','ballistic_sub','frigate','corvette','corvette_frigate','light_frigate','multi_role_frigate','amphibious_assault','landing_ship','fast_attack','stealth_destroyer','air_defense_destroyer','aegis_destroyer','heavy_destroyer','missile_cruiser','battlecruiser'];
  const catNames = {destroyer:'🚢 Destroyers',cruiser:'🚢 Cruisers',supercarrier:'⚓ Supercarriers',carrier:'⚓ Carriers',next_gen_supercarrier:'⚓ Next-Gen Carriers',heavy_carrier_cruiser:'⚓ Hvy Crzr Carriers',light_carrier:'⚓ Light Carriers',medium_carrier:'⚓ Medium Carriers',attack_sub:'🐬 Attack Subs',diesel_sub:'🐬 Diesel Subs',nuclear_attack_sub:'🐬 Nuc Attack Subs',ballistic_sub:'🐬 Ballistic Subs',frigate:'🚢 Frigates',corvette:'🚢 Corvettes',corvette_frigate:'🚢 Corvette-Frigates',light_frigate:'🚢 Light Frigates',multi_role_frigate:'🚢 Multi-Role Frigates',amphibious_assault:'⚓ Assault Ships',landing_ship:'⚓ Landing Ships',fast_attack:'🚤 Fast Attack Craft',stealth_destroyer:'🚢 Stealth Destroyers',air_defense_destroyer:'🚢 AD Destroyers',aegis_destroyer:'🚢 Aegis Destroyers',heavy_destroyer:'🚢 Heavy Destroyers',missile_cruiser:'🚢 Missile Cruisers',battlecruiser:'🚢 Battlecruisers'};
  showModal(`<h3>🚢 Select Naval Unit</h3><div style="max-height:360px;overflow-y:auto">
    ${catList.map(cat=>{
      const items = types.filter(t=>SHIPS_DB[t].role === cat);
      if(!items.length) return '';
      return `<div style="color:rgba(43,111,219,0.6);font-size:7px;text-transform:uppercase;margin:6px 0 3px">${catNames[cat]||cat}</div>
        ${items.map(id=>{const sp=SHIPS_DB[id];const s=(sp.faction==='China'||sp.faction==='Russia'||sp.faction==='Iran')?'red':'blue';
          return `<button onclick="placeShip('${sp.id}','${s}',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid ${s==='blue'?'rgba(43,111,219,0.2)':'rgba(219,43,43,0.2)'};color:${s==='blue'?'#5a8cf5':'#e55a5a'};padding:3px 6px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${s==='blue'?'🔵':'🔴'} ${sp.name}</button>`;}).join('')}`;
    }).join('')}
    </div><button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);
}
window.placeShip=function(id,side,wx,wy){
  // FIX: enforce water-only placement for ships (was previously a no-op
  // comment saying "ships can be placed anywhere" — that was the bug).
  if(isOceanPosition(wx,wy)===false){lg('⚠️ Ships must be placed on WATER!');return;}
  const spec = SHIPS_DB[id]; if(!spec) return;
  const ship = createShip(spec, side, wx, wy); if(!ship) return;
  S.ships.push(ship); hideModal(); S.addMode = null;
  lg('🚢 ' + ship.name + ' deployed'); updateUnitList();
};

function createBMFromId(bmId, side, x, y) {
  const spec = BALLISTIC_DB[bmId]; if (!spec) return null;
  const mach = spec.speedMach || (spec.speedKMH ? spec.speedKMH / 1225 : 7);
  return {
    id: 'bm' + Date.now() + '_' + (Math.random() * 99999 | 0), t: 'bm', side,
    name: spec.name || 'Ballistic Missile',
    x, y, tx: x, ty: y, alive: true, launched: false, ready: true,
    speedMach: mach, damage: spec.damage || 500, rangeKM: spec.rangeKM || 1300,
    hp: (spec.hp || 1), spd: CMO.machToPxPerTick(mach), spec: spec, tr: []
  };
}
function showBuildingPicker(wx, wy){
  if(isOceanPosition(wx, wy)) { lg('⚠️ Buildings must be on land!'); S.addMode = null; return; }
  const types = Object.keys(BUILDINGS_DB || {});
  if(!types.length) { lg('⚠️ No buildings loaded'); S.addMode = null; return; }
  showModal(`<h3>🏗️ Select Building</h3><div style="max-height:360px;overflow-y:auto">
    ${['military','industrial','infrastructure','civilian','transport'].map(cat=>{
      const items = types.filter(t=>BUILDINGS_DB[t].type===cat);
      if(!items.length) return '';
      return `<div style="color:rgba(43,111,219,0.6);font-size:7px;text-transform:uppercase;margin:6px 0 3px">${cat.toUpperCase()} (${items.length})</div>
        ${items.map(t=>{const sp=BUILDINGS_DB[t];return `<button onclick="placeBuilding('${t}','blue',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid rgba(196,160,80,0.25);color:#c4a050;padding:3px 6px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${sp.icon} ${sp.name}</button>`;}).join('')}`;
    }).join('')}
    </div><button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);
}
window.placeBuilding=function(id,side,wx,wy){
  if(isOceanPosition(wx,wy)){lg('⚠️ Buildings must be on land!');return;}
  const sp=BUILDINGS_DB[id]; if(!sp)return;
  S.bases.push({id:'bld_'+Date.now(),x:wx,y:wy,name:sp.name,side:side,t:'base',hp:sp.hp,maxHP:sp.hp,runways:0,maxAC:0,ac:0,alive:true,isBuilding:true,buildingIcon:sp.icon});
  hideModal(); S.addMode = null;
  lg('🏗️ '+sp.name+' placed ('+sp.hp+'HP)'); updateUnitList();
};

function showBMPicker(wx, wy){
  const types = Object.keys(BALLISTIC_DB);
  showModal(`<h3>🚀 Select Ballistic Missile</h3><div style="max-height:360px;overflow-y:auto">
    ${types.map(t=>{const sp=BALLISTIC_DB[t];if(!sp)return '';const emoji=sp.type==='drone'||sp.type==='jet_drone'?'🛸':'🚀';return `<button onclick="placeBM('${t}','red',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid rgba(229,90,90,0.15);color:#e88080;padding:3px 6px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${emoji} ${sp.name} (M${sp.speedMach||'-'})</button>`;}).join('')}
    </div><button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);
}
window.placeBM=function(id,side,wx,wy){if(isOceanPosition(wx,wy)){lg('⚠️ BMs must be on land!');return;}const bm=createBMFromId(id,side,wx,wy);if(!bm)return;S.bm.push(bm);hideModal();S.addMode=null;lg('🚀 '+bm.name+' placed');updateUnitList();};

function showAircraftPicker(wx,wy){
  // Aircraft can be placed anywhere (on land, ocean, etc.)
  const combatRoles = ['fighter','multirole','stealth_fighter','stealth_multirole','interceptor','cas','strike','trainer_attack','gunship'];
  const bomberRoles = ['bomber','stealth_bomber'];
  const supportRoles = ['tanker','awacs','maritime_patrol','recon','transport','special_ops','tiltrotor','utility_helicopter','attack_helicopter','recon_drone','strike_drone','ucav','loitering'];
  const types = Object.keys(AIRCRAFT_LOOKUP).map(id => {
    const spec = AIRCRAFT_LOOKUP[id];
    if (!spec) return null;
    const role = spec.role || 'fighter';
    let c = 'F';
    if (bomberRoles.includes(role)) c = 'B';
    else if (supportRoles.includes(role)) c = 'S';
    let s = spec.faction && (spec.faction.includes('Russia')||spec.faction.includes('China')||spec.faction.includes('Iran')||spec.faction.includes('North Korea')) ? 'red' : 'blue';
    return {id, n:spec.name||id.toUpperCase(), s, c};
  }).filter(Boolean);
  showModal(`<h3>✈️ Aircraft</h3><div style="max-height:360px;overflow-y:auto">
    ${'F,B,S'.split(',').map(cat=>{
      const catName = cat==='F'?'Fighters/Attack':cat==='B'?'Bombers':'Support/Drones';
      const items = types.filter(t=>t.c===cat);
      if (!items.length) return '';
      return `<div style="color:rgba(43,111,219,0.6);font-size:7px;text-transform:uppercase;margin:6px 0 3px">${catName} (${items.length})</div>
        ${items.map(t=>`<button onclick="placeAircraft('${t.id}','${t.s}',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid ${t.s==='blue'?'rgba(43,111,219,0.2)':'rgba(219,43,43,0.2)'};color:${t.s==='blue'?'#5a8cf5':'#e55a5a'};padding:2px 5px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${t.s==='blue'?'🔵':'🔴'} ${t.n}</button>`).join('')}`;
    }).join('')}</div>
    <button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);}
window.placeAircraft=function(id,side,wx,wy){
  // Ask for loadout
  const spec = AIRCRAFT_LOOKUP[id]||F35A_DATA;
  const compat = spec.compatibleWeapons||[];
  const hasA2A = compat.some(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2a'||d.type==='air_to_air');});
  const hasA2G = compat.some(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2g'||d.type==='a2s'||d.type==='air_to_ground'||d.type==='anti_ship'||d.type==='cruise');});
  if(!hasA2A&&!hasA2G){const a=createAircraftFromId(id,side,wx,wy);S.ac.push(a);hideModal();S.addMode=null;lg('✈️ '+a.name);updateUnitList();return;}
  showModal(`<h3>✈️ Select Loadout: ${spec.name||id.toUpperCase()}</h3>
    ${hasA2A?`<button onclick="placeACLoadout('${id}','${side}',${wx},${wy},'a2a')" style="display:block;width:100%;background:linear-gradient(180deg,#1a3050,#142840);color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">🎯 AIR-TO-AIR (A2A)</button>`:''}
    ${hasA2G?`<button onclick="placeACLoadout('${id}','${side}',${wx},${wy},'a2g')" style="display:block;width:100%;background:linear-gradient(180deg,#305018,#182808);color:#60d080;border:1px solid rgba(96,208,128,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">💥 AIR-TO-GROUND (A2G)</button>`:''}
    ${hasA2A&&hasA2G?`<button onclick="placeACLoadout('${id}','${side}',${wx},${wy},'multi')" style="display:block;width:100%;background:linear-gradient(180deg,#305048,#182838);color:#c4a050;border:1px solid rgba(196,160,80,0.3);border-radius:3px;cursor:pointer;padding:8px;margin:4px 0;font-size:11px">🔄 MULTIROLE (A2A + A2G)</button>`:''}
    <button onclick="hideModal();S.addMode=null;" style="display:block;width:100%;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;padding:5px;margin-top:6px;font-size:10px">CANCEL</button>`);
};
window.placeACLoadout=function(id,side,wx,wy,loadout){
  const a=createAircraftFromId(id,side,wx,wy);
  // Filter loadout based on selection
  const spec=AIRCRAFT_LOOKUP[id]||F35A_DATA;
  const compat=spec.compatibleWeapons||[];
  if(loadout==='a2a'){
    a.wp=[];
    const a2a=compat.filter(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2a'||d.type==='air_to_air');});
    a2a.slice(0,2).forEach((w,i)=>{a.wp.push({id:w,cnt:i===0?4:2});});
    if(!a.wp.length)a.wp=[{id:'aim120c',cnt:4}];
  }else if(loadout==='a2g'){
    a.wp=[];
    const a2g=compat.filter(i=>{const d=MISSILE_DB[i];return d&&(d.type==='a2g'||d.type==='a2s'||d.type==='air_to_ground'||d.type==='anti_ship'||d.type==='cruise');});
    a2g.slice(0,2).forEach((w,i)=>{a.wp.push({id:w,cnt:i===0?4:2});});
    if(!a.wp.length)a.wp=[{id:'agm158',cnt:4}];
  }// multi = keep auto-generated
  hideModal();S.addMode=null;
  S.ac.push(a);
  lg('✈️ '+a.name+' ('+loadout.toUpperCase()+')');
  updateUnitList();
};
function showSAMPicker(wx,wy){
  if(isOceanPosition(wx, wy)) { lg('⚠️ SAMs must be on land!'); S.addMode = null; return; }
  const allSamTypes = Object.keys(AIR_DEFENSE_DB || {});
  const categories = {long_range_sam:'Long Range',medium_range_sam:'Medium Range',short_range_sam:'Short Range',shorad:'SHORAD',abm:'ABM/Anti-Ballistic',ciws:'CIWS',laser_ciws:'Laser CIWS',mobile_abm:'Mobile ABM',rocket_artillery:'Rocket Artillery',spaag:'SPAAG',manpads:'MANPADS',coastal:'Coastal Defense',other:'Other'};
  showModal(`<h3>🚀 SAM/Air Defense</h3><div style="max-height:360px;overflow-y:auto">
    ${Object.keys(categories).map(cat=>{
      const items = allSamTypes.filter(t=>{const sp=AIR_DEFENSE_DB[t];return sp && (sp.type === cat || (!sp.type && cat === 'other'));});
      if (!items.length) return '';
      return `<div style="color:rgba(43,111,219,0.6);font-size:7px;text-transform:uppercase;margin:6px 0 3px">${categories[cat]} (${items.length})</div>
        ${items.map(t=>{const sp=AIR_DEFENSE_DB[t];const s=(sp.faction==='Iran'||sp.faction==='Russia'||sp.faction==='China')?'red':'blue';
          return `<button onclick="placeSAM('${t}','${s}',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid ${s==='blue'?'rgba(43,111,219,0.2)':'rgba(219,43,43,0.2)'};color:${s==='blue'?'#5a8cf5':'#e55a5a'};padding:2px 5px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${s==='blue'?'🔵':'🔴'} ${sp.name}</button>`;}).join('')}`;
    }).join('')}</div>
    <button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);}
window.placeSAM=function(id,side,wx,wy){if(isOceanPosition(wx,wy)){lg('⚠️ SAMs must be on land!');return;}const sp=AIR_DEFENSE_DB[id];if(!sp)return;S.sam.push(CMO.createSAMSite(sp,side,wx,wy));hideModal();S.addMode=null;lg('🚀 '+sp.name);updateUnitList();};

function tick(){
  try {
  if(!S||!S.gameStarted)return;
  S.tick++;
  // Throttle UI updates to every 5 ticks for performance
  const doUI = S.tick % 5 === 0;

  // ---- RADAR DETECTION (with per-SAM delay support) ----
  S.ac.forEach(a=>a.dt=false); S.ships.forEach(s=>s.dt=false);
  S.ac.forEach(a=>{if(!a.alive)return;
    S.ac.forEach(t=>{if(t===a||!t.alive||t.side===a.side)return;const d=Math.hypot(t.x-a.x,t.y-a.y)*W.kpp;const stealthMult=t.stealth?Math.pow(t.rcs,0.25):1;const dr=a.radarKM*stealthMult;if(d<=dr){a.dt=true;t.dt=true;}});
    S.ships.forEach(t=>{if(!t.alive||t.side===a.side)return;const d=Math.hypot(t.x-a.x,t.y-a.y)*W.kpp;if(d<=a.radarKM){a.dt=true;t.dt=true;}});
  });
  S.ships.forEach(s=>{if(!s.alive)return;S.ships.forEach(t=>{if(t===s||!t.alive||t.side===s.side)return;const d=Math.hypot(t.x-s.x,t.y-s.y)*W.kpp;if(d<=(s.radarKM||300)){s.dt=true;t.dt=true;}});});
  S.sam.forEach(s=>{if(!s.alive)return;
    // Check detection delay
    if(s.detectionDelay && s.detectionDelay > 0){
      // Track detected aircraft per SAM using a unique key
      if(!s.detectedMap) s.detectedMap = {};
      // FIX: periodically purge entries for aircraft that no longer exist or
      // are dead, so this object doesn't grow forever over a long game
      if(S.tick % 300 === 0){
        const liveIds = {}; S.ac.forEach(a=>{if(a.alive) liveIds[a.id]=1;});
        Object.keys(s.detectedMap).forEach(key=>{
          const acId = key.slice(0, key.lastIndexOf('_'));
          if(!liveIds[acId]) delete s.detectedMap[key];
        });
      }
      S.ac.forEach(a=>{
        if(!a.alive||a.side===s.side)return;
        const key = a.id + '_' + s.id;
        if(!s.detectedMap[key]) {
          s.detectedMap[key] = 1;
        } else if(s.detectedMap[key] < s.detectionDelay) {
          s.detectedMap[key]++;
        }
        if(s.detectedMap[key] >= s.detectionDelay) {
          // Now actually detect
          const stealthFactor=a.stealth?Math.pow(a.rcs,0.25):1;
          if(Math.hypot(a.x-s.x,a.y-s.y)*W.kpp<=s.rngR*stealthFactor) a.dt=true;
        }
      });
    } else {
      // Normal instant detection
      S.ac.forEach(a=>{if(!a.alive||a.side===s.side)return;
        const stealthFactor=a.stealth?Math.pow(a.rcs,0.25):1;
        if(Math.hypot(a.x-s.x,a.y-s.y)*W.kpp<=s.rngR*stealthFactor) a.dt=true;
      });
    }
  });

  // ---- RADAR DATA LINK (AWACS shares contacts with all blue side) ----
  S.ac.forEach(a=>{if(!a.alive||!a.isAwacs)return;
    S.ac.forEach(other=>{if(!other.alive||other.side!==a.side||other===a)return;const d=Math.hypot(other.x-a.x,other.y-a.y)*W.kpp;if(d<=a.radarKM*1.2)other.dt=true;});
  });

  // ---- MOVE (fuel drain: ~3 min full throttle) + IDLE CIRCLING ----
  S.ac.forEach(a=>{if(!a.alive||a.spawnDelay>0){if(a.spawnDelay)a.spawnDelay--;return;}const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d>1){const ta=Math.atan2(dy,dx)*180/Math.PI+90;let df=ta-a.h;while(df>180)df-=360;while(df<-180)df+=360;a.h+=Math.sign(df)*Math.min(Math.abs(df),2);const rad=(a.h-90)*Math.PI/180,sm=a.thr?a.thr/100:1;a.x+=Math.cos(rad)*a.spd*sm;a.y+=Math.sin(rad)*a.spd*sm;a.x=Math.max(0,Math.min(W.mapW,a.x));a.y=Math.max(0,Math.min(W.mapH,a.y));a.fu=Math.max(0,a.fu-0.006*sm);}else{// Idle: rotate 360° in place (realistic orbiting)
a.h=(a.h+0.8)%360;const rad=(a.h-90)*Math.PI/180,sm=a.thr?Math.max(0.1,(a.thr/100)*0.5):0.35;a.x+=Math.cos(rad)*a.spd*sm;a.y+=Math.sin(rad)*a.spd*sm;a.fu=Math.max(0,(a.fu||100)-0.003*sm);}let _mi=null,_md=Infinity;for(let _k=0;_k<S.mis.length;_k++){const _m=S.mis[_k];if(!_m.alive||_m.isBallistic||_m.isA2G||_m.isNaval||_m.side===a.side)continue;const _kd=Math.hypot(_m.x-a.x,_m.y-a.y)*W.kpp;if(_kd<_md){_md=_kd;_mi=_m;}}if(_mi&&_md<40){const _missileBear=Math.atan2(_mi.y-a.y,_mi.x-a.x)*180/Math.PI+90;const _bear=(_missileBear+180)%360;let _df=_bear-a.h;while(_df>180)_df-=360;while(_df<-180)_df+=360;a.h+=Math.sign(_df)*Math.min(Math.abs(_df),8)*0.6;a.evadeT=20;if(!a._wpSaved){a._wpSaved=true;a._wx=a.tx;a._wy=a.ty;}a.tx=a.x+Math.cos(_bear*Math.PI/180)*1000;a.ty=a.y+Math.sin(_bear*Math.PI/180)*1000;if(_md<6&&!_mi.ecmRolled){_mi.ecmRolled=true;const _ms=typeof MISSILE_COMBAT_STATS!=='undefined'?MISSILE_COMBAT_STATS[_mi.nm]:null;const _ecc=_ms?_ms.eccm:90;const _ecm=a.ecm||50;const _dc=Math.max(0.10,Math.min(0.85,(_ecm-_ecc)/200+0.30));if(Math.random()<_dc){_mi.alive=false;S.exp.push({x:_mi.x,y:_mi.y,l:1,ml:30,sz:9});if(S.tick%30===0)lg('⛡ ' +a.name+' defeated '+_mi.nm+' via ECM/chaff');}else if((a.cm||0)>0&&(a.flareT||0)<=0){a.cm--;const _a2=Math.random()*Math.PI*2;_mi.tx=a.x+Math.cos(_a2)*20;_mi.ty=a.y+Math.sin(_a2)*20;a.flareT=45;S.exp.push({x:a.x,y:a.y,l:1,ml:25,sz:7});if(S.tick%30===0)lg('ὒ5 ' +a.name+' deployed flares ('+Math.max(0,a.cm)+' left)');}}}if(a.evadeT>0)a.evadeT--;else if(a._wpSaved){a.tx=a._wx;a.ty=a._wy;delete a._wpSaved;}if(a.flareT>0)a.flareT--;if(a.wc>0)a.wc--});
  S.ships.forEach(s=>{if(!s.alive)return;const dx=s.tx-s.x,dy=s.ty-s.y,d=Math.hypot(dx,dy);if(d>1){const ta=Math.atan2(dy,dx)*180/Math.PI+90;let df=ta-s.h;while(df>180)df-=360;while(df<-180)df+=360;s.h+=Math.sign(df)*Math.min(Math.abs(df),1);const rad=(s.h-90)*Math.PI/180;s.x+=Math.cos(rad)*s.spd;s.y+=Math.sin(rad)*s.spd;s.x=Math.max(0,Math.min(W.mapW,s.x));s.y=Math.max(0,Math.min(W.mapH,s.y));}});

  // ---- AIR-TO-AIR (fire rate limited) ----
  try {
    S.ac.forEach(attacker => {
      if (!attacker.alive) return;
      if (!attacker.wp || !attacker.wp.length) return;
      // FIRE RATE LIMIT: one shot every 45 ticks per aircraft
      if (attacker.a2aCooldown > 0) { attacker.a2aCooldown--; return; }
      const combatRoles = ['fighter','multirole','stealth_fighter','stealth_multirole','interceptor','cas','strike'];
      if (!combatRoles.includes(attacker.role)) return;
      for (let j = 0; j < S.ac.length; j++) {
        const target = S.ac[j];
        if (target === attacker || !target.alive || target.side === attacker.side) continue;
        if (!target.dt) continue;
        const d = Math.hypot(target.x - attacker.x, target.y - attacker.y) * W.kpp;
        let bestAmmo = null, bestRange = Infinity;
        for (let wi = 0; wi < attacker.wp.length; wi++) {
          const w = attacker.wp[wi];
          if (!w || w.cnt <= 0) continue;
          if (!attacker.compatibleWeapons || !attacker.compatibleWeapons.includes(w.id)) continue;
          const wpd = WEAPONS_DB[w.id] || MISSILE_DB[w.id];
          if (!wpd) continue;
          const range = wpd.rangeKM || wpd.range || 100;
          const isA2A = wpd.type === 'air_to_air' || wpd.type === 'a2a';
          if (!isA2A) continue;
          if (d <= range && range < bestRange) { bestAmmo = w; bestRange = range; }
        }
        if (!bestAmmo && attacker.wp) {
          const fb = attacker.wp.find(w => w && w.cnt > 0 && w.id === 'aim120c');
          if (fb) bestAmmo = fb;
        }
        if (!bestAmmo) continue;
        const wpd2 = WEAPONS_DB[bestAmmo.id] || MISSILE_DB[bestAmmo.id] || {};
        const spd = CMO.missileGameSpeed(bestAmmo.id) || CMO.missileGameSpeed('aim120c');
        S.mis.push({
          id: "mis" + Date.now() + "_" + (Math.random() * 99999 | 0),
          x: attacker.x, y: attacker.y, tx: target.x, ty: target.y,
          spd, dmg: wpd2.damage || 80, nm: bestAmmo.id,
          isSAM: false, isA2A: true, isA2G: false, isNaval: false,
          isBallistic: false, side: attacker.side, tr: [], alive: true
        });
        if (bestAmmo.cnt !== undefined) bestAmmo.cnt--;
        attacker.a2aCooldown = 45; // 45 ticks between shots
        lg('🚀 ' + attacker.name + ' fires at ' + target.name);
        break;
      }
    });
  } catch(e) {}

  // ---- A2G - FIRE AT ENEMY GROUND TARGETS (fire rate limited) ----
  try {
    S.ac.forEach(ac => {
      if (!ac.alive) return;
      // FIX: non-combat aircraft (tankers, AWACS, bombers not carrying real
      // A2G weapons, transports, etc.) must never be able to fire — they
      // were previously slipping through here with a forced-on AGM-158.
      if (NON_COMBAT_ROLES.includes(ac.role)) return;
      // FIRE RATE LIMIT: share cooldown with A2A — if already cooling down, skip
      if (ac.a2gCooldown > 0) { ac.a2gCooldown--; return; }

      for (let wi = 0; wi < ac.wp.length; wi++) {
        const w = ac.wp[wi];
        if (!w || w.cnt <= 0) continue;
        const wpd = WEAPONS_DB[w.id] || MISSILE_DB[w.id];
        if (!wpd) continue;
        const isA2G = wpd.type === 'air_to_ground' || wpd.type === 'a2g' || wpd.type === 'anti_ship' || wpd.type === 'cruise';
        if (!isA2G) continue;
        const maxRng = wpd.rangeKM || wpd.range || 30;

        // Check SAMs
        for (let j = 0; j < S.sam.length; j++) {
          const sm = S.sam[j];
          if (!sm.alive || sm.side === ac.side) continue;
          if (Math.hypot(sm.x - ac.x, sm.y - ac.y) * W.kpp <= maxRng) {
            S.mis.push({
              id: "mis" + Date.now() + "_" + (Math.random() * 99999 | 0),
              x: ac.x, y: ac.y, tx: sm.x, ty: sm.y,
              spd: CMO.missileGameSpeed(w.id) || CMO.missileGameSpeed('agm158'),
              dmg: wpd.damage || 220, nm: w.id,
              isSAM: false, isA2A: false, isA2G: true, isNaval: false,
              isBallistic: false, side: ac.side, tr: [], alive: true
            });
            w.cnt--;
            ac.a2gCooldown = 60; // 60 ticks between A2G shots
            lg('🚀 ' + ac.name + ' fires ' + w.id + ' at SAM ' + sm.name);
            return; // exit forEach callback — done for this aircraft this tick
          }
        }
        // Check bases
        for (let j = 0; j < S.bases.length; j++) {
          const ba = S.bases[j];
          if (!ba.alive || ba.side === ac.side) continue;
          if (Math.hypot(ba.x - ac.x, ba.y - ac.y) * W.kpp <= maxRng) {
            S.mis.push({
              id: "mis" + Date.now() + "_" + (Math.random() * 99999 | 0),
              x: ac.x, y: ac.y, tx: ba.x, ty: ba.y,
              spd: CMO.missileGameSpeed(w.id) || CMO.missileGameSpeed('agm158'),
              dmg: wpd.damage || 220, nm: w.id,
              isSAM: false, isA2A: false, isA2G: true, isNaval: false,
              isBallistic: false, side: ac.side, tr: [], alive: true
            });
            w.cnt--;
            ac.a2gCooldown = 60;
            lg('🚀 ' + ac.name + ' fires ' + w.id + ' at base ' + ba.name);
            return;
          }
        }
        // Check BMs
        for (let j = 0; j < S.bm.length; j++) {
          const bm = S.bm[j];
          if (!bm.alive || bm.side === ac.side) continue;
          if (Math.hypot(bm.x - ac.x, bm.y - ac.y) * W.kpp <= maxRng) {
            S.mis.push({
              id: "mis" + Date.now() + "_" + (Math.random() * 99999 | 0),
              x: ac.x, y: ac.y, tx: bm.x, ty: bm.y,
              spd: CMO.missileGameSpeed(w.id) || CMO.missileGameSpeed('agm158'),
              dmg: wpd.damage || 220, nm: w.id,
              isSAM: false, isA2A: false, isA2G: true, isNaval: false,
              isBallistic: false, side: ac.side, tr: [], alive: true
            });
            w.cnt--;
            ac.a2gCooldown = 60;
            lg('🚀 ' + ac.name + ' fires ' + w.id + ' at BM ' + bm.name);
            return;
          }
        }
        // Check ships
        for (let j = 0; j < S.ships.length; j++) {
          const sh = S.ships[j];
          if (!sh.alive || sh.side === ac.side) continue;
          if (Math.hypot(sh.x - ac.x, sh.y - ac.y) * W.kpp <= maxRng) {
            S.mis.push({
              id: "mis" + Date.now() + "_" + (Math.random() * 99999 | 0),
              x: ac.x, y: ac.y, tx: sh.x, ty: sh.y,
              spd: CMO.missileGameSpeed(w.id) || CMO.missileGameSpeed('agm158'),
              dmg: wpd.damage || 220, nm: w.id,
              isSAM: false, isA2A: false, isA2G: false, isNaval: true,
              isBallistic: false, side: ac.side, tr: [], alive: true
            });
            w.cnt--;
            ac.a2gCooldown = 60;
            lg('🚀 ' + ac.name + ' fires ' + w.id + ' at ship ' + sh.name);
            return;
          }
        }
      }
    });
  } catch(e) { console.error('A2G error:', e); }

  // ---- NAVAL COMBAT ----
  S.ships.forEach(attacker=>{if(!attacker.alive)return;const asm=attacker.wp.find(w=>{if(!w||w.cnt<=0)return false;const wd=NAVAL_WEAPONS_DB[w.id]||WEAPONS_DB[w.id];return wd&&(wd.type==='anti_ship'||wd.type==='cruise');});if(!asm)return;const asmSpec=NAVAL_WEAPONS_DB[asm.id]||WEAPONS_DB[asm.id];if(!asmSpec)return;const range=asmSpec.rangeKM||100;for(let j=0;j<S.ships.length;j++){const target=S.ships[j];if(target===attacker||!target.alive||target.side===attacker.side)continue;if(!target.dt&&!attacker.dt)continue;const d=Math.hypot(target.x-attacker.x,target.y-attacker.y)*W.kpp;if(d<=range){const spd=CMO.machToPxPerTick(asmSpec.mach||0.85);S.mis.push({id:"mis"+Date.now()+"_"+(Math.random()*99999|0),x:attacker.x,y:attacker.y,tx:target.x,ty:target.y,spd,dmg:asmSpec.damage||200,nm:asm.id,isSAM:false,isA2A:false,isA2G:false,isNaval:true,isBallistic:false,side:attacker.side,tr:[],alive:true});asm.cnt--;lg('🚢 '+attacker.name+' fires '+asm.id+' at '+target.name);break;}}if(attacker.compatibleWeapons){const samWpn=attacker.wp.find(w=>{if(!w||w.cnt<=0)return false;const wd=NAVAL_WEAPONS_DB[w.id];return wd&&(wd.type==='naval_sam'||wd.type==='naval_sam');});if(samWpn){const samSpec=NAVAL_WEAPONS_DB[samWpn.id];if(samSpec){for(let j=0;j<S.ac.length;j++){const a=S.ac[j];if(!a.alive||a.side===attacker.side||!a.dt)continue;const d=Math.hypot(a.x-attacker.x,a.y-attacker.y)*W.kpp;if(d<=samSpec.rangeKM){S.mis.push({id:"mis"+Date.now()+"_"+(Math.random()*99999|0),x:attacker.x,y:attacker.y,tx:a.x,ty:a.y,spd:CMO.machToPxPerTick(samSpec.mach||3.5),dmg:samSpec.damage||85,nm:samWpn.id,isSAM:true,isA2A:false,isA2G:false,isNaval:false,isBallistic:false,side:attacker.side,tr:[],alive:true});samWpn.cnt--;break;}}}}}});

  // ---- SAM FIRE (ABM-capable SAMs can intercept ballistics) ----
  S.sam.forEach(s=>{if(!s.alive||s.reload>0||s.maxM<=0){if(s.reload>0)s.reload--;return;}let fired=false;
  const canABM = s.spec && s.spec.canInterceptBallisticMissiles;
  // Use the SAM's specified missile ID for speed, fallback to '40n6' for S-400 class
  const samMissileId = (s.spec && s.spec.missileID) || '40n6';
  for(let i=0;i<S.mis.length;i++){const m=S.mis[i];if(!m.alive||m.isSAM||m.side===s.side)continue;if(m.isBallistic && !canABM)continue;const d=Math.hypot(m.x-s.x,m.y-s.y)*W.kpp;if(d<=s.rngE){const isp=CMO.missileGameSpeed(samMissileId)*3;S.mis.push({id:"mis"+Date.now()+"_"+(Math.random()*99999|0),x:s.x,y:s.y,tx:m.x,ty:m.y,spd:isp,dmg:(s.spec&&s.spec.missileDMG)||100,nm:samMissileId,isSAM:true,intercepting:true,isBallistic:false,side:s.side,tr:[],alive:true});s.maxM--;s.reload=s.reloadMax;fired=true;break;}}if(fired)return;for(let i=0;i<S.ac.length;i++){const a=S.ac[i];if(!a.alive||a.side===s.side||!a.dt)continue;const d=Math.hypot(a.x-s.x,a.y-s.y)*W.kpp;if(d<=s.rngE){const interceptorSpd=CMO.missileGameSpeed(samMissileId);S.mis.push({id:"mis"+Date.now()+"_"+(Math.random()*99999|0),x:s.x,y:s.y,tx:a.x,ty:a.y,spd:interceptorSpd,dmg:(s.spec&&s.spec.missileDMG)||100,nm:samMissileId,isSAM:true,isBallistic:false,side:s.side,tr:[],alive:true});s.maxM--;s.reload=s.reloadMax;if(S.tick%10===0)lg('🚀 '+s.name+' engages '+a.name+' at '+Math.round(d)+'km');break;}}});

    // ---- INTERCEPTOR (homing: track closest enemy missile, kill at 15km) ----
  for(let i=S.mis.length-1;i>=0;i--){const m=S.mis[i];if(!m.alive||!m.intercepting)continue;let _bt=null,_bd=Infinity;for(let j=S.mis.length-1;j>=0;j--){const t=S.mis[j];if(t===m||!t.alive||t.isSAM||t.intercepting)continue;const _dist=Math.hypot(m.x-t.x,m.y-t.y)*W.kpp;if(_dist<_bd){_bd=_dist;_bt=t;}}if(_bt){m.tx=_bt.x;m.ty=_bt.y;if(_bd<15){_bt.alive=false;S.exp.push({x:_bt.x,y:_bt.y,l:1,ml:1,sz:8});m.alive=false;}}}

  // Missile cleanup: remove dead missiles, keep max 200
  // Use reverse loop to avoid filter() allocation on large arrays
  for(let i=S.mis.length-1;i>=0;i--){if(!S.mis[i].alive)S.mis.splice(i,1);}
  if (S.mis.length > 200) S.mis.splice(0, S.mis.length - 200);

  // ---- MOVE MISSILES + HITS ----
  for(let i=S.mis.length-1;i>=0;i--){
    const m=S.mis[i];if(!m.alive){S.mis.splice(i,1);continue;}
    const dx=m.tx-m.x,dy=m.ty-m.y,d=Math.hypot(dx,dy);
    if(d<3){m.alive=false;S.exp.push({x:m.tx,y:m.ty,l:1,ml:1,sz:10});
      if(m.isSAM){let best=null,bestD=Infinity;S.ac.forEach(a=>{if(!a.alive)return;const d=Math.hypot(a.x-m.tx,a.y-m.ty);if(d<bestD){bestD=d;best=a;}});if(best&&bestD<6){best.alive=false;lg('💥 '+best.name+' shot down!');updateUnitList();}}
      if(m.isA2A)S.ac.forEach(a=>{if(Math.hypot(a.x-m.tx,a.y-m.ty)<6){a.hp-=m.dmg;if(a.hp<=0){a.alive=false;lg('💀 '+a.name+' shot down!');updateUnitList();}}});
      if(m.isNaval)S.ships.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<8){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('💥 '+s.name+' sunk!');updateUnitList();}}});
      if(m.isA2G){
        S.sam.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<6){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('🎯 '+s.name+' destroyed!');spawnSmoke(s.x,s.y,'heavy',300);}updateUnitList();}});
        S.bases.forEach(b=>{if(!b.alive)return;if(Math.hypot(b.x-m.tx,b.y-m.ty)<8){b.hp=Math.max(0,(b.hp||350)-m.dmg);if(b.hp<=0){b.alive=false;lg('🏠 '+b.name+' destroyed!');spawnSmoke(b.x,b.y,'heavy',300);}updateUnitList();}});
      }
      if(m.isBallistic){
        S.sam.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<12){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('💥 '+s.name+' destroyed!');updateUnitList();}}});
        S.bases.forEach(b=>{if(!b.alive)return;if(Math.hypot(b.x-m.tx,b.y-m.ty)<12){b.hp=Math.max(0,(b.hp||350)-m.dmg/2);if(b.hp<=0){b.alive=false;lg('🏠 '+b.name+' destroyed by ballistic!');spawnSmoke(b.x,b.y,'heavy',300);}updateUnitList();}});
        S.ships.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<12){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('💥 '+s.name+' sunk!');updateUnitList();}}});
        lg('💥 Ballistic impact!');
      }
      S.mis.splice(i,1);continue;
    }
    const ang=Math.atan2(dy,dx);m.x+=Math.cos(ang)*m.spd;m.y+=Math.sin(ang)*m.spd;
    if(!m.tr)m.tr=[];m.tr.push({x:m.x,y:m.y});if(m.tr.length>30)m.tr.shift();
  }
  S.exp.forEach(e=>e.l-=0.016);S.exp=S.exp.filter(e=>e.l>0);

  // ---- TANKER REFUELING (fighters below 30% fuel auto-reroute to tanker) ----
  const tankers=S.ac.filter(a=>a.alive&&a.isTanker);
  tankers.forEach(tanker=>{const needy=S.ac.filter(a=>a.alive&&a.side===tanker.side&&a.fu<30&&!a.isTanker&&!a.isAwacs&&a!==tanker);needy.sort((a,b)=>a.fu-b.fu);needy.forEach(a=>{const d=Math.hypot(tanker.x-a.x,tanker.y-a.y)*W.kpp;if(d<180){a.fu=Math.min(100,a.fu+1.5);a.tx=tanker.x;a.ty=tanker.y;if(doUI&&S.tick%30===0)lg('⛽ '+a.name+' refueling ('+Math.floor(a.fu)+'%)');}});});

  // ---- AIRBASE LANDING ----
  S.bases.forEach(b=>{if(!b.alive)return;const landing=S.ac.filter(a=>a.alive&&a.side===b.side&&a.fu<15&&!a.landingAt);landing.forEach(a=>{if(Math.hypot(a.x-b.x,a.y-b.y)*W.kpp<50){a.landingAt=b.id;a.tx=b.x;a.ty=b.y;lg('🛬 '+a.name+' landing');}});S.ac.forEach(a=>{if(a.landingAt===b.id){if(Math.hypot(a.x-b.x,a.y-b.y)*W.kpp<30&&a.alive){a.fu=100;if(b.ac<b.maxAC){b.ac++;a.alive=false;if(doUI)lg('🛬 '+a.name+' parked ('+b.ac+'/'+b.maxAC+')');}else{a.alive=false;if(doUI)lg('💥 '+a.name+' crashed! Base full');}if(doUI)updateUnitList();}}});
  });

  // ---- CRASH ON EMPTY FUEL ----
  S.ac.forEach(a=>{if(a.alive&&a.fu<=0){a.alive=false;if(doUI){lg('💥 '+a.name+' ran out of fuel!');updateUnitList();}}});

  // ---- GAME OVER (only for non-blank scenarios) ----
  if(S.missionName&&S.missionName!=='blank'){
    // FIX: S.ac contains BOTH sides' aircraft. The old check used
    // S.ac.some(a=>a.alive) with no side filter, so the moment every
    // aircraft on the map (yours AND the enemy's) was either shot down or
    // simply landed, this incorrectly declared "ALL AIRCRAFT LOST /
    // MISSION FAILED" — even mid-dogfight, even on a clean mission where
    // your whole strike package safely RTB'd and parked. Now scoped to
    // BLUFOR only, and aircraft parked at a friendly base count as "still
    // have aircraft" rather than "lost".
    const blueACTotal = S.ac.filter(a=>a.side==='blue').length;
    const blueACAlive = S.ac.some(a=>a.alive&&a.side==='blue');
    const blueParked = S.bases.some(b=>b.side==='blue'&&b.ac>0);
    if(blueACTotal>0 && !blueACAlive && !blueParked){S.gameover=true;_('statusMain').textContent='💥 ALL AIRCRAFT LOST';_('statusSub').textContent='MISSION FAILED';_('statusOverlay').classList.add('show');}
    // Check mission success: all enemy SAMs, BMs, and non-friendly bases destroyed
    const enemySams=S.sam.filter(s=>s.side!=='blue').length;
    const enemySamsAlive=S.sam.filter(s=>s.side!=='blue'&&s.alive).length;
    const enemyBms=S.bm.filter(b=>b.side!=='blue').length;
    const enemyBmsAlive=S.bm.filter(b=>b.side!=='blue'&&b.alive).length;
    const enemyBases=S.bases.filter(b=>b.side!=='blue').length;
    const enemyBasesAlive=S.bases.filter(b=>b.side!=='blue'&&b.alive).length;
    if(enemySams>0&&enemySamsAlive===0&&enemyBms>0&&enemyBmsAlive===0&&enemyBases>0&&enemyBasesAlive===0){
      S.gameover=true;_('statusMain').textContent='✅ MISSION SUCCESSFUL!';_('statusSub').textContent='ALL ENEMY TARGETS DESTROYED';_('statusOverlay').classList.add('show');
      lg('🏆 MISSION COMPLETE! All OPFOR eliminated!');
    }
  }
  } catch(e) { console.error('TICK CRASH:',e); }
}

// ============ RENDER (handled by game_render.js) ============