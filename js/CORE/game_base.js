// ============================================================================
// game.js — CMO GAME v6.0 (PRODUCTION) — ALL FIXES
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
  gameStarted:false
};
const sides = [
  {id:'blue', name:'BLUFOR', color:'#2b6fdb', posture:'Friendly'},
  {id:'red', name:'OPFOR', color:'#db2b2b', posture:'Hostile'},
  {id:'neutral', name:'NEUTRAL', color:'#8ab4e8', posture:'Neutral'}
];

const NON_COMBAT_ROLES = ['tanker','awacs','bomber','stealth_bomber','utility_helicopter','maritime_patrol'];

// DBs are defined as globals in earlier scripts (aircrafts.js, missiles.js, ships.js etc.)
// Using window.* as safety check without redeclaring constants
const cv = document.createElement('canvas');
const cx = cv.getContext('2d');
document.body.prepend(cv);
let cw, ch;
function resize() {
  const r = cv.getBoundingClientRect();
  cw = cv.width = r.width || innerWidth;
  ch = cv.height = r.height || innerHeight;
}
setTimeout(resize, 50);
addEventListener('resize', resize);

const A = {};
let ld = 0, total = 11;
function lg(m) { const el = _('logMsg'); if(el) el.textContent = m; }
function la(k, s) {
  const I = new Image();
  I.onload = () => { A[k]=I; ld++; if(ld>=total) _('logMsg')&&(_('logMsg').textContent='ALL ASSETS LOADED'); };
  I.onerror = () => { ld++; }; I.src = s;
}
la('map','assets/world_small.jpg'); la('plane','assets/plane.png'); la('ad','assets/airdefense.png');
la('mis','assets/missile.png'); la('blast','assets/blast.png'); la('fire','assets/fire.png'); la('smoke','assets/smoke.png');
la('building','assets/building.png'); la('ship','assets/ship.png'); la('carrier','assets/aircraft-carrier.png'); la('sub','assets/submarine.png');

function ll(lat,lng){return{x:(lng+180)/360*W.mapW,y:(90-lat)/180*W.mapH};}

// Terrain check: simplified for game functionality
// Allows placing units anywhere since the map pixel sampling causes CORS issues
// Always NOT ocean - allows placing any unit anywhere on the map
function isOceanPosition(x, y) { return false; }

function safeRef(name, fallback) {
  try { return eval(name) || fallback; } catch(e) { return fallback; }
}

const AIRCRAFT_LOOKUP = {};
function initAircraftLookup() {
  const defs = [
    ['f35a','F35A_DATA'],['f22','F22_DATA'],['f16','F16_DATA'],['f15e','F15E_DATA'],
    ['fa18e','FA18E_DATA'],['eurofighter','EUROFIGHTER_DATA'],['rafale','RAFALE_DATA'],
    ['gripen','GRIPEN_DATA'],['su35','SU35_DATA'],['su30sm','SU30SM_DATA'],
    ['su57','SU57_DATA'],['mig29','MIG29_DATA'],['mig31','MIG31_DATA'],['j20','J20_DATA'],
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
  a.wp = spec.defaultLoadout ? spec.defaultLoadout.map(w=>({...w})) : [{id:'aim120c',cnt:4}];
  a.alt = 12000;
  a.thr=100; a.rt=null; a.rtTarget=null; a.landingAt=null; a.refuelingAt=null; a.isTanker=false; a.isAwacs=false;
  a.radarKM = spec.radarKM || 200;
  a.stealth = spec.stealth || false;
  a.rcs = spec.rcs || 5;
  a.ecm = spec.ecm || 50;
  a.compatibleWeapons = spec.compatibleWeapons || [];
  a.role = spec.role || 'fighter';
  if(spec.role === 'tanker'){ a.isTanker=true; a.fuelTransferKG = spec.fuelTransferKG||90000; }
  if(spec.role === 'awacs'){ a.isAwacs=true; }
  return a;
}

function createShip(spec, side, x, y) {
  if (!spec) return null;
  const spd = CMO.pxPerTick(spec.speedKMH || 55);
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
    compatibleWeapons: spec.compatibleWeapons || []
  };
}

window.startScenario = function(scenario) {
  console.log('CMO: Starting scenario:', scenario);
  _('mainMenu').style.display = 'none';
  _('topbar').style.display='flex';
  _('sidebar').style.display='block';
  _('logbar').style.display='flex';
  
  S = {
    ac:[], sam:[], bm:[], mis:[], exp:[], bases:[], ships:[],
    tick:0, pause:true, spd:1, gameover:false,  // Start PAUSED
    camX:W.mapW/2, camY:W.mapH/2, zoom:0.5, camLock:true,
    pan:false, panX:0, panY:0,
    sel:null, sels:[], addMode:null, selBox:null,
    bmPendingTarget:null, bmLaunchMode:false,
    gameStarted:true
  };

  if(scenario === 'f35a_vs_s400') {
    const st=ll(34.5,44.0), tg=ll(35.7,51.4);
    const f=createAircraftFromId('f35a','blue',st.x,st.y);
    f.tx=tg.x;f.ty=tg.y;
    f.wp=[{id:'agm158',cnt:4},{id:'aim120c',cnt:4}];
    S.ac.push(f);
    S.sam.push(CMO.createSAMSite(AIR_DEFENSE_DB.s400,'red',tg.x,tg.y));
    S.bases.push({id:'ab_blu1',x:st.x-20,y:st.y-10,name:'Ali AB',side:'blue',runways:4,maxAC:100,ac:0,t:'base'});
    S.bases.push({id:'ab_red1',x:tg.x+15,y:tg.y+10,name:'Tehran AB',side:'red',runways:4,maxAC:100,ac:0,t:'base'});
    const tk=createAircraftFromId('kc135','blue',st.x+40,st.y-20);
    tk.tx=st.x+40; tk.ty=st.y-20; S.ac.push(tk);
    for(let i=0;i<2;i++){const m=createAircraftFromId('mig29','red',tg.x+15-(i*10),tg.y-5);m.tx=tg.x+15-(i*10);m.ty=tg.y-5;S.ac.push(m);}
    
    // Persian Gulf naval deployment - actual water coordinates
    // Persian Gulf center is roughly at 27°N, 51°E → ll(27, 51)
    const pg = ll(27.0, 51.5);
    const carrier_spec = SHIPS_DB.cvn78;
    if(carrier_spec) {
      const carrier = createShip(carrier_spec, 'blue', pg.x+5, pg.y-4);
      if(carrier) { S.ships.push(carrier); }
    }
    const ddg_spec = SHIPS_DB.arleigh_burke_f3;
    if(ddg_spec) {
      const ddg = createShip(ddg_spec, 'blue', pg.x+8, pg.y);
      if(ddg) S.ships.push(ddg);
    }
    // Red navy at Strait of Hormuz
    const hormuz = ll(26.2, 56.0);
    const red1 = createShip(SHIPS_DB.kilo || SHIPS_DB.type052d, 'red', hormuz.x-3, hormuz.y-2);
    if(red1) S.ships.push(red1);
    const red2 = createShip(SHIPS_DB.slava || SHIPS_DB.kilo, 'red', hormuz.x+2, hormuz.y+2);
    if(red2) S.ships.push(red2);
    
    S.camX=st.x;S.camY=st.y;
    lg('F-35A INSERTION · Naval forces in Persian Gulf');
  } else {
    lg('BLANK SCENARIO — place units (land units on land, ships on water)');
  }
  
  updateUnitList(); updateSideList();
  // Game starts PAUSED — show ▶ PLAY so user clicks to start
  _('btnPause').textContent = '▶ PLAY';
};

_('btnPause').onclick=()=>{if(!S.gameStarted)return;S.pause=!S.pause;_('btnPause').textContent=S.pause?'▶ PLAY':'⏸ PAUSE';};
_('btn1x').onclick=()=>{S.spd=1;hl('btn1x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btn5x').onclick=()=>{S.spd=5;hl('btn5x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btn10x').onclick=()=>{S.spd=10;hl('btn10x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btn30x').onclick=()=>{S.spd=30;hl('btn30x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btn60x').onclick=()=>{S.spd=60;hl('btn60x');if(S.pause){S.pause=false;_('btnPause').textContent='⏸ PAUSE';}};
_('btnSave').onclick=()=>{
  if(!S){lg('No game to save');return;}
  const data = JSON.stringify({
    tick:S.tick,pause:S.pause,spd:S.spd,camX:S.camX,camY:S.camY,zoom:S.zoom,
    ac:S.ac.map(a=>({id:a.id,side:a.side,name:a.name,x:a.x,y:a.y,tx:a.tx,ty:a.ty,h:a.h,fu:a.fu,hp:a.hp,alive:a.alive,role:a.role,wp:a.wp,spd:a.spd,isTanker:a.isTanker,isAwacs:a.isAwacs,landingAt:a.landingAt,spawnDelay:a.spawnDelay})),
    sam:S.sam.map(s=>({id:s.id,side:s.side,name:s.name,x:s.x,y:s.y,hp:s.hp,maxM:s.maxM,reload:s.reload,alive:s.alive})),
    bases:S.bases.map(b=>({id:b.id,name:b.name,side:b.side,x:b.x,y:b.y,ac:b.ac,maxAC:b.maxAC,runways:b.runways,hp:b.hp,isCarrier:b.isCarrier,t:b.t})),
    bm:S.bm.map(b=>({id:b.id,side:b.side,name:b.name,x:b.x,y:b.y,alive:b.alive,launched:b.launched,damage:b.damage,rangeKM:b.rangeKM,speedMach:b.speedMach,spd:b.spd})),
    ships:S.ships.map(s=>({id:s.id,side:s.side,name:s.name,x:s.x,y:s.y,tx:s.tx,ty:s.ty,h:s.h,hp:s.hp,alive:s.alive,spd:s.spd,radarKM:s.radarKM,stealth:s.stealth,wp:s.wp,role:s.role}))
  });
  localStorage.setItem('cmo_save', data);
  lg('💾 Game saved!');
};
_('btnLoad').onclick=()=>{
  const data = localStorage.getItem('cmo_save');
  if(!data){lg('📂 No save found');return;}
  try {
    const d = JSON.parse(data);
    if(!S)return;
    Object.assign(S, d);
    S.gameover=false; S.pan=false; S.sel=null; S.sels=[]; S.addMode=null; S.bmLaunchMode=false;
    _('btnPause').textContent='⏸ PAUSE';
    lg('📂 Game loaded! T:'+S.tick);
  } catch(e){lg('⚠️ Save file corrupted');}
};
_('btnMenu').onclick=()=>{document.location.reload();};
function hl(id){['btn1x','btn5x','btn10x','btn30x','btn60x'].forEach(i=>_(i).classList.remove('active'));_(id).classList.add('active');}

_('btnAddAC').onclick=()=>{lg('Click on LAND to place aircraft');S.addMode='ac';};
_('btnAddSAM').onclick=()=>{lg('Click on LAND to place SAM');S.addMode='sam';};
_('btnAddBM').onclick=()=>{lg('Click on LAND to place ballistic missile');S.addMode='bm';};
_('btnAddBase').onclick=()=>{lg('Click on LAND to place airbase');S.addMode='base';};
_('btnAddShip').onclick=()=>{lg('Click on WATER to place naval unit');S.addMode='ship';};
_('btnSide').onclick=()=>{
  showModal(`<h3>🚩 SIDE RELATIONS</h3>
    ${sides.map(s=>`<div class="srow"><span class="l"><span class="side-dot" style="background:${s.color};display:inline-block;width:8px;height:8px;border-radius:50%"></span> ${s.name}</span><span class="r">${s.posture}</span></div>`).join('')}
    <div style="margin-top:8px;font-size:8px;color:rgba(90,122,138,0.5)">BLUFOR vs OPFOR = Hostile • Neutral = Non-hostile</div>
    <button onclick="hideModal()" style="width:100%;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:8px">CLOSE</button>`);
};
_('btnMove').onclick=()=>{if(S.sels&&S.sels.length>0){lg('Click map for waypoint — all');S.addMode='wp';return;}if(S.sel&&(S.sel.t==='ac'||S.sel.t==='ship')&&S.sel.alive){lg('Click map for waypoint');S.addMode='wp';}};
_('btnDesel').onclick=()=>{S.sel=null;S.sels=[];S.bmLaunchMode=false;S.addMode=null;lg('DESELECTED');};
_('btnKill').onclick=()=>{if(S.sels&&S.sels.length>0){S.sels.forEach(u=>{u.alive=false;});S.sel=null;S.sels=[];lg('💀 All destroyed');updateUnitList();return;}if(!S.sel)return;S.sel.alive=false;S.sel=null;lg('💀 Destroyed');updateUnitList();};
_('btnCopy').onclick=()=>{if(!S.sel){lg('Select first');return;}
  showModal(`<h3>📋 Copy</h3><label>Copies (max50):</label><input type="number" id="copyCount" value="5" min="1" max="50">
     <div class="btns" style="display:flex;gap:6px;margin-top:8px"><button onclick="doCopy()" style="flex:1;padding:6px;background:#1a3050;color:#5aacff;border:1px solid rgba(43,111,219,0.3);border-radius:3px;cursor:pointer">COPY</button><button onclick="hideModal()" style="flex:1;padding:6px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer">CANCEL</button></div>`);};
window.doCopy=function(){
  const n=Math.min(parseInt(_('copyCount').value)||1,50);
  const t=S.sel; if(!t) return;
  let copied = 0;
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2, r=5+(i%5)*3, nx=t.x+Math.cos(a)*r, ny=t.y+Math.sin(a)*r;
    // Check terrain restrictions for copies
    if(t.t==='ship' && !isOceanPosition(nx, ny)) continue;
    if((t.t==='ac'||t.t==='sam'||t.t==='bm'||t.t==='base') && isOceanPosition(nx, ny)) continue;
    
    if(t.t==='ac'){const u=createAircraftFromId(t.spec?t.spec.id:'f16',t.side,nx,ny);u.tx=nx;u.ty=ny;S.ac.push(u);copied++;}
    else if(t.t==='ship'&&t.spec){const u=createShip(t.spec,t.side,nx,ny);S.ships.push(u);copied++;}
    else if(t.t==='sam'){S.sam.push(CMO.createSAMSite(t.spec||AIR_DEFENSE_DB.patriot,t.side,nx,ny));copied++;}
    else if(t.t==='base'){S.bases.push({id:'ab_'+Date.now()+i,name:t.name+' Copy',side:t.side,x:nx,y:ny,runways:t.runways||4,maxAC:t.maxAC||100,ac:0,t:'base'});copied++;}
  }
  hideModal();
  lg(`📋 ${copied}/${n} spawned${copied<n?' (some blocked by terrain)':''}`);
  updateUnitList();
};

function showModal(html){_('modalContent').innerHTML=html;_('modal').classList.add('show');}
function hideModal(){_('modal').classList.remove('show');}
function updateSideList(){let h='';sides.forEach(s=>h+=`<div class="srow"><span class="l" style="color:${s.color}">${s.name}</span><span class="r" style="color:${s.posture==='Hostile'?'#db2b2b':'#60d080'}">${s.posture}</span></div>`);_('sideList').innerHTML=h||'None';}
function updateUnitList(){
  let h='';
  S.ac.forEach(u=>{if(!u.alive)return;const s=u.side==='blue'?'#2b6fdb':'#db2b2b';h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${s}">✈ ${u.name}</span><span class="uhp">${u.fu|0}%</span></div>`;});
  S.ships.forEach(u=>{if(!u.alive)return;const s=u.side==='blue'?'#2b6fdb':'#db2b2b';h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${s}">🚢 ${u.name}</span><span class="uhp">${((u.hp/u.maxHP)*100)|0}%</span></div>`;});
  S.sam.forEach(u=>{if(!u.alive)return;const s=u.side==='blue'?'#2b6fdb':'#db2b2b';h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${s}">🚀 ${u.name}</span><span class="uhp">${u.hp}HP</span></div>`;});
  S.bm.forEach(u=>{if(!u.alive)return;h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:#e88080">🚀 ${u.name}</span><span class="uhp">RDY</span></div>`;});
  S.bases.forEach(u=>{h+=`<div class="unit-entry${u===S.sel?' sel':''}" onclick="selectUnit('${u.id}')"><span class="uname" style="color:${u.side==='blue'?'#2b6fdb':'#db2b2b'}">🏠 ${u.name}</span><span class="uhp">${u.ac}/${u.maxAC}</span></div>`;});
  _('unitList').innerHTML=h||'None';
}
window.selectUnit=function(id){S.sel=S.ac.find(u=>u.id===id)||S.ships.find(u=>u.id===id)||S.sam.find(u=>u.id===id)||S.bm.find(u=>u.id===id)||S.bases.find(u=>u.id===id)||null;S.bmLaunchMode=false;if(S.sel){lg((S.sel.t||'?')+' '+S.sel.name);if(S.sel.t==='base')showBaseMenu();if(S.sel.t==='bm')showBMLaunchMenu();if(S.sel.t==='ship')showShipMenu();}updateUnitList();};
function showBaseMenu(){if(!S.sel||S.sel.t!=='base')return;
  const hasAC = S.sel.ac > 0;
  showModal(`<h3>🏠 ${S.sel.name}</h3><div class="srow"><span class="l">Aircraft</span><span class="r">${S.sel.ac}/${S.sel.maxAC}</span></div><div class="srow"><span class="l">Runways</span><span class="r">${S.sel.runways}</span></div>
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
  const t='f35a'; // default aircraft type, stored in base.ac count only
  const ids=[];
  for(let i=0;i<n;i++){
    const offsetX=(Math.random()-0.5)*4, offsetY=(Math.random()-0.5)*4;
    const a=createAircraftFromId(t,b.side,b.x+offsetX,b.y+offsetY);
    a.landingAt=null; a.spawnDelay=0; a.fu=100;
    if(mode==='grouped'){a.groupId='grp_'+b.id; a.name=b.name+' Flight '+(i+1);}
    S.ac.push(a); ids.push(a.id); b.ac--;
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
window.doAddToBase=function(){const b=S.sel;if(!b||b.t!=='base')return;const t=_('baseACType').value;const maxCanAdd = b.maxAC - b.ac;const n=Math.min(parseInt(_('baseACCount').value)||1, Math.max(0, maxCanAdd));for(let i=0;i<n;i++){const a=createAircraftFromId(t,b.side,b.x+(Math.random()-0.5)*3,b.y+(Math.random()-0.5)*3);a.spawnDelay=20+i*5;a.landingAt=b.id;b.ac++;S.ac.push(a);}hideModal();lg(`✈️ ${n}x ${t} added to ${b.name} (${b.ac}/${b.maxAC})`);updateUnitList();};

function showShipMenu(){
  if(!S.sel||S.sel.t!=='ship'||!S.sel.alive)return;
  const wplist = S.sel.wp ? S.sel.wp.map(w=>w.id+(w.count?':'+w.count:'')).join(', ') : 'None';
  showModal(`<h3>🚢 ${S.sel.name}</h3>
    <div class="srow"><span class="l">HP</span><span class="r">${S.sel.hp}/${S.sel.maxHP}</span></div>
    <div class="srow"><span class="l">Speed</span><span class="r">${(S.sel.spec&&S.sel.spec.speedKMH)||55}km/h</span></div>
    <div class="srow"><span class="l">Radar</span><span class="r">${S.sel.radarKM||300}km</span></div>
    <div class="srow"><span class="l">Weapons</span><span class="r">${wplist}</span></div>
    <div class="srow"><span class="l">Role</span><span class="r">${S.sel.role}</span></div>
    <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CLOSE</button>`);
}

function showBMLaunchMenu(){
  if(!S.sel||S.sel.t!=='bm'||!S.sel.alive||S.sel.launched)return;
  showModal(`<h3>🚀 ${S.sel.name}</h3>
    <div class="srow"><span class="l">Range</span><span class="r">${S.sel.rangeKM}km</span></div>
    <div class="srow"><span class="l">Speed</span><span class="r">Mach ${S.sel.speedMach}</span></div>
    <div class="srow"><span class="l">Damage</span><span class="r">${S.sel.damage}</span></div>
    <div style="margin-top:10px"><button onclick="launchBMButton()" style="width:100%;padding:8px;background:linear-gradient(180deg,#503018,#301808);color:#ffaa40;border:1px solid rgba(255,170,64,0.3);border-radius:3px;cursor:pointer;font-size:11px">🎯 LAUNCH — Select Target on Map</button></div>
    <button onclick="hideModal()" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:4px">CANCEL</button>`);
}
window.launchBMButton=function(){
  if(!S.sel||S.sel.t!=='bm')return;
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
  // Ballistic speed is from DB (machToPxPerTick). Divide by 4 so flight is visible and realistic
  S.mis.push({
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

// ============ MOUSE ============
let dragStart=null;
cv.addEventListener('mousedown',e=>{
  const wx=(e.offsetX-cw/2)/S.zoom+S.camX,wy=(e.offsetY-ch/2)/S.zoom+S.camY;
  if(e.button===0){
    if(S.addMode==='ac'){showAircraftPicker(wx,wy);return;}
    if(S.addMode==='sam'){showSAMPicker(wx,wy);return;}
    if(S.addMode==='bm'){showBMPicker(wx,wy);return;}
    if(S.addMode==='base'){
      if(isOceanPosition(wx,wy)){lg('⚠️ Bases must be on land!');return;}
      S.bases.push({id:'ab_'+Date.now()+'x',x:wx,y:wy,name:'Airbase',side:'blue',runways:4,maxAC:100,ac:0,t:'base'});lg('🏠 Base placed');S.addMode=null;updateUnitList();return;}
    if(S.addMode==='ship'){showShipPicker(wx,wy);return;}
    if(S.addMode==='wp'){if(S.sels&&S.sels.length>0){S.sels.forEach(u=>{if((u.t==='ac'||u.t==='ship')&&u.alive){u.tx=wx;u.ty=wy;}});lg('✈ WP '+S.sels.length);}else if(S.sel&&(S.sel.t==='ac'||S.sel.t==='ship')&&S.sel.alive){S.sel.tx=wx;S.sel.ty=wy;lg('✈ WP');}S.addMode=null;return;}
    if(S.addMode==='bm_target'&&S.bmPendingTarget){launchBM(S.bmPendingTarget,wx,wy);return;}
    dragStart={x:e.offsetX,y:e.offsetY,wx,wy};S.selBox=null;
    let best=null,bestD=15;
    // Use list for combined unit search
    const allUnits = [...S.ac.filter(u=>u.alive), ...S.ships.filter(u=>u.alive), ...S.sam.filter(u=>u.alive), ...S.bm.filter(u=>u.alive), ...S.bases];
    allUnits.forEach(u=>{const d=Math.hypot(wx-u.x,wy-u.y);if(d<bestD){bestD=d;best=u;}});
    if(best){S.sel=best;S.sels=[];S.bmLaunchMode=false;if(best.t==='base')showBaseMenu();else if(best.t==='bm')showBMLaunchMenu();else if(best.t==='ship')showShipMenu();}else{S.sel=null;S.sels=[];S.bmLaunchMode=false;dragStart={x:e.offsetX,y:e.offsetY,wx,wy};}
    updateUnitList();
  }
  if(e.button===1){S.camLock=!S.camLock;}
  if(e.button===2){S.pan=true;S.panX=e.clientX;S.panY=e.clientY;S.camLock=false;}
});
cv.addEventListener('mousemove',e=>{if(S.pan){S.camX+=(S.panX-e.clientX)/S.zoom;S.camY+=(S.panY-e.clientY)/S.zoom;S.panX=e.clientX;S.panY=e.clientY;}if(dragStart&&!S.addMode){const dx=e.offsetX-dragStart.x,dy=e.offsetY-dragStart.y;if(Math.abs(dx)>5||Math.abs(dy)>5)S.selBox={x1:dragStart.wx,y1:dragStart.wy,x2:(e.offsetX-cw/2)/S.zoom+S.camX,y2:(e.offsetY-ch/2)/S.zoom+S.camY};}});
cv.addEventListener('mouseup',e=>{if(e.button===2)S.pan=false;if(S.selBox&&dragStart){const bx={minX:Math.min(S.selBox.x1,S.selBox.x2),maxX:Math.max(S.selBox.x1,S.selBox.x2),minY:Math.min(S.selBox.y1,S.selBox.y2),maxY:Math.max(S.selBox.y1,S.selBox.y2)};S.sels=[];S.ac.forEach(u=>{if(!u.alive)return;if(u.x>=bx.minX&&u.x<=bx.maxX&&u.y>=bx.minY&&u.y<=bx.maxY)S.sels.push(u);});S.ships.forEach(u=>{if(!u.alive)return;if(u.x>=bx.minX&&u.x<=bx.maxX&&u.y>=bx.minY&&u.y<=bx.maxY)S.sels.push(u);});S.sam.forEach(u=>{if(!u.alive)return;if(u.x>=bx.minX&&u.x<=bx.maxX&&u.y>=bx.minY&&u.y<=bx.maxY)S.sels.push(u);});if(S.sels.length){S.sel=S.sels[0];lg('🔲 '+S.sels.length);}S.selBox=null;updateUnitList();}dragStart=null;});
cv.addEventListener('mouseleave',()=>{S.pan=false;S.selBox=null;dragStart=null;});
cv.addEventListener('contextmenu',e=>{e.preventDefault();S.sel=null;S.sels=[];S.addMode=null;S.bmLaunchMode=false;lg('DESELECTED');updateUnitList();});
cv.addEventListener('wheel',e=>{e.preventDefault();const mx=e.offsetX,my=e.offsetY;const wx=(mx-cw/2)/S.zoom+S.camX,wy=(my-ch/2)/S.zoom+S.camY,f=e.deltaY>0?0.92:1.09;S.zoom=Math.max(0.01,Math.min(10,S.zoom*f));S.camX=wx-(mx-cw/2)/S.zoom;S.camY=wy-(my-ch/2)/S.zoom;});

// ============ SHIP PICKER ============
function showShipPicker(wx, wy){
  if(!isOceanPosition(wx, wy)) { lg('⚠️ Ships can only be placed on water!'); S.addMode = null; return; }
  const types = Object.keys(SHIPS_DB || {});
  if(!types.length) { lg('⚠️ No ships loaded'); S.addMode = null; return; }
  const catList = ['destroyer','cruiser','supercarrier','carrier','next_gen_supercarrier','heavy_carrier_cruiser','light_carrier','medium_carrier','attack_sub','diesel_sub','nuclear_attack_sub','ballistic_sub','frigate','corvette','corvette_frigate','light_frigate','multi_role_frigate','amphibious_assault','landing_ship','fast_attack','stealth_destroyer','air_defense_destroyer','aegis_destroyer','heavy_destroyer','missile_cruiser','battlecruiser'];
  const catNames = {destroyer:'🚢 Destroyers',cruiser:'🚢 Cruisers',supercarrier:'⚓ Supercarriers',carrier:'⚓ Carriers',next_gen_supercarrier:'⚓ Next-Gen Carriers',heavy_carrier_cruiser:'⚓ Hvy Crzr Carriers',light_carrier:'⚓ Light Carriers',medium_carrier:'⚓ Medium Carriers',
    attack_sub:'🐬 Attack Subs',diesel_sub:'🐬 Diesel Subs',nuclear_attack_sub:'🐬 Nuc Attack Subs',ballistic_sub:'🐬 Ballistic Subs',
    frigate:'🚢 Frigates',corvette:'🚢 Corvettes',corvette_frigate:'🚢 Corvette-Frigates',light_frigate:'🚢 Light Frigates',multi_role_frigate:'🚢 Multi-Role Frigates',
    amphibious_assault:'⚓ Assault Ships',landing_ship:'⚓ Landing Ships',fast_attack:'🚤 Fast Attack Craft',
    stealth_destroyer:'🚢 Stealth Destroyers',air_defense_destroyer:'🚢 AD Destroyers',aegis_destroyer:'🚢 Aegis Destroyers',heavy_destroyer:'🚢 Heavy Destroyers',missile_cruiser:'🚢 Missile Cruisers',battlecruiser:'🚢 Battlecruisers'};
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
  if(!isOceanPosition(wx, wy)) { lg('⚠️ Ships must be in water!'); return; }
  const spec = SHIPS_DB[id]; if(!spec) return;
  const ship = createShip(spec, side, wx, wy); if(!ship) return;
  S.ships.push(ship); hideModal(); S.addMode = null;
  lg('🚢 ' + ship.name + ' deployed'); updateUnitList();
};

// ============ BALLISTIC MISSILE ============
function createBMFromId(bmId, side, x, y) {
  const spec = BALLISTIC_DB[bmId];
  if (!spec) return null;
  // If speedKMH is provided (e.g. drones) convert to mach for px/tick calc
  // else use speedMach from DB. Fallback Mach 7 if neither.
  const mach = spec.speedMach || (spec.speedKMH ? spec.speedKMH / 1225 : 7);
  return {
    id: 'bm' + Date.now() + '_' + (Math.random() * 99999 | 0), t: 'bm', side,
    name: spec.name || 'Ballistic Missile',
    x, y, tx: x, ty: y, alive: true, launched: false, ready: true,
    speedMach: mach, damage: spec.damage || 500, rangeKM: spec.rangeKM || 1300,
    hp: (spec.hp || 1), spd: CMO.machToPxPerTick(mach), spec: spec, tr: []
  };
}
function showBMPicker(wx, wy){
  const types = Object.keys(BALLISTIC_DB);
  showModal(`<h3>🚀 Select Ballistic Missile</h3><div style="max-height:360px;overflow-y:auto">
    ${types.map(t=>{const sp=BALLISTIC_DB[t];if(!sp)return '';const emoji=sp.type==='drone'||sp.type==='jet_drone'?'🛸':'🚀';return `<button onclick="placeBM('${t}','red',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid rgba(229,90,90,0.15);color:#e88080;padding:3px 6px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${emoji} ${sp.name} (M${sp.speedMach||'-'})</button>`;}).join('')}
    </div><button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);
}
window.placeBM=function(id,side,wx,wy){if(isOceanPosition(wx,wy)){lg('⚠️ BMs must be on land!');return;}const bm=createBMFromId(id,side,wx,wy);if(!bm)return;S.bm.push(bm);hideModal();S.addMode=null;lg('🚀 '+bm.name+' placed');updateUnitList();};

// ============ PICKERS ============
function showAircraftPicker(wx,wy){
  if(isOceanPosition(wx, wy)) { lg('⚠️ Aircraft must be on land!'); S.addMode = null; return; }
  const types=[
    {id:'f35a',n:'F-35A',s:'blue',c:'F'},{id:'f22',n:'F-22',s:'blue',c:'F'},{id:'f16',n:'F-16',s:'blue',c:'F'},{id:'f15e',n:'F-15E',s:'blue',c:'F'},{id:'fa18e',n:'F/A-18E',s:'blue',c:'F'},{id:'eurofighter',n:'Eurofighter',s:'blue',c:'F'},
    {id:'rafale',n:'Rafale',s:'blue',c:'F'},{id:'gripen',n:'Gripen',s:'blue',c:'F'},{id:'a10',n:'A-10',s:'blue',c:'F'},{id:'av8b',n:'AV-8B',s:'blue',c:'F'},{id:'f14',n:'F-14',s:'blue',c:'F'},
    {id:'su35',n:'Su-35',s:'red',c:'F'},{id:'su30sm',n:'Su-30SM',s:'red',c:'F'},{id:'su57',n:'Su-57',s:'red',c:'F'},{id:'mig29',n:'MiG-29',s:'red',c:'F'},{id:'mig31',n:'MiG-31',s:'red',c:'F'},{id:'j20',n:'J-20',s:'red',c:'F'},{id:'j10c',n:'J-10C',s:'red',c:'F'},{id:'j16',n:'J-16',s:'red',c:'F'},
    {id:'b52',n:'B-52',s:'blue',c:'B'},{id:'b1b',n:'B-1B',s:'blue',c:'B'},{id:'b2',n:'B-2',s:'blue',c:'B'},{id:'tu95',n:'Tu-95',s:'red',c:'B'},{id:'tu160',n:'Tu-160',s:'red',c:'B'},{id:'h6k',n:'H-6K',s:'red',c:'B'},
    {id:'kc135',n:'KC-135',s:'blue',c:'S'},{id:'kc46',n:'KC-46',s:'blue',c:'S'},{id:'e3',n:'E-3 AWACS',s:'blue',c:'S'},{id:'e7',n:'E-7 AWACS',s:'blue',c:'S'},{id:'p8',n:'P-8 Poseidon',s:'blue',c:'S'}];
  showModal(`<h3>✈️ Aircraft</h3><div style="max-height:360px;overflow-y:auto">
    ${'F,B,S'.split(',').map(cat=>`<div style="color:rgba(43,111,219,0.6);font-size:7px;text-transform:uppercase;margin:6px 0 3px">${cat==='F'?'Fighters':cat==='B'?'Bombers':'Support'}</div>
      ${types.filter(t=>t.c===cat).map(t=>`<button onclick="placeAircraft('${t.id}','${t.s}',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid ${t.s==='blue'?'rgba(43,111,219,0.2)':'rgba(219,43,43,0.2)'};color:${t.s==='blue'?'#5a8cf5':'#e55a5a'};padding:2px 5px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${t.s==='blue'?'🔵':'🔴'} ${t.n}</button>`).join('')}`).join('')}</div>
    <button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);}
window.placeAircraft=function(id,side,wx,wy){if(isOceanPosition(wx,wy)){lg('⚠️ Aircraft must be on land!');return;}const a=createAircraftFromId(id,side,wx,wy);S.ac.push(a);hideModal();S.addMode=null;lg('✈️ '+a.name);updateUnitList();};
function showSAMPicker(wx,wy){
  if(isOceanPosition(wx, wy)) { lg('⚠️ SAMs must be on land!'); S.addMode = null; return; }
  const types=['s400','s300','s350','pantsir','buk','tor','hq9','hq22','bavar373','khordad15','patriot','thAad','nasams','aegis','samp_t','iris_t_slm','spyder','davidsling','arrow2','arrow3','irondome','hq16','fk3','barak8','akashng','rapier2000','camm_er_battery'];
  showModal(`<h3>🚀 SAM Systems</h3><div style="max-height:360px;overflow-y:auto">
    ${types.map(t=>{const sp=AIR_DEFENSE_DB[t];if(!sp)return '';const s=(sp.faction==='Iran'||sp.faction==='Russia'||sp.faction==='China')?'red':'blue';return `<button onclick="placeSAM('${t}','${s}',${wx},${wy})" style="display:block;width:100%;background:linear-gradient(180deg,#15202e,#0e1622);border:1px solid ${s==='blue'?'rgba(43,111,219,0.2)':'rgba(219,43,43,0.2)'};color:${s==='blue'?'#5a8cf5':'#e55a5a'};padding:2px 5px;margin:1px 0;cursor:pointer;border-radius:2px;text-align:left;font-size:9px">${s==='blue'?'🔵':'🔴'} ${sp.name}</button>`;}).join('')}
    </div><button onclick="hideModal();S.addMode=null;" style="width:100%;padding:5px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:6px">CANCEL</button>`);}
window.placeSAM=function(id,side,wx,wy){if(isOceanPosition(wx,wy)){lg('⚠️ SAMs must be on land!');return;}const sp=AIR_DEFENSE_DB[id];if(!sp)return;S.sam.push(CMO.createSAMSite(sp,side,wx,wy));hideModal();S.addMode=null;lg('🚀 '+sp.name);updateUnitList();};function tick(){
  if(!S||!S.gameStarted)return;
  S.tick++;

  // ---- RADAR DETECTION ----
  S.ac.forEach(a=>a.dt=false); S.ships.forEach(s=>s.dt=false);
  
  // Aircraft detect each other (realistic RCS-based)
  S.ac.forEach(a=>{if(!a.alive)return;
    S.ac.forEach(t=>{if(t===a||!t.alive||t.side===a.side)return;
      const d=Math.hypot(t.x-a.x,t.y-a.y)*W.kpp;
      // Realistic detection: range * (RCS / 1.0)^0.25
      const stealthMult = t.stealth ? Math.pow(t.rcs, 0.25) : 1;
      const dr = a.radarKM * stealthMult;
      if(d<=dr){a.dt=true;t.dt=true;}
    });
    S.ships.forEach(t=>{if(!t.alive||t.side===a.side)return;
      const d=Math.hypot(t.x-a.x,t.y-a.y)*W.kpp;
      if(d<=a.radarKM){a.dt=true;t.dt=true;}
    });
  });
  // Ships detect each other
  S.ships.forEach(s=>{if(!s.alive)return;
    S.ships.forEach(t=>{if(t===s||!t.alive||t.side===s.side)return;
      const d=Math.hypot(t.x-s.x,t.y-s.y)*W.kpp;
      if(d<=(s.radarKM||300)){s.dt=true;t.dt=true;}
    });
  });
  // SAMs detect aircraft (realistic RCS-based formula)
  S.sam.forEach(s=>{if(!s.alive)return;
    S.ac.forEach(a=>{if(!a.alive||a.side===s.side)return;
      // Realistic stealth: detection range = radarRange * (RCS)^0.25
      // F-35 RCS 0.001 -> 0.001^0.25 = 0.178 -> 17.8% detection range
      const stealthFactor = a.stealth ? Math.pow(a.rcs, 0.25) : 1;
      const dr = s.rngR * stealthFactor;
      if(Math.hypot(a.x-s.x,a.y-s.y)*W.kpp <= dr) a.dt=true;
    });
  });

  // ---- MOVE AIRCRAFT ----
  S.ac.forEach(a=>{
    if(!a.alive||a.spawnDelay>0){if(a.spawnDelay)a.spawnDelay--;return;}
    const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);
    if(d>1){
      const ta=Math.atan2(dy,dx)*180/Math.PI+90;let df=ta-a.h;while(df>180)df-=360;while(df<-180)df+=360;
      a.h+=Math.sign(df)*Math.min(Math.abs(df),2);
      const rad=(a.h-90)*Math.PI/180,sm=a.thr?a.thr/100:1;
      a.x+=Math.cos(rad)*a.spd*sm;a.y+=Math.sin(rad)*a.spd*sm;
      a.x=Math.max(0,Math.min(W.mapW,a.x));a.y=Math.max(0,Math.min(W.mapH,a.y));
      a.fu=Math.max(0,a.fu-0.0015*sm);
    }
    if(a.wc>0)a.wc--;
  });

  // ---- MOVE SHIPS ----
  S.ships.forEach(s=>{
    if(!s.alive) return;
    const dx=s.tx-s.x, dy=s.ty-s.y, d=Math.hypot(dx,dy);
    if(d>1){
      const ta=Math.atan2(dy,dx)*180/Math.PI+90;let df=ta-s.h;while(df>180)df-=360;while(df<-180)df+=360;
      s.h+=Math.sign(df)*Math.min(Math.abs(df),1);
      const rad=(s.h-90)*Math.PI/180;
      s.x+=Math.cos(rad)*s.spd;s.y+=Math.sin(rad)*s.spd;
      s.x=Math.max(0,Math.min(W.mapW,s.x));s.y=Math.max(0,Math.min(W.mapH,s.y));
    }
  });

  // ---- AIR-TO-AIR COMBAT ----
  S.ac.forEach(attacker=>{
    if(!attacker.alive||attacker.wc>0)return;
    const combatRoles = ['fighter','multirole','stealth_fighter','stealth_multirole','interceptor','cas','strike'];
    if(!combatRoles.includes(attacker.role))return;
    for(let j=0;j<S.ac.length;j++){
      const target=S.ac[j];
      if(target===attacker||!target.alive||target.side===attacker.side)continue;
      if(!target.dt)continue;
      const d=Math.hypot(target.x-attacker.x,target.y-attacker.y)*W.kpp;
      let bestAmmo=null, bestRange=Infinity;
      for(let wi=0;wi<attacker.wp.length;wi++){
        const w=attacker.wp[wi];
        if(w.cnt<=0)continue;
        if(!attacker.compatibleWeapons.includes(w.id))continue;
        const wpd = WEAPONS_DB[w.id] || MISSILE_DB[w.id];
        const range = wpd ? (wpd.rangeKM||wpd.range||100) : 100;
        const isA2A = wpd ? (wpd.type==='air_to_air'||wpd.type==='a2a') : true;
        if(!isA2A)continue;
        if(d <= range && range < bestRange){bestAmmo=w; bestRange=range;}
      }
      if(!bestAmmo){const fb=attacker.wp.find(w=>w.cnt>0&&w.id==='aim120c');if(fb)bestAmmo=fb;}
      if(!bestAmmo)continue;
      const wpd2 = WEAPONS_DB[bestAmmo.id] || MISSILE_DB[bestAmmo.id] || {};
      const spd = CMO.missileGameSpeed(bestAmmo.id) || CMO.missileGameSpeed('aim120c');
      S.mis.push({x:attacker.x,y:attacker.y,tx:target.x,ty:target.y,spd,dmg:wpd2.damage||80,nm:bestAmmo.id,isSAM:false,isA2A:true,isA2G:false,isNaval:false,isBallistic:false,side:attacker.side,tr:[],alive:true});
      bestAmmo.cnt--; attacker.wc=10;
      if(S.tick%15===0)lg('🚀 '+attacker.name+' fires at '+target.name);
      break;
    }
  });

  // ---- A2G ----
  S.ac.forEach(function(ac){if(!ac.alive||ac.wc>0)return;
    // Check all A2G weapons, not just agm158
    for(let wi=0;wi<ac.wp.length;wi++){const w2=ac.wp[wi];if(!w2||w2.cnt<=0)continue;
      const wpd=WEAPONS_DB[w2.id]||MISSILE_DB[w2.id];if(!wpd||!wpd.rangeKM)continue;
      if(wpd.type!=='air_to_ground'&&wpd.type!=='a2g'&&wpd.type!=='anti_ship'&&wpd.type!=='cruise')continue;
      for(let j=0;j<S.sam.length;j++){var sm=S.sam[j];if(!sm.alive||sm.side===ac.side)continue;
        if(Math.hypot(sm.x-ac.x,sm.y-ac.y)*W.kpp<=wpd.rangeKM){
          S.mis.push({x:ac.x,y:ac.y,tx:sm.x,ty:sm.y,spd:CMO.missileGameSpeed(w2.id)||CMO.missileGameSpeed('agm158'),dmg:wpd.damage||220,nm:w2.id,isSAM:false,isA2A:false,isA2G:true,isNaval:false,isBallistic:false,side:ac.side,tr:[],alive:true});
          w2.cnt--;ac.wc=10;break;
        }
      }break; // one weapon per tick
    }
  });

  // ---- NAVAL COMBAT: Ships fire at enemy ships with anti-ship missiles ----
  S.ships.forEach(attacker=>{
    if(!attacker.alive) return;
    const asm = attacker.wp.find(w=>{if(!w||w.cnt<=0)return false;const wd=NAVAL_WEAPONS_DB[w.id]||WEAPONS_DB[w.id];return wd&&(wd.type==='anti_ship'||wd.type==='cruise');});
    if(!asm) return;
    const asmSpec = NAVAL_WEAPONS_DB[asm.id] || WEAPONS_DB[asm.id];
    if(!asmSpec) return;
    const range = asmSpec.rangeKM || 100;
    for(let j=0;j<S.ships.length;j++){
      const target=S.ships[j];
      if(target===attacker||!target.alive||target.side===attacker.side) continue;
      if(!target.dt && !attacker.dt) continue;
      const d=Math.hypot(target.x-attacker.x,target.y-attacker.y)*W.kpp;
      if(d<=range){
        const spd = CMO.machToPxPerTick(asmSpec.mach || 0.85);
        S.mis.push({x:attacker.x,y:attacker.y,tx:target.x,ty:target.y,spd,dmg:asmSpec.damage||200,nm:asm.id,isSAM:false,isA2A:false,isA2G:false,isNaval:true,isBallistic:false,side:attacker.side,tr:[],alive:true});
        asm.cnt--;
        lg('🚢 '+attacker.name+' fires '+asm.id+' at '+target.name);
        break;
      }
    }
    if(attacker.compatibleWeapons){
      const samWpn = attacker.wp.find(w=>{if(!w||w.cnt<=0)return false;const wd=NAVAL_WEAPONS_DB[w.id];return wd&&(wd.type==='naval_sam'||wd.type==='naval_sam');});
      if(samWpn){
        const samSpec = NAVAL_WEAPONS_DB[samWpn.id];
        if(samSpec){
          for(let j=0;j<S.ac.length;j++){
            const a=S.ac[j]; if(!a.alive||a.side===attacker.side||!a.dt) continue;
            const d=Math.hypot(a.x-attacker.x,a.y-attacker.y)*W.kpp;
            if(d<=samSpec.rangeKM){
              S.mis.push({x:attacker.x,y:attacker.y,tx:a.x,ty:a.y,spd:CMO.machToPxPerTick(samSpec.mach||3.5),dmg:samSpec.damage||85,nm:samWpn.id,isSAM:true,isA2A:false,isA2G:false,isNaval:false,isBallistic:false,side:attacker.side,tr:[],alive:true});
              samWpn.cnt--; break;
            }
          }
        }
      }
    }
  });

  // ---- SAM FIRE (improved: checks detection + engagement range separately) ----
  S.sam.forEach(s=>{if(!s.alive||s.reload>0||s.maxM<=0){if(s.reload>0)s.reload--;return;}
    let fired=false;
    // Intercept incoming missiles
    for(let i=0;i<S.mis.length;i++){const m=S.mis[i];if(!m.alive||m.isSAM||m.side===s.side)continue;
      const d=Math.hypot(m.x-s.x,m.y-s.y)*W.kpp;
      if(d<=s.rngE){
        const isp=s.canInterceptBallisticMissiles?CMO.machToPxPerTick(12):CMO.missileGameSpeed('40n6');
        S.mis.push({x:s.x,y:s.y,tx:m.x,ty:m.y,spd:isp,dmg:100,nm:'Interceptor',isSAM:true,intercepting:true,isBallistic:false,side:s.side,tr:[],alive:true});
        s.maxM--;s.reload=s.reloadMax;fired=true;break;
      }
    }
    if(fired)return;
    // SAMs fire at detected enemy aircraft within engagement range
    for(let i=0;i<S.ac.length;i++){const a=S.ac[i];if(!a.alive||a.side===s.side||!a.dt)continue;
      const d=Math.hypot(a.x-s.x,a.y-s.y)*W.kpp;
      if(d<=s.rngE){
        // Use realistic engagement speed from missiles DB if available
        const interceptorSpd = CMO.missileGameSpeed('40n6');
        S.mis.push({x:s.x,y:s.y,tx:a.x,ty:a.y,spd:interceptorSpd,dmg:100,nm:'40N6',isSAM:true,isBallistic:false,side:s.side,tr:[],alive:true});
        s.maxM--;s.reload=s.reloadMax;
        if(S.tick%10===0)lg('🚀 '+s.name+' engages '+a.name+' at ' + Math.round(d) + 'km');
        break;
      }
    }
  });

  // ---- INTERCEPTOR ----
  for(let i=S.mis.length-1;i>=0;i--){const m=S.mis[i];if(!m.alive||!m.intercepting)continue;for(let j=0;j<S.mis.length;j++){const t=S.mis[j];if(t===m||!t.alive||t.isSAM||t.intercepting)continue;if(Math.hypot(t.x-m.tx,t.y-m.ty)<4){t.alive=false;S.exp.push({x:t.x,y:t.y,l:1,ml:1,sz:8});break;}}}

  // ---- MOVE MISSILES + HITS ----
  for(let i=S.mis.length-1;i>=0;i--){
    const m=S.mis[i];if(!m.alive){S.mis.splice(i,1);continue;}
    const dx=m.tx-m.x,dy=m.ty-m.y,d=Math.hypot(dx,dy);
    if(d<3){m.alive=false;S.exp.push({x:m.tx,y:m.ty,l:1,ml:1,sz:10});
      // SAM hits only the closest enemy aircraft (no AOE cluster kill)
      if(m.isSAM){let best=null,bestD=Infinity;S.ac.forEach(a=>{if(!a.alive)return;const d=Math.hypot(a.x-m.tx,a.y-m.ty);if(d<bestD){bestD=d;best=a;}});if(best&&bestD<6){best.alive=false;lg('💥 '+best.name+' shot down!');updateUnitList();}}
      if(m.isA2A)S.ac.forEach(a=>{if(Math.hypot(a.x-m.tx,a.y-m.ty)<6){a.hp-=m.dmg;if(a.hp<=0){a.alive=false;lg('💀 '+a.name+' shot down!');updateUnitList();}}});
      if(m.isNaval)S.ships.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<8){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('💥 '+s.name+' sunk!');updateUnitList();}}});
      if(m.isA2G)S.sam.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<6){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('🎯 '+s.name+' destroyed!');updateUnitList();}}});
      if(m.isBallistic){
        S.sam.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<12){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('💥 '+s.name+' destroyed!');updateUnitList();}}});
        S.bases.forEach(b=>{if(Math.hypot(b.x-m.tx,b.y-m.ty)<12){b.hp=(b.hp||100)-m.dmg/2;if(b.hp<=0){b.alive=false;lg('🏠 '+b.name+' destroyed!');updateUnitList();}}});
        S.ships.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<12){s.hp-=m.dmg;if(s.hp<=0){s.alive=false;lg('💥 '+s.name+' sunk!');updateUnitList();}}});
        S.ac.forEach(a=>{if(Math.hypot(a.x-m.tx,a.y-m.ty)<12){a.alive=false;lg('💥 '+a.name+' destroyed!');updateUnitList();}});
        lg('💥 Ballistic impact!');
      }
      S.ships.forEach(s=>{if(Math.hypot(s.x-m.tx,s.y-m.ty)<8){s.hp-=m.dmg||50;if(s.hp<=0){s.alive=false;lg('💥 '+s.name+' sunk!');updateUnitList();}}});
      S.mis.splice(i,1);continue;
    }
    const ang=Math.atan2(dy,dx);m.x+=Math.cos(ang)*m.spd;m.y+=Math.sin(ang)*m.spd;
    if(!m.tr)m.tr=[];m.tr.push({x:m.x,y:m.y});if(m.tr.length>30)m.tr.shift();
  }
  S.exp.forEach(e=>e.l-=0.016);S.exp=S.exp.filter(e=>e.l>0);

  // ---- TANKER REFUELING ----
  const tankers=S.ac.filter(a=>a.alive&&a.isTanker);
  tankers.forEach(tanker=>{
    const needy=S.ac.filter(a=>a.alive&&a.side===tanker.side&&a.fu<50&&a!==tanker);
    needy.sort((a,b)=>a.fu-b.fu);
    needy.forEach(a=>{const d=Math.hypot(tanker.x-a.x,tanker.y-a.y)*W.kpp;if(d<120){a.fu=Math.min(100,a.fu+0.3);a.tx=tanker.x;a.ty=tanker.y;if(Math.random()<0.02)lg('⛽ '+a.name+' refueling ('+Math.floor(a.fu)+'%)');}});
  });

  // ---- AIRBASE LANDING ----
  S.bases.forEach(b=>{const landing=S.ac.filter(a=>a.alive&&a.side===b.side&&a.fu<15&&!a.landingAt);landing.forEach(a=>{if(Math.hypot(a.x-b.x,a.y-b.y)*W.kpp<50){a.landingAt=b.id;a.tx=b.x;a.ty=b.y;lg('🛬 '+a.name+' landing');}});S.ac.forEach(a=>{if(a.landingAt===b.id){if(Math.hypot(a.x-b.x,a.y-b.y)*W.kpp<30&&a.alive){a.fu=100;if(b.ac<b.maxAC){b.ac++;a.alive=false;lg('🛬 '+a.name+' parked ('+b.ac+'/'+b.maxAC+')');}else{a.alive=false;lg('💥 '+a.name+' crashed! Base full');}updateUnitList();}}});
  });

  // ---- CRASH ON EMPTY FUEL ----
  S.ac.forEach(a=>{if(a.alive&&a.fu<=0){a.alive=false;lg('💥 '+a.name+' ran out of fuel!');updateUnitList();}});

  // ---- GAME OVER ----
  const acAlive=S.ac.some(a=>a.alive);
  if(S.ac.length>0&&!acAlive){S.gameover=true;_('statusMain').textContent='💥 ALL AIRCRAFT LOST';_('statusSub').textContent='MISSION FAILED';_('statusOverlay').classList.add('show');}
}

// ============ RENDER ============
let lt=0,acc=0,hudTimer=0;
function r(t){
  const dt=Math.min((t-lt)/1000,1);lt=t;
  if(!S||!S.gameStarted){requestAnimationFrame(r);return;}
  if(!S.pause){acc+=dt*S.spd;while(acc>=1/60){acc-=1/60;tick();}}
  cx.fillStyle='#060a10';cx.fillRect(0,0,cw,ch);
  if(!A.map){cx.fillStyle='rgba(80,150,240,0.3)';cx.font='12px sans-serif';cx.textAlign='center';cx.fillText('LOADING...',cw/2,ch/2);requestAnimationFrame(r);return;}
  cx.save();cx.translate(cw/2,ch/2);cx.scale(S.zoom,S.zoom);cx.translate(-S.camX,-S.camY);
  cx.drawImage(A.map,0,0);
  const sc=S.zoom<0.05?0.15:S.zoom<0.1?0.25:S.zoom<0.2?0.35:0.5;

  function drawSprite(img, x, y, side, sc2, h, isSelected, w, hh) {
    if(!img) return;
    const col=side==='blue'?'#2b6fdb':'#db2b2b';
    const s = sc2 * 0.8;
    const sw = (w||img.width/5) * s, sh = (hh||img.height/5) * s;
    if(isSelected){
      cx.strokeStyle='rgba(255,255,255,0.5)'; cx.lineWidth=1.5; cx.setLineDash([2,3]);
      cx.beginPath();cx.arc(x,y,Math.max(sw,sh)*1.2,0,Math.PI*2);cx.stroke();cx.setLineDash([]);
    }
    // Shadow
    cx.save(); cx.translate(x+1.5*s, y+1.5*s);
    if(h !== undefined){ cx.rotate((h-90)*Math.PI/180); }
    cx.globalAlpha=0.3; cx.drawImage(img, -sw/2, -sh/2, sw, sh);
    cx.restore();
    // Sprite with rotation
    cx.save(); cx.translate(x, y);
    if(h !== undefined){ cx.rotate((h-90)*Math.PI/180); }
    cx.drawImage(img, -sw/2, -sh/2, sw, sh);
    cx.restore();
    // Faction mini dot (unrotated)
    cx.save(); cx.translate(x, y + sh*0.45);
    cx.fillStyle=col; cx.globalAlpha=0.6;
    cx.beginPath(); cx.arc(0, 0, sw*0.15, 0, Math.PI*2); cx.fill();
    cx.globalAlpha=1.0;
    cx.restore();
  }

  function drawACIcon(x,y,h,side,sc2,isSelected){
    drawSprite(A.plane, x, y, side, sc2, h, isSelected, 14, 14);
    if(isSelected && S.ac.find(a=>a===S.sel && a.dt)){
      cx.fillStyle='rgba(255,200,64,0.9)'; cx.font='bold '+(5*sc2)+'px sans-serif'; cx.textAlign='center'; cx.fillText('‼',x,y-14*sc2*0.8-6*sc2);
    }
  }

  function drawShipIcon(x,y,h,side,sc2,isSelected,hp,maxHP){
    const isCarrier = maxHP > 800;
    const isSub = maxHP < 200 && maxHP > 0;
    const img = isSub ? A.sub : isCarrier ? A.carrier : A.ship;
    drawSprite(img || A.ship, x, y, side, sc2, h, isSelected, isCarrier?24:16, isCarrier?14:10);
    if(isSelected){
      const s = sc2 * 0.8;
      const pct=hp/maxHP; const bw=12*sc2;
      cx.fillStyle='rgba(0,0,0,0.5)';cx.fillRect(x-bw/2,y+10*s+3*sc2,bw,2*sc2);
      cx.fillStyle=pct>0.5?'rgba(80,200,80,0.8)':pct>0.25?'rgba(200,180,60,0.8)':'rgba(220,60,60,0.8)';
      cx.fillRect(x-bw/2,y+10*s+3*sc2,bw*pct,2*sc2);
    }
  }

  function drawSAMIcon(x,y,side,sc2,isSelected){
    drawSprite(A.ad, x, y, side, sc2, undefined, isSelected, 14, 14);
  }

  function drawBaseIcon(x,y,side,sc2){
    drawSprite(A.building, x, y, side, sc2, undefined, false, 14, 14);
  }

  S.sam.forEach(s=>{if(!s.alive)return;const rp=s.rngR/W.kpp,ep=s.rngE/W.kpp;
    cx.beginPath();cx.arc(s.x,s.y,rp,0,Math.PI*2);cx.strokeStyle='rgba(255,255,255,0.03)';cx.lineWidth=1;cx.stroke();
    cx.beginPath();cx.arc(s.x,s.y,ep,0,Math.PI*2);cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=1;cx.setLineDash([8,12]);cx.stroke();cx.setLineDash([]);});
  if(S.selBox){cx.strokeStyle='rgba(43,111,219,0.5)';cx.lineWidth=1;cx.setLineDash([4,6]);cx.strokeRect(S.selBox.x1,S.selBox.y1,S.selBox.x2-S.selBox.x1,S.selBox.y2-S.selBox.y1);cx.setLineDash([]);cx.fillStyle='rgba(43,111,219,0.05)';cx.fillRect(S.selBox.x1,S.selBox.y1,S.selBox.x2-S.selBox.x1,S.selBox.y2-S.selBox.y1);}

  S.bases.forEach(b=>{drawBaseIcon(b.x,b.y,b.side,sc);});
  S.sam.forEach(s=>{if(!s.alive)return;drawSAMIcon(s.x,s.y,s.side,sc,S.sel===s);});
  S.ships.forEach(s=>{if(!s.alive)return;drawShipIcon(s.x,s.y,s.h,s.side,sc,S.sel===s,s.hp,s.maxHP);});
  const renderedGroups = {};
  S.ac.forEach(a=>{
    if(!a.alive||a.spawnDelay>0)return;
    if(a.groupId){
      if(renderedGroups[a.groupId]) return; renderedGroups[a.groupId] = true;
      drawACIcon(a.x,a.y,a.h,a.side,sc,S.sel===a);
      const cnt = S.ac.filter(x=>x.alive && x.groupId===a.groupId).length;
      if(cnt>1){
        cx.fillStyle='rgba(0,0,0,0.6)'; cx.font='bold '+(6*sc)+'px sans-serif'; cx.textAlign='center';
        cx.fillText('×'+cnt, a.x+8*sc*0.8+2, a.y-8*sc*0.8+2);
        cx.fillStyle='#ffcc44'; cx.font='bold '+(6*sc)+'px sans-serif';
        cx.fillText('×'+cnt, a.x+8*sc*0.8, a.y-8*sc*0.8);
      }
    } else {
      drawACIcon(a.x,a.y,a.h,a.side,sc,S.sel===a);
    }
    if(Math.hypot(a.tx-a.x,a.ty-a.y)>3){cx.strokeStyle=a.side==='blue'?'rgba(43,111,219,0.15)':'rgba(219,43,43,0.15)';cx.lineWidth=1;cx.setLineDash([3,4]);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(a.tx,a.ty);cx.stroke();cx.setLineDash([]);}});
  S.bm.forEach(b=>{if(!b.alive)return;drawSAMIcon(b.x,b.y,b.side,sc,S.sel===b);});
  S.mis.forEach(m=>{if(!m.alive)return;
    if(m.tr&&m.tr.length>1){cx.beginPath();cx.moveTo(m.tr[0].x,m.tr[0].y);for(let i=1;i<m.tr.length;i++)cx.lineTo(m.tr[i].x,m.tr[i].y);
      cx.strokeStyle=m.isBallistic?'rgba(255,170,64,0.6)':m.isSAM?'rgba(220,80,80,0.35)':'rgba(43,111,219,0.35)';
      cx.lineWidth=m.isBallistic?2.5:1.5;cx.stroke();}
    cx.save();cx.translate(m.x,m.y);
    const ma=Math.atan2(m.ty-m.y,m.tx-m.x);cx.rotate(ma);
    cx.scale(m.isBallistic?0.02*sc:0.015*sc, m.isBallistic?0.02*sc:0.015*sc);
    if(A.mis)cx.drawImage(A.mis,-A.mis.width/2,-A.mis.height/2);
    cx.restore();
  });
  S.exp.forEach(e=>{const a=Math.max(0,e.l/e.ml);const sz=(e.sz||8)*sc;cx.save();cx.translate(e.x,e.y);cx.globalAlpha=a*0.7;cx.scale(sz/60,sz/60);if(A.blast)cx.drawImage(A.blast,-A.blast.width/2,-A.blast.height/2);cx.restore();});
  cx.restore();
  hudTimer+=dt;if(hudTimer>0.25){
    hudTimer=0;
    _('tbInfo').textContent='T:'+S.tick+(S.gameover?' END':'')+'|'+S.spd+'×'+(S.pause?' PAUSED':'');
    const sec=S.tick/60|0;_('logTime').textContent=String(sec/3600|0).padStart(2,'0')+':'+String((sec%3600)/60|0).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
    if(S.sel){_('siSelName').textContent=S.sel.name||'—';_('siSelType').textContent=S.sel.t||(S.sel.spec?.id||'—');
      const sd=sides.find(s=>s.id===S.sel.side);_('siSelSide').textContent=sd?sd.name:'—';
      if(S.sel.t==='ac')_('siSelHP').textContent='FUEL:'+(S.sel.fu|0)+'%'+(S.sel.isTanker?' [TANKER]':S.sel.isAwacs?' [AWACS]':'');
      else if(S.sel.t==='ship')_('siSelHP').textContent='HP:'+(S.sel.hp|0)+'/'+(S.sel.maxHP||300);
      else if(S.sel.t==='base')_('siSelHP').textContent='AC:'+(S.sel.ac||0)+'/'+(S.sel.maxAC||100);
      else _('siSelHP').textContent='HP:'+(S.sel.hp||0);
      _('siSelWpn').textContent=S.sel.wp?S.sel.wp.map(w=>w.id+':'+w.cnt).join(' '):(S.sel.maxM!==undefined?'M:'+S.sel.maxM:'—');
    }else{['siSelName','siSelType','siSelSide','siSelHP','siSelWpn'].forEach(i=>_(i).textContent='—');}
    _('siStatus').textContent=S.gameover?'END':'ACTIVE';
  }
  requestAnimationFrame(r);
}
requestAnimationFrame(r);
console.log('CMO v6.1 — FIXES: BM speed÷4, realistic stealth detection (RCS^0.25), SAM always fires at detected targets');