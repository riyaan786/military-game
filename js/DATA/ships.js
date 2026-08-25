// ======================================================
// ships.js — SHIPS / NAVAL DATABASE v2.0
// 20+ Naval Units + Full Missile Compatibility
// ======================================================

// ===================== DESTROYERS =====================
const ARLEIGH_BURKE_F3 = {
  id:"arleigh_burke_f3",name:"USS Arleigh Burke Flight III",
  role:"destroyer",faction:"USA",hp:320,speedKMH:56,radarKM:450,vlsCells:96,
  compatibleWeapons:["sm2","sm6","essm","tomahawk","vl_asroc","harpoon"],
  defaultLoadout:[{id:"sm6",count:24},{id:"tomahawk",count:16},{id:"essm",count:32}]
};
const TYPE052D = {
  id:"type052d",name:"Type 052D Destroyer",
  role:"destroyer",faction:"China",hp:290,speedKMH:58,radarKM:400,vlsCells:64,
  compatibleWeapons:["hhq9","yj18","type53"],
  defaultLoadout:[{id:"hhq9",count:24},{id:"yj18",count:12}]
};
const ZUMWALT = {
  id:"zumwalt",name:"USS Zumwalt",
  role:"stealth_destroyer",faction:"USA",hp:300,speedKMH:55,stealth:true,vlsCells:80,
  compatibleWeapons:["tomahawk","sm6","agm158c"],
  defaultLoadout:[{id:"tomahawk",count:20},{id:"sm6",count:20}]
};
const INS_KOLKATA = {
  id:"ins_kolkata",name:"INS Kolkata",
  role:"destroyer",faction:"India",hp:300,speedKMH:56,radarKM:420,vlsCells:16,
  compatibleWeapons:["brahmos","barak8","type53"],
  defaultLoadout:[{id:"brahmos",count:6},{id:"barak8",count:16}]
};

// ===================== CRUISERS =====================
const TICONDEROGA = {
  id:"ticonderoga",name:"Ticonderoga Cruiser",
  role:"cruiser",faction:"USA",hp:340,speedKMH:54,radarKM:480,vlsCells:122,
  compatibleWeapons:["sm2","sm6","tomahawk","vl_asroc"],
  defaultLoadout:[{id:"sm2",count:40},{id:"tomahawk",count:20}]
};
const TYPE055 = {
  id:"type055",name:"Type 055 Cruiser",
  role:"cruiser",faction:"China",hp:380,speedKMH:55,radarKM:500,vlsCells:112,
  compatibleWeapons:["hhq9","yj18","yj21","type53"],
  defaultLoadout:[{id:"yj21",count:8},{id:"hhq9",count:32},{id:"yj18",count:16}]
};

// ===================== CARRIERS (20 TOTAL) =====================
const CVN68 = {id:"cvn68",name:"USS Nimitz (CVN-68)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","ea18g","e2d","mh60"],defaultLoadout:[{id:"fa18e",count:24},{id:"ea18g",count:6},{id:"e2d",count:4}]};
const CVN69 = {id:"cvn69",name:"USS Eisenhower (CVN-69)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","ea18g","e2d","mh60"],defaultLoadout:[{id:"fa18e",count:22},{id:"ea18g",count:6}]};
const CVN70 = {id:"cvn70",name:"USS Carl Vinson (CVN-70)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","f35a","e2d","mh60"],defaultLoadout:[{id:"fa18e",count:20},{id:"f35a",count:8}]};
const CVN71 = {id:"cvn71",name:"USS Theodore Roosevelt (CVN-71)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","ea18g","e2d"],defaultLoadout:[{id:"fa18e",count:26}]};
const CVN72 = {id:"cvn72",name:"USS Abraham Lincoln (CVN-72)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","f35a","e2d"],defaultLoadout:[{id:"f35a",count:10},{id:"fa18e",count:14}]};
const CVN73 = {id:"cvn73",name:"USS George Washington (CVN-73)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","ea18g","mh60"],defaultLoadout:[{id:"fa18e",count:24}]};
const CVN74 = {id:"cvn74",name:"USS John Stennis (CVN-74)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","e2d"],defaultLoadout:[{id:"fa18e",count:20}]};
const CVN75 = {id:"cvn75",name:"USS Harry Truman (CVN-75)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","ea18g","e2d"],defaultLoadout:[{id:"fa18e",count:25}]};
const CVN76 = {id:"cvn76",name:"USS Ronald Reagan (CVN-76)",role:"supercarrier",faction:"USA",hp:1200,speedKMH:56,radarKM:600,airWingCapacity:70,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","ea18g","mh60"],defaultLoadout:[{id:"fa18e",count:24}]};
const CVN77 = {id:"cvn77",name:"USS George H.W. Bush (CVN-77)",role:"supercarrier",faction:"USA",hp:1250,speedKMH:56,radarKM:620,airWingCapacity:75,runwayCount:4,launchSystem:"CATOBAR",compatibleAircraft:["fa18e","f35a","e2d","ea18g"],defaultLoadout:[{id:"f35a",count:12},{id:"fa18e",count:18}]};
const CVN78 = {id:"cvn78",name:"USS Gerald R. Ford (CVN-78)",role:"next_gen_supercarrier",faction:"USA",hp:1350,speedKMH:58,radarKM:700,airWingCapacity:90,runwayCount:4,launchSystem:"EMALS",compatibleAircraft:["f35a","fa18e","ea18g","e2d"],defaultLoadout:[{id:"f35a",count:20},{id:"fa18e",count:25}]};
const CV16 = {id:"cv16",name:"Liaoning (CV-16)",role:"carrier",faction:"China",hp:1000,speedKMH:54,radarKM:520,airWingCapacity:40,runwayCount:2,launchSystem:"STOBAR",compatibleAircraft:["j15"],defaultLoadout:[{id:"j15",count:24}]};
const CV17 = {id:"cv17",name:"Shandong (CV-17)",role:"carrier",faction:"China",hp:1050,speedKMH:54,radarKM:540,airWingCapacity:45,runwayCount:2,launchSystem:"STOBAR",compatibleAircraft:["j15"],defaultLoadout:[{id:"j15",count:28}]};
const CV18 = {id:"cv18",name:"Fujian (CV-18)",role:"carrier",faction:"China",hp:1150,speedKMH:55,radarKM:600,airWingCapacity:70,runwayCount:3,launchSystem:"CATOBAR",compatibleAircraft:["j15","j20"],defaultLoadout:[{id:"j20",count:20},{id:"j15",count:20}]};
const CV1143 = {id:"cv1143",name:"Admiral Kuznetsov",role:"heavy_carrier_cruiser",faction:"Russia",hp:900,speedKMH:52,radarKM:500,airWingCapacity:30,runwayCount:1,launchSystem:"STOBAR",compatibleAircraft:["su35","mig29"],defaultLoadout:[{id:"su35",count:14}]};
const R08 = {id:"r08",name:"HMS Queen Elizabeth",role:"light_carrier",faction:"UK",hp:1100,speedKMH:55,radarKM:580,airWingCapacity:45,runwayCount:2,launchSystem:"STOVL",compatibleAircraft:["f35a"],defaultLoadout:[{id:"f35a",count:24}]};
const R09 = {id:"r09",name:"HMS Prince of Wales",role:"light_carrier",faction:"UK",hp:1100,speedKMH:55,radarKM:580,airWingCapacity:45,runwayCount:2,launchSystem:"STOVL",compatibleAircraft:["f35a"],defaultLoadout:[{id:"f35a",count:20}]};
const R91 = {id:"r91",name:"Charles de Gaulle",role:"medium_carrier",faction:"France",hp:1000,speedKMH:54,radarKM:600,airWingCapacity:40,runwayCount:2,launchSystem:"CATOBAR",compatibleAircraft:["rafale_m","e2c"],defaultLoadout:[{id:"rafale_m",count:22}]};

// ===================== SUBMARINES =====================
const VIRGINIA = {
  id:"virginia",name:"Virginia Class Submarine",
  role:"attack_sub",faction:"USA",hp:500,speedKMH:46,stealth:true,vlsCells:12,
  compatibleWeapons:["tomahawk","torpedo_mk48","vl_asroc"],
  defaultLoadout:[{id:"tomahawk",count:12},{id:"torpedo_mk48",count:8}]
};
const ASTUTE = {
  id:"astute",name:"Astute Class Submarine",
  role:"attack_sub",faction:"UK",hp:480,speedKMH:44,stealth:true,
  compatibleWeapons:["tomahawk","spearfish"],
  defaultLoadout:[{id:"spearfish",count:8}]
};
const KILO = {
  id:"kilo",name:"Kilo Class Submarine",
  role:"diesel_sub",faction:"Russia",hp:420,speedKMH:40,stealth:true,
  compatibleWeapons:["kalibr","type53"],
  defaultLoadout:[{id:"kalibr",count:4}]
};

// ===================== FRIGATES =====================
const FREMM = {
  id:"fremm",name:"FREMM Frigate",
  role:"frigate",faction:"France/Italy",hp:260,speedKMH:56,radarKM:350,vlsCells:16,
  compatibleWeapons:["aster15","exocet","type53"],
  defaultLoadout:[{id:"exocet",count:8},{id:"aster15",count:8}]
};
const TYPE26 = {
  id:"type26",name:"Type 26 Frigate",
  role:"frigate",faction:"UK",hp:270,speedKMH:54,radarKM:380,vlsCells:24,
  compatibleWeapons:["sea_ceptor","tomahawk","essm"],
  defaultLoadout:[{id:"essm",count:12},{id:"tomahawk",count:8}]
};
const CORVETTE = {
  id:"corvette",name:"Stealth Corvette",
  role:"corvette",faction:"Multi",hp:150,speedKMH:65,radarKM:120,vlsCells:8,
  compatibleWeapons:["exocet","type53"],
  defaultLoadout:[{id:"exocet",count:4}]
};

// ===================== NAVAL AIRCRAFT =====================
const P8_NAVAL = {
  id:"p8_naval",name:"P-8 Poseidon",role:"maritime_patrol",faction:"USA",
  hp:200,speedKMH:800,radarKM:450,
  compatibleWeapons:["harpoon","mk54"],
  defaultLoadout:[{id:"harpoon",count:4},{id:"mk54",count:6}]
};
const MH60 = {
  id:"mh60",name:"MH-60 Seahawk",role:"naval_helo",faction:"USA",
  hp:120,speedKMH:270,radarKM:60,
  compatibleWeapons:["mk54"],
  defaultLoadout:[{id:"mk54",count:2}]
};

// ===================== PACK 2: 20 MORE NAVAL UNITS =====================
const DDG1000 = {id:"ddg1000",name:"USS Zumwalt Class",role:"stealth_destroyer",faction:"USA",hp:310,speedKMH:55,radarKM:420,stealth:true,vlsCells:80,compatibleWeapons:["sm6","tomahawk","agm158c","vl_asroc"],defaultLoadout:[{id:"tomahawk",count:18},{id:"sm6",count:16}]};
const TYPE45 = {id:"type45",name:"Type 45 Daring",role:"air_defense_destroyer",faction:"UK",hp:300,speedKMH:54,radarKM:450,vlsCells:48,compatibleWeapons:["aster15","aster30","sea_ceptor"],defaultLoadout:[{id:"aster30",count:16}]};
const HOBART = {id:"hobart",name:"Hobart Class",role:"aegis_destroyer",faction:"Australia",hp:290,speedKMH:56,radarKM:440,vlsCells:48,compatibleWeapons:["sm2","sm6","essm","tomahawk"],defaultLoadout:[{id:"sm6",count:12},{id:"tomahawk",count:8}]};
const SEJONG = {id:"sejong",name:"Sejong the Great",role:"heavy_destroyer",faction:"South Korea",hp:330,speedKMH:55,radarKM:460,vlsCells:128,compatibleWeapons:["sm2","sm6","essm","agm158c"],defaultLoadout:[{id:"sm2",count:40},{id:"agm158c",count:12}]};
const SLAVA = {id:"slava",name:"Slava Class Cruiser",role:"missile_cruiser",faction:"Russia",hp:360,speedKMH:52,radarKM:480,vlsCells:16,compatibleWeapons:["p800_oniks","kalibr"],defaultLoadout:[{id:"p800_oniks",count:8}]};
const KIROV = {id:"kirov",name:"Kirov Class Battlecruiser",role:"battlecruiser",faction:"Russia",hp:500,speedKMH:50,radarKM:600,vlsCells:96,compatibleWeapons:["kalibr","p800_oniks"],defaultLoadout:[{id:"p800_oniks",count:16}]};
const GOWIND = {id:"gowind",name:"Gowind 2500",role:"corvette_frigate",faction:"France",hp:220,speedKMH:55,radarKM:300,vlsCells:16,compatibleWeapons:["exocet","aster15"],defaultLoadout:[{id:"exocet",count:4}]};
const SIGMA = {id:"sigma",name:"Sigma Class Frigate",role:"light_frigate",faction:"Netherlands",hp:210,speedKMH:54,radarKM:280,vlsCells:12,compatibleWeapons:["exocet","rbs15","essm"],defaultLoadout:[{id:"essm",count:8}]};
const MEKO = {id:"meko",name:"MEKO A-200",role:"multi_role_frigate",faction:"Germany",hp:240,speedKMH:56,radarKM:320,vlsCells:16,compatibleWeapons:["iris_t","exocet","essm"],defaultLoadout:[{id:"essm",count:10}]};
const YASEN = {id:"yasen",name:"Yasen Class Submarine",role:"nuclear_attack_sub",faction:"Russia",hp:550,speedKMH:50,stealth:true,vlsCells:32,compatibleWeapons:["kalibr","p800_oniks","type53"],defaultLoadout:[{id:"kalibr",count:12},{id:"p800_oniks",count:8}]};
const BOREI = {id:"borei",name:"Borei Class SSBN",role:"ballistic_sub",faction:"Russia",hp:600,speedKMH:46,stealth:true,missileTubes:16,compatibleWeapons:["bulava"],defaultLoadout:[{id:"bulava",count:12}]};
const SCORPENE = {id:"scorpene",name:"Scorpene Class Submarine",role:"diesel_sub",faction:"France/India",hp:400,speedKMH:40,stealth:true,compatibleWeapons:["exocet"],defaultLoadout:[{id:"exocet",count:4}]};
const CDG = {id:"cdg",name:"Charles de Gaulle",role:"carrier",faction:"France",hp:950,speedKMH:52,radarKM:550,airWingCapacity:40,compatibleWeapons:["rafale_m"]};
const KUZNETSOV = {id:"kuznetsov",name:"Admiral Kuznetsov",role:"carrier",faction:"Russia",hp:850,speedKMH:52,radarKM:500,airWingCapacity:30,compatibleWeapons:["su35","mig29"]};
const LIAONING = {id:"liaoning",name:"Liaoning Carrier",role:"carrier",faction:"China",hp:900,speedKMH:52,radarKM:520,airWingCapacity:40,compatibleWeapons:["j20","j16"]};
const LHD_AMERICA = {id:"lhd_america",name:"USS America LHD",role:"amphibious_assault",faction:"USA",hp:700,speedKMH:50,radarKM:300,airWingCapacity:20,compatibleWeapons:["f35a"]};
const LPD_SAN_ANTONIO = {id:"lpd_san_antonio",name:"San Antonio Class LPD",role:"landing_ship",faction:"USA",hp:650,speedKMH:48,radarKM:250,troopCapacity:800,compatibleWeapons:[]};
const FAST_ATTACK = {id:"fast_attack",name:"Fast Attack Missile Boat",role:"fast_attack",faction:"Multi",hp:120,speedKMH:90,radarKM:80,compatibleWeapons:["exocet","harpoon","rbs15"],defaultLoadout:[{id:"harpoon",count:4}]};

// ======================================================
// COMBINED SHIP LOOKUP
// ======================================================
const SHIPS_DB = {
  arleigh_burke_f3:ARLEIGH_BURKE_F3,type052d:TYPE052D,zumwalt:ZUMWALT,ins_kolkata:INS_KOLKATA,
  ticonderoga:TICONDEROGA,type055:TYPE055,
  cvn68:CVN68,cvn69:CVN69,cvn70:CVN70,cvn71:CVN71,cvn72:CVN72,
  cvn73:CVN73,cvn74:CVN74,cvn75:CVN75,cvn76:CVN76,cvn77:CVN77,cvn78:CVN78,
  cv16:CV16,cv17:CV17,cv18:CV18,cv1143:CV1143,r08:R08,r09:R09,r91:R91,
  virginia:VIRGINIA,astute:ASTUTE,kilo:KILO,
  fremm:FREMM,type26:TYPE26,corvette:CORVETTE,
  p8_naval:P8_NAVAL,mh60:MH60,
  ddg1000:DDG1000,type45:TYPE45,hobart:HOBART,sejong:SEJONG,
  slava:SLAVA,kirov:KIROV,
  gowind:GOWIND,sigma:SIGMA,meko:MEKO,
  yasen:YASEN,borei:BOREI,scorpene:SCORPENE,
  cdg:CDG,kuznetsov:KUZNETSOV,liaoning:LIAONING,
  lhd_america:LHD_AMERICA,lpd_san_antonio:LPD_SAN_ANTONIO,fast_attack:FAST_ATTACK
};

// ======================================================
// NAVAL WEAPONS DATABASE
// ======================================================
const NAVAL_WEAPONS_DB = {
  harpoon:{id:"harpoon",name:"RGM-84 Harpoon",type:"anti_ship",damage:220,rangeKM:130,mach:0.85,seaSkimming:true,hitProb:0.80,compatiblePlatforms:["ship","sub","air"]},
  exocet:{id:"exocet",name:"MM40 Exocet",type:"anti_ship",damage:210,rangeKM:180,mach:0.93,seaSkimming:true,hitProb:0.82,compatiblePlatforms:["ship","air","coastal"]},
  rbs15:{id:"rbs15",name:"RBS-15 Mk3",type:"anti_ship",damage:240,rangeKM:200,mach:0.9,seaSkimming:true,hitProb:0.84,compatiblePlatforms:["ship","air"]},
  yj12:{id:"yj12",name:"YJ-12",type:"anti_ship",damage:350,rangeKM:400,mach:3.0,seaSkimming:true,hitProb:0.88,compatiblePlatforms:["air","ship"]},
  agm158c:{id:"agm158c",name:"AGM-158C LRASM",type:"anti_ship",damage:320,rangeKM:560,mach:0.85,stealth:true,seaSkimming:true,hitProb:0.90,compatiblePlatforms:["air","ship"]},
  tomahawk:{id:"tomahawk",name:"BGM-109 Tomahawk",type:"cruise",damage:450,rangeKM:1600,mach:0.8,hitProb:0.88,compatiblePlatforms:["ship","sub"]},
  kalibr:{id:"kalibr",name:"3M-14 Kalibr",type:"cruise",damage:420,rangeKM:1500,mach:0.8,hitProb:0.86,compatiblePlatforms:["ship","sub"]},
  sm2:{id:"sm2",name:"RIM-66 SM-2",type:"naval_sam",damage:85,rangeKM:170,mach:3.5,hitProb:0.82},
  sm6:{id:"sm6",name:"RIM-174 SM-6",type:"naval_sam",damage:95,rangeKM:240,mach:4.5,hitProb:0.88},
  essm:{id:"essm",name:"ESSM",type:"naval_sam",damage:70,rangeKM:50,mach:4.0,hitProb:0.85,compatiblePlatforms:["frigate","destroyer","carrier"]},
  aster15:{id:"aster15",name:"Aster 15",type:"naval_sam",damage:75,rangeKM:30,mach:4.5,hitProb:0.86},
  sea_ceptor:{id:"sea_ceptor",name:"Sea Ceptor",type:"naval_sam",damage:75,rangeKM:45,mach:3,hitProb:0.85},
  vl_asroc:{id:"vl_asroc",name:"VL-ASROC",type:"asw",damage:260,rangeKM:22,mach:2.0,hitProb:0.75},
  mk54:{id:"mk54",name:"Mk-54 Torpedo",type:"torpedo",damage:300,rangeKM:15,guidance:"Active Sonar",underwater:true,hitProb:0.82,compatiblePlatforms:["ship","helo","air"]},
  spearfish:{id:"spearfish",name:"Spearfish Torpedo",type:"torpedo",damage:500,rangeKM:50,guidance:"Wire+Active",underwater:true,hitProb:0.85,compatiblePlatforms:["sub"]},
  type53:{id:"type53",name:"Type 53 Torpedo",type:"torpedo",damage:350,rangeKM:40,underwater:true,hitProb:0.78,compatiblePlatforms:["sub","ship"]},
  torpedo_mk48:{id:"torpedo_mk48",name:"Mk-48 Torpedo",type:"torpedo",damage:350,rangeKM:50,underwater:true,hitProb:0.80,compatiblePlatforms:["sub"]},
  brahmos:{id:"brahmos",name:"BrahMos",type:"anti_ship",damage:700,rangeKM:450,mach:3,hitProb:0.98},
  yj18:{id:"yj18",name:"YJ-18",type:"anti_ship",damage:650,rangeKM:540,mach:3,hitProb:0.97},
  yj21:{id:"yj21",name:"YJ-21",type:"anti_ship",damage:700,rangeKM:1500,mach:10,hitProb:0.98},
  hhq9:{id:"hhq9",name:"HHQ-9",type:"naval_sam",damage:88,rangeKM:250,mach:5.5,hitProb:0.85},
  barak8:{id:"barak8",name:"Barak-8",type:"naval_sam",damage:85,rangeKM:150,mach:4.5,hitProb:0.85},
  mk45:{id:"mk45",name:"5-inch Naval Gun",type:"naval_gun",damage:60,rangeKM:23,rateOfFireRPM:20},
  oto76:{id:"oto76",name:"OTO 76mm",type:"naval_gun",damage:45,rangeKM:16,rateOfFireRPM:120},
  ags_155:{id:"ags_155",name:"155mm AGS",type:"naval_gun",damage:80,rangeKM:100,rateOfFireRPM:10}
};

// ======================================================
// NAVAL COMPATIBILITY MATRIX
// ======================================================
const NAVAL_COMPATIBILITY = {
  harpoon:{ships:["arleigh_burke_f3","ticonderoga","type052d","fremm","type26","ins_kolkata","nimitz","ford","queen_elizabeth"],subs:["virginia","astute","kilo"],air:["f16","fa18e","f35a","p8_naval","rafale"]},
  exocet:{ships:["fremm","type26","ins_kolkata","type052d","corvette"],subs:["kilo"],air:["rafale","mirage2000_5"]},
  rbs15:{ships:["type26","fremm"],subs:["kilo"],air:["gripen"]},
  yj12:{ships:["type055","type052d"],air:["h6k","j16"]},
  agm158c:{ships:["nimitz","ford","ticonderoga","arleigh_burke_f3","zumwalt"],air:["f15e","f35a","b1b","b52"]},
  tomahawk:{ships:["arleigh_burke_f3","ticonderoga","zumwalt","type26","fremm"],subs:["virginia","astute"],air:["b52","b1b"]},
  kalibr:{ships:["type052d","type055"],subs:["kilo"],air:["tu95","tu160"]},
  sm2:{ships:["arleigh_burke_f3","ticonderoga"]},
  sm6:{ships:["arleigh_burke_f3","ticonderoga","zumwalt"]},
  essm:{ships:["arleigh_burke_f3","ticonderoga","type052d","fremm","type26","nimitz","ford","queen_elizabeth"]},
  aster15:{ships:["fremm","type26"]},
  sea_ceptor:{ships:["type26","fremm"]},
  vl_asroc:{ships:["arleigh_burke_f3","ticonderoga","type052d","type055","virginia"]},
  mk54:{ships:["arleigh_burke_f3","ticonderoga","type26","fremm"],air:["p8_naval","mh60"]},
  spearfish:{subs:["astute"]},
  type53:{subs:["kilo"],ships:["type052d","ins_kolkata"]},
  torpedo_mk48:{subs:["virginia"]},
  brahmos:{ships:["ins_kolkata"]},
  yj18:{ships:["type052d","type055"]},
  yj21:{ships:["type055"]},
  hhq9:{ships:["type052d","type055"]},
  barak8:{ships:["ins_kolkata"]},
  mk45:{ships:["arleigh_burke_f3","ticonderoga","type052d","type055","type26","fremm"]},
  oto76:{ships:["fremm","type26","ins_kolkata","corvette"]},
  ags_155:{ships:["zumwalt"]}
};

// ======================================================
// SHIP CREATOR
// ======================================================
function createShip(spec, side, x, y) {
  const s = spec || FREMM;
  return {
    id:'shp'+Date.now()+'_'+(Math.random()*99999|0),
    t:'ship',side,name:s.name||'Unknown Ship',
    x,y,tx:x,ty:y,h:0,
    spd:CMO.pxPerTick(s.speedKMH||30),
    hp:s.hp||300,
    vls:s.vlsCells||0,
    radarKM:s.radarKM||300,
    stealth:s.stealth||false,
    alive:true,
    spec:s,
    compatibleWeapons:s.compatibleWeapons||[],
    wp:s.defaultLoadout?s.defaultLoadout.map(w=>({...w})):[]
  };
}