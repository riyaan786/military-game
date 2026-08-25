

// ===== CHINESE SYSTEMS (new) =====
const PH_LD2000 = {id:"ld2000",name:"LD-2000 CIWS",faction:"China",type:"ciws",hp:80,armor:0.15,radarKM:15,engageKM:4,reloadS:0,maxMissiles:999,radarRotation:1.0,crew:2,engagementChannels:4,trackCapacity:10,canInterceptMissiles:true};
const PHL16 = {id:"phl16",name:"Type 16 MLRS",faction:"China",type:"rocket_artillery",hp:120,armor:0.20,radarKM:80,engageKM:300,reloadS:15,maxMissiles:16,crew:3};

// ===== TAIWAN =====
const SKYBOW1 = {id:"tc1",name:"Sky Bow I SAM",faction:"Taiwan",type:"short_range_sam",hp:180,armor:0.35,radarKM:100,engageKM:20,reloadS:5,maxMissiles:12,engagementChannels:4,trackCapacity:12,canInterceptMissiles:true};
const SKYBOW2 = {id:"tc2",name:"Sky Bow II SAM",faction:"Taiwan",type:"medium_range_sam",hp:220,armor:0.40,radarKM:250,engageKM:90,reloadS:6,maxMissiles:16,engagementChannels:6,trackCapacity:20,canInterceptMissiles:true};
const SKYBOW3 = {id:"tc3",name:"Sky Bow III SAM",faction:"Taiwan",type:"long_range_sam",hp:280,armor:0.45,radarKM:450,engageKM:200,reloadS:8,maxMissiles:16,engagementChannels:8,trackCapacity:30,canInterceptMissiles:true,canInterceptBallisticMissiles:true};

// ===== SOUTH KOREA =====
const KMSAM = {id:"kmsam",name:"KM-SAM Cheongung",faction:"South Korea",type:"medium_range_sam",hp:250,armor:0.45,radarKM:350,engageKM:150,reloadS:6,maxMissiles:24,engagementChannels:12,trackCapacity:40,canInterceptMissiles:true,canInterceptBallisticMissiles:true};
const CHUNMA = {id:"chunma",name:"K-SAM Chunma",faction:"South Korea",type:"short_range_sam",hp:150,armor:0.30,radarKM:90,engageKM:15,reloadS:3,maxMissiles:8,engagementChannels:4,trackCapacity:8};
const BIHO = {id:"biho",name:"K30 Biho SPAAG",faction:"South Korea",type:"spaag",hp:120,armor:0.25,radarKM:25,engageKM:3,reloadS:0,maxMissiles:999,crew:2};

// ===== JAPAN =====
const TYPE03 = {id:"type03",name:"Type 03 Chu-SAM",faction:"Japan",type:"medium_range_sam",hp:240,armor:0.45,radarKM:300,engageKM:50,reloadS:6,maxMissiles:16,engagementChannels:8,trackCapacity:24,canInterceptMissiles:true};
const TYPE81 = {id:"type81",name:"Type 81 SAM",faction:"Japan",type:"short_range_sam",hp:160,armor:0.30,radarKM:100,engageKM:14,reloadS:3,maxMissiles:8,engagementChannels:4,trackCapacity:8};
const TYPE11 = {id:"type11",name:"Type 11 SAM",faction:"Japan",type:"short_range_sam",hp:170,armor:0.35,radarKM:120,engageKM:18,reloadS:4,maxMissiles:12,engagementChannels:6,trackCapacity:12};
const PHALANX_JPN = {id:"phalanx_jpn",name:"Phalanx CIWS Japan",faction:"Japan",type:"ciws",hp:80,armor:0.15,radarKM:10,engageKM:2,reloadS:0,maxMissiles:999,crew:2};

// ===== NORTH KOREA =====
const KN06 = {id:"kn06",name:"KN-06 SAM",faction:"North Korea",type:"long_range_sam",hp:220,armor:0.40,radarKM:300,engageKM:150,reloadS:8,maxMissiles:12,engagementChannels:6,trackCapacity:15,canInterceptMissiles:true};
const SA5 = {id:"sa5dprk",name:"SA-5 Gammon",faction:"North Korea",type:"long_range_sam",hp:200,armor:0.40,radarKM:280,engageKM:110,reloadS:10,maxMissiles:8,engagementChannels:4,trackCapacity:12};
const SA2 = {id:"sa2",name:"SA-2 Guideline",faction:"North Korea",type:"medium_range_sam",hp:150,armor:0.30,radarKM:200,engageKM:45,reloadS:8,maxMissiles:6,engagementChannels:3,trackCapacity:6};
const SA3 = {id:"sa3",name:"SA-3 Goa",faction:"North Korea",type:"short_range_sam",hp:130,armor:0.25,radarKM:120,engageKM:25,reloadS:6,maxMissiles:6,engagementChannels:3,trackCapacity:6};
const SA7 = {id:"sa7",name:"SA-7 Strela",faction:"North Korea",type:"manpads",hp:40,armor:0.10,radarKM:20,engageKM:5,reloadS:2,maxMissiles:2,crew:1};
const ZSU23 = {id:"zsu23",name:"ZSU-23-4 Shilka",faction:"North Korea",type:"spaag",hp:100,armor:0.20,radarKM:15,engageKM:2,reloadS:0,maxMissiles:999,crew:2};

// ===== ISRAEL =====
const BARAK_MX = {id:"barakmx",name:"Barak MX",faction:"Israel",type:"multi_layer_sam",hp:300,armor:0.50,radarKM:450,engageKM:150,reloadS:6,maxMissiles:24,engagementChannels:16,trackCapacity:60,canInterceptMissiles:true,canInterceptBallisticMissiles:true};

// ===== TURKEY =====
const HISAR_U = {id:"hisar_u",name:"HISAR-U",faction:"Turkey",type:"long_range_sam",hp:260,armor:0.45,radarKM:400,engageKM:120,reloadS:8,maxMissiles:16,engagementChannels:12,trackCapacity:40,canInterceptMissiles:true};
const KORKUT = {id:"korkut",name:"KORKUT CIWS",faction:"Turkey",type:"ciws",hp:100,armor:0.20,radarKM:15,engageKM:4,reloadS:0,maxMissiles:999,crew:2};

// ===== PHILIPPINES =====
const NASAMS_PH = {id:"nasams_ph",name:"NASAMS PH",faction:"Philippines",type:"medium_range_sam",hp:200,armor:0.35,radarKM:300,engageKM:50,reloadS:5,maxMissiles:12,engagementChannels:6,trackCapacity:24,canInterceptMissiles:true};

// ======================================================
// MERGE INTO AIR_DEFENSE_DB
// ======================================================
const NATION_DEFENSE_DB = {
  ld2000:PH_LD2000,phl16:PHL16,
  tc1:SKYBOW1,tc2:SKYBOW2,tc3:SKYBOW3,
  kmsam:KMSAM,chunma:CHUNMA,biho:BIHO,
  type03:TYPE03,type81:TYPE81,type11:TYPE11,phalanx_jpn:PHALANX_JPN,
  kn06:KN06,sa5dprk:SA5,sa2:SA2,sa3:SA3,sa7:SA7,zsu23:ZSU23,
  barakmx:BARAK_MX,hisar_u:HISAR_U,korkut:KORKUT,
  nasams_ph:NASAMS_PH
};

if (typeof AIR_DEFENSE_DB !== 'undefined') {
  Object.keys(NATION_DEFENSE_DB).forEach(k => { AIR_DEFENSE_DB[k] = NATION_DEFENSE_DB[k]; });
}