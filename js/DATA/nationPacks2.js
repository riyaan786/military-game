// ======================================================
// nationPacks2.js — 20+ NEW UNITS (FRANCE, GERMANY, UK, RUSSIA ADVANCED, DEFENSE)
// ======================================================

// ===================== FRANCE 🇫🇷 =====================
const RAFALE_F4_V2 = {id:"rafale_f4v2",name:"Rafale F4",role:"multirole",faction:"France",crew:1,cruiseKMH:900,maxKMH:1910,hp:120,radarKM:250,stealth:false,rcs:0.5,combatRadiusKM:1000,ecm:92,compatibleWeapons:["meteor","mica","storm_shadow","exocet"],defaultLoadout:[{id:"meteor",count:4},{id:"storm_shadow",count:2}]};
const MIRAGE_2000D_V2 = {id:"mirage_2000dv2",name:"Mirage 2000D",role:"strike",faction:"France",crew:2,cruiseKMH:900,maxKMH:2340,hp:100,radarKM:160,stealth:false,rcs:5,combatRadiusKM:900,ecm:65,compatibleWeapons:["storm_shadow","gbu31"],defaultLoadout:[{id:"storm_shadow",count:2}]};
const ATL2_V2 = {id:"atl2v2",name:"Atlantique 2",role:"maritime_patrol",faction:"France",crew:10,cruiseKMH:650,maxKMH:700,hp:170,radarKM:500,ecm:65,compatibleWeapons:["exocet","mk54"],defaultLoadout:[{id:"exocet",count:2}]};

// ===================== GERMANY 🇩🇪 =====================
const TORNADO = {id:"tornado",name:"Tornado IDS",role:"strike",faction:"Germany",crew:2,cruiseKMH:900,maxKMH:2330,hp:110,radarKM:190,stealth:false,rcs:8,combatRadiusKM:1000,ecm:60,compatibleWeapons:["storm_shadow","gbu31","aim9x"],defaultLoadout:[{id:"gbu31",count:4}]};
const A400M = {id:"a400m",name:"A400M Atlas",role:"transport",faction:"Germany",crew:4,cruiseKMH:780,maxKMH:850,hp:220,radarKM:100,ecm:30,payloadKG:37000,compatibleWeapons:[],defaultLoadout:[]};
const TIGER_UHT = {id:"tiger_uht",name:"Tiger UHT",role:"attack_helicopter",faction:"Germany",crew:2,cruiseKMH:260,maxKMH:290,hp:90,radarKM:40,ecm:50,compatibleWeapons:["agm114r"],defaultLoadout:[{id:"agm114r",count:4}]};

// ===================== UK 🇬🇧 =====================
const F35B_UK = {id:"f35b_uk",name:"F-35B Lightning (RAF)",role:"stealth_multirole",faction:"UK",crew:1,cruiseKMH:850,maxKMH:1930,hp:100,radarKM:220,stealth:true,rcs:0.001,combatRadiusKM:800,ecm:94,compatibleWeapons:["aim120d","gbu31","aim9x"],defaultLoadout:[{id:"aim120d",count:4}]};
const TYPHOON_UK = {id:"typhoon_uk",name:"Eurofighter Typhoon (RAF)",role:"fighter",faction:"UK",crew:1,cruiseKMH:900,maxKMH:2490,hp:110,radarKM:240,stealth:false,rcs:0.5,combatRadiusKM:1200,ecm:85,compatibleWeapons:["meteor","aim120d","storm_shadow"],defaultLoadout:[{id:"meteor",count:4}]};
const CHINOOK_UK = {id:"chinook_uk",name:"CH-47 Chinook (RAF)",role:"transport",faction:"UK",crew:3,cruiseKMH:280,maxKMH:310,hp:180,radarKM:40,ecm:20,troopCapacity:55,compatibleWeapons:[],defaultLoadout:[]};

// ===================== RUSSIA ADVANCED 🇷🇺 =====================
const SU75 = {id:"su75",name:"Su-75 Checkmate",role:"stealth_fighter",faction:"Russia",crew:1,cruiseKMH:950,maxKMH:2400,hp:120,radarKM:220,stealth:true,rcs:0.1,combatRadiusKM:1200,ecm:80,compatibleWeapons:["r77m","kh59","gbu31"],defaultLoadout:[{id:"r77m",count:4}]};
const SU34 = {id:"su34",name:"Su-34 Fullback",role:"strike",faction:"Russia",crew:2,cruiseKMH:900,maxKMH:1900,hp:130,radarKM:210,stealth:false,rcs:15,combatRadiusKM:1500,ecm:60,compatibleWeapons:["kh31","kh59","gbu31"],defaultLoadout:[{id:"kh31",count:4}]};
const MIG35 = {id:"mig35",name:"MiG-35 Fulcrum-F",role:"fighter",faction:"Russia",crew:1,cruiseKMH:950,maxKMH:2400,hp:105,radarKM:200,stealth:false,rcs:5,combatRadiusKM:900,ecm:70,compatibleWeapons:["r77","r73","kh35"],defaultLoadout:[{id:"r77",count:4},{id:"r73",count:2}]};
const TU22M3M = {id:"tu22m3m",name:"Tu-22M3M Backfire",role:"bomber",faction:"Russia",crew:4,cruiseKMH:1000,maxKMH:2300,hp:180,radarKM:200,stealth:false,rcs:25,combatRadiusKM:3000,ecm:40,compatibleWeapons:["kh101","kh55"],defaultLoadout:[{id:"kh101",count:4}]};
const MI28NM = {id:"mi28nm",name:"Mi-28NM Havoc",role:"attack_helicopter",faction:"Russia",crew:2,cruiseKMH:270,maxKMH:300,hp:110,radarKM:35,ecm:60,compatibleWeapons:["agm114r","r73"],defaultLoadout:[{id:"agm114r",count:8}]};
const IL96_MRTT = {id:"il96_mrtt",name:"Il-96 MRTT Tanker",role:"tanker",faction:"Russia",crew:4,cruiseKMH:800,maxKMH:850,hp:200,radarKM:50,ecm:30,fuelTransferKG:110000,compatibleWeapons:[],defaultLoadout:[]};

// ===================== NEW AIR DEFENSE SYSTEMS =====================
const S500 = {id:"s500",name:"S-500 Prometheus",faction:"Russia",type:"long_range_sam",hp:400,armor:0.65,radarKM:800,engageKM:600,reloadS:10,maxMissiles:24,antiStealth:0.85,radarPower:0.98,tracking:100,simultaneous:16,ammo:["77n6","77n6n"],radarRotation:0.3,crew:5,engagementChannels:16,trackCapacity:100,missilesPerLauncher:4,launchers:6,canInterceptMissiles:true,canInterceptBallisticMissiles:true,hypersonicInterceptor:true};
const IRON_BEAM = {id:"iron_beam",name:"Iron Beam Laser",faction:"Israel",type:"laser_ciws",hp:60,armor:0.10,radarKM:20,engageKM:7,reloadS:0,maxMissiles:999,crew:2,canInterceptMissiles:true};
const CRAM = {id:"cram",name:"C-RAM",faction:"USA",type:"ciws",hp:80,armor:0.15,radarKM:15,engageKM:3,reloadS:0,maxMissiles:999,crew:2,canInterceptMissiles:true};
const S500_MOBILE = {id:"s500_mobile",name:"S-500 Mobile Launcher",faction:"Russia",type:"mobile_abm",hp:200,armor:0.45,radarKM:600,engageKM:400,reloadS:12,maxMissiles:8,canInterceptBallisticMissiles:true,hypersonicInterceptor:true};

// ===================== 20 MORE MILITARY UNITS =====================

// AIRCRAFT — AUSTRALIA 🇦🇺
const F18A_HORNET = {id:"f18a",name:"F/A-18A Hornet",role:"fighter",faction:"Australia",crew:1,cruiseKMH:850,maxKMH:1915,hp:100,radarKM:180,stealth:false,rcs:3,combatRadiusKM:650,ecm:60,compatibleWeapons:["aim120d","aim9x","agm65"],defaultLoadout:[{id:"aim120d",count:4}]};
const E7_WEDGETAIL = {id:"e7_wg",name:"E-7 Wedgetail",role:"awacs",faction:"Australia",crew:10,cruiseKMH:750,maxKMH:850,hp:180,radarKM:650,ecm:92,compatibleWeapons:[],defaultLoadout:[]};

// AIRCRAFT — INDIA 🇮🇳
const SU30MKI = {id:"su30mki",name:"Su-30MKI",role:"multirole",faction:"India",crew:2,cruiseKMH:900,maxKMH:2120,hp:110,radarKM:250,stealth:false,rcs:5,combatRadiusKM:1200,ecm:78,compatibleWeapons:["r77","r73","kh31"],defaultLoadout:[{id:"r77",count:4}]};
const TEJAS_MK1A = {id:"tejas",name:"Tejas Mk1A",role:"fighter",faction:"India",crew:1,cruiseKMH:850,maxKMH:2200,hp:85,radarKM:140,stealth:false,rcs:3,combatRadiusKM:500,ecm:65,compatibleWeapons:["r77","r73"],defaultLoadout:[{id:"r77",count:2}]};

// AIRCRAFT — BRAZIL 🇧🇷
const GRIPEN_E = {id:"gripen_e",name:"JAS-39E Gripen",role:"multirole",faction:"Brazil",crew:1,cruiseKMH:850,maxKMH:2200,hp:110,radarKM:200,stealth:false,rcs:1,combatRadiusKM:800,ecm:85,compatibleWeapons:["meteor","aim9x","agm65"],defaultLoadout:[{id:"meteor",count:4}]};

// AIRCRAFT — SAUDI ARABIA 🇸🇦
const F15SA = {id:"f15sa",name:"F-15SA Strike Eagle",role:"strike",faction:"Saudi Arabia",crew:2,cruiseKMH:900,maxKMH:2650,hp:120,radarKM:240,stealth:false,rcs:10,combatRadiusKM:1300,ecm:75,compatibleWeapons:["aim120d","aim9x","agm158"],defaultLoadout:[{id:"aim120d",count:4},{id:"agm158",count:4}]};
const TYPHOON_SA = {id:"typhoon_sa",name:"Eurofighter Typhoon (RSAF)",role:"fighter",faction:"Saudi Arabia",crew:1,cruiseKMH:900,maxKMH:2495,hp:110,radarKM:240,stealth:false,rcs:0.5,combatRadiusKM:1200,ecm:85,compatibleWeapons:["meteor","aim120d","aim9x"],defaultLoadout:[{id:"meteor",count:4}]};

// AIRCRAFT — UAE 🇦🇪
const MIRAGE_2000_9 = {id:"mirage_2000_9",name:"Mirage 2000-9",role:"multirole",faction:"UAE",crew:1,cruiseKMH:900,maxKMH:2336,hp:95,radarKM:160,stealth:false,rcs:3,combatRadiusKM:700,ecm:70,compatibleWeapons:["mica","aim9x","exocet"],defaultLoadout:[{id:"mica",count:4}]};
const F16E_BLOCK60 = {id:"f16e_blk60",name:"F-16E Block 60 Desert Falcon",role:"multirole",faction:"UAE",crew:1,cruiseKMH:850,maxKMH:2400,hp:100,radarKM:220,stealth:false,rcs:1,combatRadiusKM:650,ecm:78,compatibleWeapons:["aim120d","aim9x","agm65"],defaultLoadout:[{id:"aim120d",count:4}]};

// AIRCRAFT — CANADA 🇨🇦
const CF18_HORNET = {id:"cf18",name:"CF-18 Hornet",role:"fighter",faction:"Canada",crew:1,cruiseKMH:850,maxKMH:1915,hp:100,radarKM:180,stealth:false,rcs:3,combatRadiusKM:650,ecm:60,compatibleWeapons:["aim120d","aim9x","agm65"],defaultLoadout:[{id:"aim120d",count:4}]};

// AIRCRAFT — SWEDEN 🇸🇪
const GRIPEN_C = {id:"gripen_c",name:"JAS-39C Gripen",role:"fighter",faction:"Sweden",crew:1,cruiseKMH:850,maxKMH:2200,hp:90,radarKM:180,stealth:false,rcs:1,combatRadiusKM:700,ecm:80,compatibleWeapons:["meteor","iris_t","rbs15"],defaultLoadout:[{id:"meteor",count:2}]};

// AIRCRAFT — NETHERLANDS 🇳🇱
const F35A_NL = {id:"f35a_nl",name:"F-35A (RNLAF)",role:"stealth_multirole",faction:"Netherlands",crew:1,cruiseKMH:850,maxKMH:1930,hp:100,radarKM:240,stealth:true,rcs:0.001,combatRadiusKM:1200,ecm:95,compatibleWeapons:["aim120d","aim9x","agm158"],defaultLoadout:[{id:"aim120d",count:4}]};

// AIRCRAFT — POLAND 🇵🇱
const F16C_PL = {id:"f16c_pl",name:"F-16C Block 52+ (Poland)",role:"multirole",faction:"Poland",crew:1,cruiseKMH:850,maxKMH:2400,hp:95,radarKM:180,stealth:false,rcs:1,combatRadiusKM:600,ecm:70,compatibleWeapons:["aim120d","aim9x","agm65"],defaultLoadout:[{id:"aim120d",count:4}]};
const FA50_PL = {id:"fa50_pl",name:"FA-50GF (Poland)",role:"fighter",faction:"Poland",crew:2,cruiseKMH:850,maxKMH:1700,hp:85,radarKM:140,stealth:false,rcs:3,combatRadiusKM:500,ecm:60,compatibleWeapons:["aim9x","agm65"],defaultLoadout:[{id:"aim9x",count:2}]};

// AIRCRAFT — GREECE 🇬🇷
const F16C_GR = {id:"f16c_gr",name:"F-16C Block 52+ (HAF)",role:"multirole",faction:"Greece",crew:1,cruiseKMH:850,maxKMH:2400,hp:95,radarKM:180,stealth:false,rcs:1,combatRadiusKM:600,ecm:70,compatibleWeapons:["aim120d","aim9x","agm65"],defaultLoadout:[{id:"aim120d",count:4}]};
const MIRAGE_2000_5MK2 = {id:"mirage_2000_5_mk2",name:"Mirage 2000-5 Mk2",role:"fighter",faction:"Greece",crew:1,cruiseKMH:900,maxKMH:2336,hp:95,radarKM:160,stealth:false,rcs:3,combatRadiusKM:700,ecm:70,compatibleWeapons:["mica","aim9x"],defaultLoadout:[{id:"mica",count:4}]};

// AIRCRAFT — ROMANIA 🇷🇴
const F16C_RO = {id:"f16c_ro",name:"F-16AM Block 15 (RoAF)",role:"fighter",faction:"Romania",crew:1,cruiseKMH:850,maxKMH:2400,hp:85,radarKM:150,stealth:false,rcs:3,combatRadiusKM:500,ecm:55,compatibleWeapons:["aim120c","aim9x"],defaultLoadout:[{id:"aim120c",count:4}]};

// AIR DEFENSE — BRAZIL 🇧🇷 (added AVIBRAS A-Darter)
const AVIBRAS = {id:"avibras",name:"Avibras AD System",faction:"Brazil",type:"short_range_sam",hp:150,armor:0.25,radarKM:80,engageKM:20,reloadS:4,maxMissiles:8,crew:2,canInterceptMissiles:true};
// AIR DEFENSE — ISRAEL 🇮🇱 (added Spyder AIO)
const SPYDER_AIO = {id:"spyder_aio",name:"SPYDER All-In-One",faction:"Israel",type:"medium_range_sam",hp:200,armor:0.35,radarKM:250,engageKM:50,reloadS:5,maxMissiles:12,crew:3,canInterceptMissiles:true};

if (typeof AIR_DEFENSE_DB !== 'undefined') {
  [S500,IRON_BEAM,CRAM,S500_MOBILE,AVIBRAS,SPYDER_AIO].forEach(s => { AIR_DEFENSE_DB[s.id] = s; });
}
