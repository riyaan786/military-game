// ======================================================
// aircrafts.js — AIRCRAFT DATABASE + WEAPONS DB
// ======================================================

// ---- F-35A ----
const F35A_DATA = {
  id:"f35a",name:"F-35A Lightning II",role:"stealth_multirole",
  faction:"USA",crew:1,cruiseKMH:850,maxKMH:1930,hp:100,
  radarKM:240,trackCapacity:80,engageCapacity:8,
  stealth:true,rcs:0.001,combatRadiusKM:1200,ecm:95,
  compatibleWeapons:["aim120c","aim9x","agm158","agm154","gbu31","gbu39","agm158c"],
  defaultLoadout:[{id:"aim120c",count:4},{id:"agm158",count:2}]
};

// ---- F-22 ----
const F22_DATA = {
  id:"f22",name:"F-22 Raptor",role:"fighter",
  faction:"USA",crew:1,cruiseKMH:900,maxKMH:2410,hp:100,
  radarKM:300,trackCapacity:100,engageCapacity:8,
  stealth:true,rcs:0.0001,combatRadiusKM:850,ecm:95,
  compatibleWeapons:["aim120d","aim9x","gbu31","agm158"],
  defaultLoadout:[{id:"aim120d",count:4},{id:"aim9x",count:2}]
};

// ---- F-16 ----
const F16_DATA = {
  id:"f16",name:"F-16 Fighting Falcon",role:"multirole",
  faction:"USA",crew:1,cruiseKMH:850,maxKMH:2400,hp:90,
  radarKM:180,trackCapacity:20,engageCapacity:6,
  stealth:false,rcs:1.2,combatRadiusKM:550,ecm:60,
  compatibleWeapons:["aim120c","aim120d","aim9x","agm65","agm154","gbu31"],
  defaultLoadout:[{id:"aim120c",count:4},{id:"aim9x",count:2}]
};

// ---- F-15E ----
const F15E_DATA = {
  id:"f15e",name:"F-15E Strike Eagle",role:"strike",
  faction:"USA",crew:2,cruiseKMH:900,maxKMH:2650,hp:110,
  radarKM:220,trackCapacity:40,engageCapacity:8,
  stealth:false,rcs:10,combatRadiusKM:1270,ecm:70,
  compatibleWeapons:["aim120d","aim9x","agm158","agm158c","gbu31","gbu39"],
  defaultLoadout:[{id:"aim120d",count:4},{id:"gbu31",count:4}]
};

// ---- F/A-18E ----
const FA18E_DATA = {
  id:"fa18e",name:"F/A-18E Super Hornet",role:"multirole",
  faction:"USA",crew:1,cruiseKMH:850,maxKMH:1915,hp:100,
  radarKM:200,trackCapacity:40,engageCapacity:8,
  stealth:false,rcs:1,combatRadiusKM:720,ecm:75,
  compatibleWeapons:["aim120d","aim9x","harpoon","agm154","gbu31"],
  defaultLoadout:[{id:"aim120d",count:4},{id:"harpoon",count:2}]
};

// ---- Eurofighter ----
const EUROFIGHTER_DATA = {
  id:"eurofighter",name:"Eurofighter Typhoon",role:"fighter",
  faction:"Europe",crew:1,cruiseKMH:900,maxKMH:2495,hp:100,
  radarKM:240,trackCapacity:40,engageCapacity:8,
  stealth:false,rcs:0.5,combatRadiusKM:1390,ecm:85,
  compatibleWeapons:["meteor","aim120c","aim9x","storm_shadow","brimstone"],
  defaultLoadout:[{id:"meteor",count:4},{id:"aim9x",count:2}]
};

// ---- Gripen ----
const GRIPEN_DATA = {
  id:"gripen",name:"JAS-39 Gripen",role:"multirole",
  faction:"Sweden",crew:1,cruiseKMH:850,maxKMH:2200,hp:90,
  radarKM:180,trackCapacity:20,engageCapacity:6,
  stealth:false,rcs:0.3,combatRadiusKM:800,ecm:80,
  compatibleWeapons:["meteor","iris_t","rbs15"],
  defaultLoadout:[{id:"meteor",count:4}]
};

// ---- Rafale ----
const RAFALE_DATA = {
  id:"rafale",name:"Rafale",role:"multirole",
  faction:"France",crew:1,cruiseKMH:900,maxKMH:1910,hp:100,
  radarKM:220,trackCapacity:40,engageCapacity:8,
  stealth:false,rcs:0.5,combatRadiusKM:1000,ecm:90,
  compatibleWeapons:["meteor","storm_shadow","exocet"],
  defaultLoadout:[{id:"meteor",count:4}]
};

// ---- Su-35 ----
const SU35_DATA = {
  id:"su35",name:"Su-35",role:"fighter",
  faction:"Russia",crew:1,cruiseKMH:900,maxKMH:2500,hp:110,
  radarKM:300,trackCapacity:30,engageCapacity:8,
  stealth:false,rcs:4,combatRadiusKM:1500,ecm:80,
  compatibleWeapons:["r77","r73","kh59"],
  defaultLoadout:[{id:"r77",count:6},{id:"r73",count:2}]
};

// ---- Su-30SM ----
const SU30SM_DATA = {
  id:"su30sm",name:"Su-30SM",role:"multirole",
  faction:"Russia",crew:2,cruiseKMH:900,maxKMH:2120,hp:110,
  radarKM:250,trackCapacity:15,engageCapacity:4,
  stealth:false,rcs:4,combatRadiusKM:1500,ecm:75,
  compatibleWeapons:["r77","r73","kh59","kh31"],
  defaultLoadout:[{id:"r77",count:6},{id:"r73",count:2}]
};

// ---- Su-57 ----
const SU57_DATA = {
  id:"su57",name:"Su-57 Felon",role:"stealth_fighter",
  faction:"Russia",crew:1,cruiseKMH:950,maxKMH:2600,hp:120,
  radarKM:350,trackCapacity:60,engageCapacity:8,
  stealth:true,rcs:0.1,combatRadiusKM:1500,ecm:90,
  compatibleWeapons:["r77m","r74m","kh59"],
  defaultLoadout:[{id:"r77m",count:6}]
};

// ---- MiG-29 ----
const MIG29_DATA = {
  id:"mig29",name:"MiG-29 Fulcrum",role:"multirole",
  faction:"Russia",crew:1,cruiseKMH:900,maxKMH:2400,hp:95,
  radarKM:180,trackCapacity:20,engageCapacity:6,
  stealth:false,rcs:5,combatRadiusKM:700,ecm:55,
  compatibleWeapons:["r77","r73","kh29"],
  defaultLoadout:[{id:"r77",count:2},{id:"r73",count:2},{id:"kh29",count:2}]
};

// ---- MiG-31 ----
const MIG31_DATA = {
  id:"mig31",name:"MiG-31 Foxhound",role:"interceptor",
  faction:"Russia",crew:2,cruiseKMH:1400,maxKMH:3000,hp:130,
  radarKM:400,trackCapacity:40,engageCapacity:6,
  stealth:false,rcs:8,combatRadiusKM:1600,ecm:60,
  compatibleWeapons:["r77","r73","r37m"],
  defaultLoadout:[{id:"r37m",count:4}]
};
const MIG31BM_DATA = {
  id:"mig31bm",name:"MiG-31BM Foxhound",role:"interceptor",
  faction:"Russia",crew:2,cruiseKMH:1100,maxKMH:3000,hp:130,
  radarKM:400,trackCapacity:48,engageCapacity:8,
  stealth:false,rcs:8,combatRadiusKM:1600,ecm:65,
  compatibleWeapons:["r37m","r77m","r73"],
  defaultLoadout:[{id:"r37m",count:4},{id:"r77m",count:2},{id:"r73",count:2}]
};

// ---- A-10 ----
const A10_DATA = {
  id:"a10",name:"A-10 Thunderbolt II",role:"cas",
  faction:"USA",crew:1,cruiseKMH:560,maxKMH:706,hp:180,
  radarKM:50,trackCapacity:8,engageCapacity:4,
  stealth:false,rcs:25,combatRadiusKM:800,ecm:30,
  compatibleWeapons:["agm65","gbu31","aim9x"],
  defaultLoadout:[{id:"agm65",count:6},{id:"gbu31",count:4},{id:"aim9x",count:2}]
};

// ---- AV-8B ----
const AV8B_DATA = {
  id:"av8b",name:"AV-8B Harrier II",role:"cas",
  faction:"USA",crew:1,cruiseKMH:650,maxKMH:1083,hp:100,
  radarKM:40,trackCapacity:8,engageCapacity:4,
  stealth:false,rcs:8,combatRadiusKM:550,ecm:40,
  compatibleWeapons:["agm65","gbu31","aim9x"],
  defaultLoadout:[{id:"agm65",count:4},{id:"gbu31",count:2},{id:"aim9x",count:2}]
};

// ---- F-14 ----
const F14_DATA = {
  id:"f14",name:"F-14 Tomcat",role:"interceptor",
  faction:"USA",crew:2,cruiseKMH:850,maxKMH:2485,hp:110,
  radarKM:240,trackCapacity:24,engageCapacity:6,
  stealth:false,rcs:10,combatRadiusKM:920,ecm:60,
  compatibleWeapons:["aim54","aim120c","aim9x","agm158","gbu31"],
  defaultLoadout:[{id:"aim54",count:4},{id:"aim9x",count:2}]
};

// ---- F-4 ----
const F4_DATA = {
  id:"f4",name:"F-4 Phantom II",role:"fighter",
  faction:"USA",crew:2,cruiseKMH:800,maxKMH:2370,hp:105,
  radarKM:120,trackCapacity:12,engageCapacity:4,
  stealth:false,rcs:12,combatRadiusKM:680,ecm:25,
  compatibleWeapons:["aim120c","aim9x","agm65","gbu31"],
  defaultLoadout:[{id:"aim9x",count:4},{id:"gbu31",count:4}]
};

// ---- J-10C ----
const J10C_DATA = {
  id:"j10c",name:"J-10C",role:"multirole",
  faction:"China",crew:1,cruiseKMH:850,maxKMH:2330,hp:95,
  radarKM:200,trackCapacity:20,engageCapacity:6,
  stealth:false,rcs:3,combatRadiusKM:650,ecm:70,
  compatibleWeapons:["pl15","pl10"],
  defaultLoadout:[{id:"pl15",count:4},{id:"pl10",count:2}]
};

// ---- J-16 ----
const J16_DATA = {
  id:"j16",name:"J-16",role:"multirole",
  faction:"China",crew:2,cruiseKMH:850,maxKMH:2500,hp:110,
  radarKM:250,trackCapacity:30,engageCapacity:6,
  stealth:false,rcs:5,combatRadiusKM:1000,ecm:75,
  compatibleWeapons:["pl15","pl10","yj12"],
  defaultLoadout:[{id:"pl15",count:4},{id:"pl10",count:2},{id:"yj12",count:2}]
};

// ---- J-20 ----
const J20_DATA = {
  id:"j20",name:"J-20",role:"stealth_fighter",
  faction:"China",crew:1,cruiseKMH:900,maxKMH:2100,hp:110,
  radarKM:300,trackCapacity:60,engageCapacity:8,
  stealth:true,rcs:0.05,combatRadiusKM:1200,ecm:85,
  compatibleWeapons:["pl15","pl10"],
  defaultLoadout:[{id:"pl15",count:6}]
};

// ---- BOMBERS ----
const B52_DATA = {id:"b52",name:"B-52 Stratofortress",role:"bomber",faction:"USA",crew:5,cruiseKMH:820,maxKMH:1047,hp:250,radarKM:150,ecm:45,compatibleWeapons:["agm158","agm158c","tomahawk","gbu31"],defaultLoadout:[{id:"agm158",count:4}]};
const B1B_DATA = {id:"b1b",name:"B-1B Lancer",role:"bomber",faction:"USA",crew:4,cruiseKMH:1050,maxKMH:1335,hp:200,radarKM:180,ecm:50,compatibleWeapons:["agm158","agm158c","gbu31"],defaultLoadout:[{id:"agm158",count:6}]};
const B2_DATA = {id:"b2",name:"B-2 Spirit",role:"stealth_bomber",faction:"USA",crew:2,cruiseKMH:900,maxKMH:1010,hp:180,radarKM:120,stealth:true,rcs:0.0001,ecm:55,compatibleWeapons:["agm158","gbu31","gbu57"],defaultLoadout:[{id:"gbu31",count:8}]};
const TU95_DATA = {id:"tu95",name:"Tu-95 Bear",role:"bomber",faction:"Russia",crew:7,cruiseKMH:720,maxKMH:920,hp:270,radarKM:100,ecm:30,compatibleWeapons:["kh101","kh55"],defaultLoadout:[{id:"kh101",count:4}]};
const TU160_DATA = {id:"tu160",name:"Tu-160 Blackjack",role:"bomber",faction:"Russia",crew:4,cruiseKMH:1200,maxKMH:2200,hp:240,radarKM:150,ecm:45,compatibleWeapons:["kh101","kh102"],defaultLoadout:[{id:"kh101",count:6}]};
const H6K_DATA = {id:"h6k",name:"H-6K",role:"bomber",faction:"China",crew:4,cruiseKMH:800,maxKMH:1050,hp:220,radarKM:120,ecm:35,compatibleWeapons:["cj10","yj12"],defaultLoadout:[{id:"cj10",count:4}]};

// ---- FRENCH/UK AIRCRAFT ----
const RAFALE_C_DATA = {id:"rafale_c",name:"Rafale C",role:"multirole",faction:"France",crew:1,cruiseKMH:950,maxKMH:1912,hp:110,radarKM:250,trackCapacity:40,engageCapacity:8,stealth:false,rcs:1,combatRadiusKM:1850,ecm:95,compatibleWeapons:["meteor","exocet"],defaultLoadout:[{id:"meteor",count:4},{id:"exocet",count:2}]};
const RAFALE_M_DATA = {id:"rafale_m",name:"Rafale M",role:"carrier_fighter",faction:"France",crew:1,cruiseKMH:950,maxKMH:1912,hp:110,radarKM:250,trackCapacity:40,engageCapacity:8,stealth:false,rcs:1,combatRadiusKM:1800,ecm:90,compatibleWeapons:["meteor","exocet"],defaultLoadout:[{id:"meteor",count:4}]};
const MIRAGE2000_5_DATA = {id:"mirage2000_5",name:"Mirage 2000-5",role:"fighter",faction:"France",crew:1,cruiseKMH:900,maxKMH:2336,hp:95,radarKM:150,trackCapacity:20,engageCapacity:6,stealth:false,rcs:3,combatRadiusKM:740,ecm:70,compatibleWeapons:["meteor"],defaultLoadout:[{id:"meteor",count:4}]};
const MIRAGE2000D_DATA = {id:"mirage2000d",name:"Mirage 2000D",role:"strike",faction:"France",crew:2,cruiseKMH:900,maxKMH:2336,hp:100,radarKM:120,trackCapacity:16,engageCapacity:4,stealth:false,rcs:5,combatRadiusKM:1500,ecm:60,compatibleWeapons:["storm_shadow"],defaultLoadout:[{id:"storm_shadow",count:2}]};
const E2C_DATA = {id:"e2c",name:"E-2C Hawkeye",role:"awacs",faction:"USA",crew:5,cruiseKMH:540,maxKMH:650,hp:120,radarKM:550,ecm:85,compatibleWeapons:[],defaultLoadout:[]};
const A330MRTT_DATA = {id:"a330mrtt",name:"A330 MRTT Phenix",role:"tanker",faction:"France",crew:3,cruiseKMH:880,maxKMH:913,hp:150,radarKM:60,ecm:30,fuelTransferKG:111000,compatibleWeapons:[],defaultLoadout:[]};
const ATLANTIQUE2_DATA = {id:"atl2",name:"Atlantique 2",role:"maritime_patrol",faction:"France",crew:10,cruiseKMH:650,maxKMH:690,hp:130,radarKM:300,ecm:65,compatibleWeapons:["exocet"],defaultLoadout:[{id:"exocet",count:2}]};
const ALPHAJET_DATA = {id:"alphajet",name:"Alpha Jet",role:"trainer_attack",faction:"France",crew:2,cruiseKMH:700,maxKMH:1000,hp:70,radarKM:30,ecm:20,compatibleWeapons:[],defaultLoadout:[]};
const TIGER_HAD_DATA = {id:"tiger_had",name:"Tiger HAD",role:"attack_helicopter",faction:"France",crew:2,cruiseKMH:260,maxKMH:315,hp:80,radarKM:30,ecm:40,compatibleWeapons:[],defaultLoadout:[]};
const NH90_DATA = {id:"nh90",name:"NH90 Caiman",role:"utility_helicopter",faction:"France/Italy",crew:2,cruiseKMH:260,maxKMH:300,hp:90,radarKM:60,ecm:35,compatibleWeapons:[],defaultLoadout:[]};

// ---- NEW AIRCRAFT ----
const F15EX_DATA = {id:"f15ex",name:"F-15EX Eagle II",role:"fighter",faction:"USA",crew:2,cruiseKMH:920,maxKMH:2650,hp:120,radarKM:300,combatRadiusKM:2200,ecm:80,compatibleWeapons:["aim120d","aim9x","agm88g","jassm_er"],defaultLoadout:[{id:"aim120d",count:6},{id:"jassm_er",count:4}]};
const RAFALE_F4_DATA = {id:"rafale_f4",name:"Rafale F4",role:"multirole",faction:"France",crew:1,cruiseKMH:900,maxKMH:1910,hp:120,radarKM:250,combatRadiusKM:1000,ecm:95,compatibleWeapons:["meteor","mica_ng","storm_shadow"],defaultLoadout:[{id:"meteor",count:4},{id:"mica_ng",count:2}]};
const KF21_DATA = {id:"kf21",name:"KF-21 Boramae",role:"fighter",faction:"South Korea",crew:1,cruiseKMH:900,maxKMH:2200,hp:110,radarKM:250,combatRadiusKM:1200,ecm:75,compatibleWeapons:["meteor","aim120d","iris_t"],defaultLoadout:[{id:"meteor",count:4},{id:"aim120d",count:2}]};
const B21_DATA = {id:"b21",name:"B-21 Raider",role:"stealth_bomber",faction:"USA",crew:2,cruiseKMH:900,maxKMH:1050,hp:220,radarKM:80,ecm:98,stealth:true,rcs:0.00001,combatRadiusKM:9300,compatibleWeapons:["jassm_er","agm158","gbu57"],defaultLoadout:[{id:"jassm_er",count:6}]};
const AC130J_DATA = {id:"ac130j",name:"AC-130J Ghostrider",role:"gunship",faction:"USA",crew:13,cruiseKMH:540,maxKMH:600,hp:220,radarKM:120,ecm:60,compatibleWeapons:["agm114r","gbu31"],defaultLoadout:[{id:"agm114r",count:8}]};
const MQ28_DATA = {id:"mq28",name:"MQ-28 Ghost Bat",role:"ucav",faction:"USA",crew:0,cruiseKMH:800,maxKMH:950,hp:70,radarKM:150,ecm:85,stealth:true,rcs:0.001,combatRadiusKM:2500,compatibleWeapons:["aim120d","gbu39"],defaultLoadout:[{id:"aim120d",count:4}]};
const E8C_DATA = {id:"e8c",name:"E-8C JSTARS",role:"recon",faction:"USA",crew:21,cruiseKMH:850,maxKMH:900,hp:180,radarKM:550,ecm:85,trackTargets:1000,compatibleWeapons:[],defaultLoadout:[]};
const MC130J_DATA = {id:"mc130j",name:"MC-130J Commando II",role:"special_ops",faction:"USA",crew:7,cruiseKMH:650,maxKMH:700,hp:180,radarKM:80,ecm:70,compatibleWeapons:[],defaultLoadout:[]};
const C17_DATA = {id:"c17",name:"C-17 Globemaster III",role:"transport",faction:"USA",crew:3,cruiseKMH:830,maxKMH:950,hp:250,radarKM:60,ecm:40,payloadKG:77000,compatibleWeapons:[],defaultLoadout:[]};
const E2D_DATA = {id:"e2d",name:"E-2D Hawkeye",role:"awacs",faction:"USA",crew:5,cruiseKMH:650,maxKMH:700,hp:160,radarKM:550,ecm:90,trackTargets:2000,compatibleWeapons:[],defaultLoadout:[]};
const V22_DATA = {id:"v22",name:"V-22 Osprey",role:"tiltrotor",faction:"USA",crew:4,cruiseKMH:510,maxKMH:565,hp:140,radarKM:30,ecm:45,troopCapacity:24,rangeKM:1600,compatibleWeapons:[],defaultLoadout:[]};
const SHAHED149_DATA = {id:"shahed149",name:"Shahed-149 Gaza",role:"ucav",faction:"Iran",crew:0,cruiseKMH:350,maxKMH:400,hp:80,radarKM:120,ecm:30,combatRadiusKM:5000,enduranceHours:35,compatibleWeapons:["qaem","almas"],defaultLoadout:[{id:"qaem",count:4}]};
const MOHAJER6_DATA = {id:"mohajer6",name:"Mohajer-6",role:"ucav",faction:"Iran",crew:0,cruiseKMH:200,maxKMH:250,hp:60,radarKM:70,ecm:25,combatRadiusKM:2000,enduranceHours:12,compatibleWeapons:["qaem"],defaultLoadout:[{id:"qaem",count:2}]};
const ABABIL3_DATA = {id:"ababil3",name:"Ababil-3",role:"recon_drone",faction:"Iran",crew:0,cruiseKMH:180,maxKMH:200,hp:40,radarKM:60,ecm:20,enduranceHours:8,compatibleWeapons:[],defaultLoadout:[]};
const SAMAD3_DATA = {id:"samad3",name:"Samad-3",role:"strike_drone",faction:"Iran",crew:0,cruiseKMH:200,maxKMH:250,hp:45,radarKM:30,ecm:15,rangeKM:1800,damage:180,compatibleWeapons:[],defaultLoadout:[]};
const WINGLOONG2_DATA = {id:"wing_loong_ii",name:"Wing Loong II",role:"ucav",faction:"China",crew:0,cruiseKMH:370,maxKMH:400,hp:80,radarKM:80,ecm:60,enduranceHours:20,compatibleWeapons:[],defaultLoadout:[]};

// ======================================================
// 10 NEW AIRCRAFT ADDITIONS
// ======================================================

// ---- Su-57E (Export Felon) ----
const SU57E_DATA = {id:"su57e",name:"Su-57E Felon (Export)",role:"stealth_fighter",faction:"Russia",crew:1,cruiseKMH:950,maxKMH:2600,hp:115,radarKM:320,stealth:true,rcs:0.15,combatRadiusKM:1400,ecm:85,compatibleWeapons:["r77m","r74m","kh59"],defaultLoadout:[{id:"r77m",count:4},{id:"r74m",count:2}]};

// ---- MiG-35 Fulcrum-F ----
const MIG35_DATA = {id:"mig35",name:"MiG-35 Fulcrum-F",role:"fighter",faction:"Russia",crew:1,cruiseKMH:950,maxKMH:2400,hp:105,radarKM:200,stealth:false,rcs:5,combatRadiusKM:900,ecm:70,compatibleWeapons:["r77","r73","kh35"],defaultLoadout:[{id:"r77",count:4},{id:"r73",count:2}]};

// ---- Su-34 Fullback ----
const SU34_DATA = {id:"su34",name:"Su-34 Fullback",role:"strike",faction:"Russia",crew:2,cruiseKMH:900,maxKMH:1900,hp:130,radarKM:210,stealth:false,rcs:15,combatRadiusKM:1500,ecm:60,compatibleWeapons:["kh31","kh59","gbu31"],defaultLoadout:[{id:"kh31",count:4},{id:"kh59",count:2}]};

// ---- Tejas Mk2 ----
const TEJAS_MK2_DATA = {id:"tejas_mk2",name:"Tejas Mk2",role:"fighter",faction:"India",crew:1,cruiseKMH:850,maxKMH:2200,hp:95,radarKM:160,stealth:false,rcs:2,combatRadiusKM:600,ecm:70,compatibleWeapons:["r77","r73","derby"],defaultLoadout:[{id:"r77",count:4},{id:"derby",count:2}]};

// ---- JAS-39E Gripen NG ----
const JAS39E_DATA = {id:"jas39e",name:"JAS-39E Gripen NG",role:"multirole",faction:"Sweden",crew:1,cruiseKMH:850,maxKMH:2200,hp:110,radarKM:240,stealth:false,rcs:0.5,combatRadiusKM:900,ecm:88,compatibleWeapons:["meteor","iris_t","rbs15"],defaultLoadout:[{id:"meteor",count:4},{id:"iris_t",count:2}]};

// ---- F-15E 2026 Advanced ----
const F15E_2026_DATA = {id:"f15e_2026",name:"F-15E 2026 Advanced",role:"strike",faction:"USA",crew:2,cruiseKMH:920,maxKMH:2700,hp:125,radarKM:320,stealth:false,rcs:8,combatRadiusKM:1400,ecm:82,compatibleWeapons:["aim120d","aim9x","jassm_er","agm158c","gbu31"],defaultLoadout:[{id:"aim120d",count:4},{id:"jassm_er",count:4}]};

// ---- JH-7A ----
const JH7A_DATA = {id:"jh7a",name:"JH-7A",role:"strike",faction:"China",crew:2,cruiseKMH:850,maxKMH:2200,hp:105,radarKM:140,stealth:false,rcs:10,combatRadiusKM:800,ecm:50,compatibleWeapons:["yj12","gbu31","pl10"],defaultLoadout:[{id:"yj12",count:4},{id:"gbu31",count:2}]};

// ---- Mirage 4000 ----
const MIRAGE4000_DATA = {id:"mirage4000",name:"Mirage 4000",role:"fighter",faction:"France",crew:1,cruiseKMH:950,maxKMH:2445,hp:120,radarKM:260,stealth:false,rcs:2,combatRadiusKM:1400,ecm:88,compatibleWeapons:["meteor","storm_shadow","mica"],defaultLoadout:[{id:"meteor",count:4},{id:"mica",count:2}]};

// ---- F-14D Tomcat ----
const F14D_DATA = {id:"f14d",name:"F-14D Tomcat",role:"interceptor",faction:"USA",crew:2,cruiseKMH:850,maxKMH:2485,hp:115,radarKM:280,stealth:false,rcs:8,combatRadiusKM:1000,ecm:70,compatibleWeapons:["aim54","aim120d","aim9x"],defaultLoadout:[{id:"aim120d",count:4},{id:"aim54",count:2},{id:"aim9x",count:2}]};

// ---- AV-8B+ Harrier II Plus ----
const AV8B_PLUS_DATA = {id:"av8b_plus",name:"AV-8B+ Harrier II Plus",role:"cas",faction:"USA",crew:1,cruiseKMH:650,maxKMH:1083,hp:105,radarKM:140,stealth:false,rcs:6,combatRadiusKM:550,ecm:50,compatibleWeapons:["aim120d","aim9x","agm65","gbu31"],defaultLoadout:[{id:"aim120d",count:2},{id:"agm65",count:4},{id:"gbu31",count:2}]};

// ======================================================
// SUPPORT AIRCRAFT (Tankers, AWACS, Maritime Patrol)
// ======================================================
const KC135_DATA = {id:"kc135",name:"KC-135 Stratotanker",role:"tanker",faction:"USA",crew:3,cruiseKMH:850,maxKMH:933,hp:180,radarKM:60,ecm:30,fuelTransferKG:90000,compatibleWeapons:[],defaultLoadout:[]};
const KC46_DATA = {id:"kc46",name:"KC-46 Pegasus",role:"tanker",faction:"USA",crew:3,cruiseKMH:850,maxKMH:914,hp:190,radarKM:70,ecm:35,fuelTransferKG:96000,compatibleWeapons:[],defaultLoadout:[]};
const E3_DATA = {id:"e3",name:"E-3 Sentry AWACS",role:"awacs",faction:"USA",crew:17,cruiseKMH:850,maxKMH:850,hp:200,radarKM:650,ecm:90,compatibleWeapons:[],defaultLoadout:[]};
const E7_DATA = {id:"e7",name:"E-7 Wedgetail",role:"awacs",faction:"USA",crew:10,cruiseKMH:750,maxKMH:850,hp:180,radarKM:650,ecm:92,compatibleWeapons:[],defaultLoadout:[]};
const P8_DATA = {id:"p8",name:"P-8 Poseidon",role:"maritime_patrol",faction:"USA",crew:9,cruiseKMH:815,maxKMH:907,hp:190,radarKM:550,ecm:75,compatibleWeapons:["harpoon","mk54"],defaultLoadout:[{id:"harpoon",count:4}]};

// ======================================================
// 5 NEW UKRAINE/RUSSIA AIRCRAFT & DRONES
// ======================================================

// ---- Su-25 Frogfoot (Ukraine/Russia) ----
const SU25_DATA = {id:"su25",name:"Su-25 Frogfoot",role:"cas",faction:"Russia/Ukraine",crew:1,cruiseKMH:750,maxKMH:975,hp:160,radarKM:30,stealth:false,rcs:15,combatRadiusKM:750,ecm:30,compatibleWeapons:["kh29","kh25","r73"],defaultLoadout:[{id:"kh29",count:4},{id:"r73",count:2}]};

// ---- Bayraktar TB2 (Ukraine/Turkey) ----
const TB2_DATA = {id:"tb2",name:"Bayraktar TB2",role:"ucav",faction:"Ukraine/Turkey",crew:0,cruiseKMH:130,maxKMH:220,hp:40,radarKM:20,stealth:false,rcs:5,combatRadiusKM:300,ecm:20,enduranceHours:27,compatibleWeapons:["mam_c","mam_l"],defaultLoadout:[{id:"mam_c",count:2}]};

// ---- Lancet-3 Loitering Munition (Russia) ----
const LANCET3_DATA = {id:"lancet3",name:"Lancet-3",role:"loitering",faction:"Russia",crew:0,cruiseKMH:80,maxKMH:130,hp:15,radarKM:10,stealth:false,rcs:1,combatRadiusKM:70,ecm:5,enduranceHours:1,rangeKM:70,damage:150,compatibleWeapons:[],defaultLoadout:[]};

// ---- MiG-29S Fulcrum (Ukraine) ----
const MIG29S_DATA = {id:"mig29s",name:"MiG-29S Fulcrum (UA)",role:"fighter",faction:"Ukraine",crew:1,cruiseKMH:900,maxKMH:2400,hp:95,radarKM:180,stealth:false,rcs:5,combatRadiusKM:700,ecm:55,compatibleWeapons:["r77","r73","kh29"],defaultLoadout:[{id:"r77",count:4},{id:"r73",count:2},{id:"kh29",count:2}]};

// ---- Su-34 Fullback (Russia) ----
const SU34_FB_DATA = {id:"su34_fb",name:"Su-34 Fullback",role:"strike",faction:"Russia",crew:2,cruiseKMH:900,maxKMH:1900,hp:130,radarKM:210,stealth:false,rcs:15,combatRadiusKM:1500,ecm:60,compatibleWeapons:["kh31","kh59","gbu31","r77","r73"],defaultLoadout:[{id:"kh31",count:4},{id:"kh59",count:2},{id:"r77",count:2},{id:"r73",count:2}]};

// ======================================================
// 5 MORE NEW AIRCRAFT & DRONES
// ======================================================

// ---- Su-27 Flanker ----
const SU27_DATA = {id:"su27",name:"Su-27 Flanker",role:"fighter",faction:"Russia/Ukraine",crew:1,cruiseKMH:900,maxKMH:2500,hp:100,radarKM:240,stealth:false,rcs:10,combatRadiusKM:1300,ecm:70,compatibleWeapons:["r77","r73","kh31"],defaultLoadout:[{id:"r77",count:6},{id:"r73",count:2}]};

// ---- MQ-9 Reaper ----
const MQ9_REAPER_DATA = {id:"mq9_reaper",name:"MQ-9 Reaper",role:"ucav",faction:"Ukraine/USA",crew:0,cruiseKMH:200,maxKMH:480,hp:50,radarKM:100,stealth:false,rcs:8,combatRadiusKM:1500,ecm:65,enduranceHours:27,compatibleWeapons:["agm114r","gbu31"],defaultLoadout:[{id:"agm114r",count:4},{id:"gbu31",count:2}]};

// ---- Orlan-10 Recon Drone ----
const ORLAN10_DATA = {id:"orlan10",name:"Orlan-10",role:"recon_drone",faction:"Russia",crew:0,cruiseKMH:90,maxKMH:150,hp:20,radarKM:50,stealth:false,rcs:0.5,combatRadiusKM:150,ecm:5,enduranceHours:14,compatibleWeapons:[],defaultLoadout:[]};

// ---- Yak-130 ----
const YAK130_DATA = {id:"yak130",name:"Yak-130 Mitten",role:"trainer_attack",faction:"Russia",crew:2,cruiseKMH:800,maxKMH:1060,hp:70,radarKM:30,stealth:false,rcs:8,combatRadiusKM:550,ecm:40,compatibleWeapons:["r73","kh29"],defaultLoadout:[{id:"r73",count:2},{id:"kh29",count:2}]};

// ---- Ka-52 Alligator ----
const KA52_DATA = {id:"ka52",name:"Ka-52 Alligator",role:"attack_helicopter",faction:"Russia",crew:2,cruiseKMH:260,maxKMH:310,hp:70,radarKM:40,stealth:false,rcs:6,combatRadiusKM:250,ecm:65,compatibleWeapons:["kh25","r73"],defaultLoadout:[{id:"kh25",count:4},{id:"r73",count:2}]};

// ======================================================
// WEAPONS DATABASE — damage, rangeKM, guidance, hitProb, mach
// ======================================================
const WEAPONS_DB = {
  aim120c:{id:"aim120c",name:"AIM-120C AMRAAM",type:"air_to_air",damage:85,rangeKM:160,guidance:"Active Radar",hitProb:0.82,mach:4.0},
  aim120d:{id:"aim120d",name:"AIM-120D AMRAAM",type:"air_to_air",damage:90,rangeKM:180,guidance:"Active Radar",hitProb:0.85,mach:4.2},
  aim9x:{id:"aim9x",name:"AIM-9X Sidewinder",type:"air_to_air",damage:70,rangeKM:35,guidance:"Infrared",hitProb:0.88,mach:2.5},
  meteor:{id:"meteor",name:"Meteor",type:"air_to_air",damage:90,rangeKM:200,guidance:"Active Radar",hitProb:0.86,mach:4.5},
  iris_t:{id:"iris_t",name:"IRIS-T",type:"air_to_air",damage:72,rangeKM:30,guidance:"Infrared",hitProb:0.88,mach:3.0},
  r77:{id:"r77",name:"R-77",type:"air_to_air",damage:75,rangeKM:110,guidance:"Active Radar",hitProb:0.78,mach:3.5},
  r73:{id:"r73",name:"R-73 Archer",type:"air_to_air",damage:65,rangeKM:30,guidance:"Infrared",hitProb:0.85,mach:2.5},
  r37m:{id:"r37m",name:"R-37M",type:"air_to_air",damage:95,rangeKM:300,guidance:"Active Radar",hitProb:0.72,mach:6.0},
  r77m:{id:"r77m",name:"R-77M",type:"air_to_air",damage:80,rangeKM:120,guidance:"Active Radar",hitProb:0.80,mach:4.0},
  r74m:{id:"r74m",name:"R-74M",type:"air_to_air",damage:68,rangeKM:40,guidance:"Infrared",hitProb:0.86,mach:2.8},
  pl15:{id:"pl15",name:"PL-15",type:"air_to_air",damage:88,rangeKM:200,guidance:"Active Radar",hitProb:0.83,mach:4.5},
  pl10:{id:"pl10",name:"PL-10",type:"air_to_air",damage:65,rangeKM:30,guidance:"Infrared",hitProb:0.87,mach:3.0},
  derby:{id:"derby",name:"Derby",type:"air_to_air",damage:75,rangeKM:60,guidance:"Active Radar",hitProb:0.80,mach:3.5},
  python5:{id:"python5",name:"Python-5",type:"air_to_air",damage:75,rangeKM:30,guidance:"Infrared",hitProb:0.90,mach:3.0},
  
  jassm_er:{id:"jassm_er",name:"AGM-158B JASSM-ER",type:"air_to_ground",damage:350,rangeKM:925,guidance:"GPS+INS",hitProb:0.96,stealth:true,mach:0.8},
  agm158:{id:"agm158",name:"AGM-158 JASSM",type:"air_to_ground",damage:220,rangeKM:370,guidance:"GPS+INS",hitProb:0.91,stealth:true,mach:0.8},
  agm154:{id:"agm154",name:"AGM-154 JSOW",type:"air_to_ground",damage:180,rangeKM:130,guidance:"GPS",hitProb:0.85,glide:true,mach:0.6},
  gbu31:{id:"gbu31",name:"GBU-31 JDAM",type:"air_to_ground",damage:250,rangeKM:28,guidance:"GPS",hitProb:0.95,freefall:true,mach:0.3},
  gbu39:{id:"gbu39",name:"GBU-39 SDB",type:"air_to_ground",damage:90,rangeKM:110,guidance:"GPS",hitProb:0.90,glide:true,mach:0.5},
  agm65:{id:"agm65",name:"AGM-65 Maverick",type:"air_to_ground",damage:200,rangeKM:27,guidance:"IR/TV",hitProb:0.84,mach:1.2},
  kh59:{id:"kh59",name:"Kh-59MK2",type:"air_to_ground",damage:200,rangeKM:290,guidance:"GPS+TV",hitProb:0.80,mach:0.8},
  kh29:{id:"kh29",name:"Kh-29",type:"air_to_ground",damage:180,rangeKM:30,guidance:"TV/Laser",hitProb:0.78,mach:1.5},
  kh31:{id:"kh31",name:"Kh-31",type:"air_to_ground",damage:160,rangeKM:110,guidance:"Active Radar",hitProb:0.76,mach:3.0},
  kh101:{id:"kh101",name:"Kh-101",type:"air_to_ground",damage:400,rangeKM:3000,guidance:"GPS+INS",hitProb:0.88,stealth:true,mach:0.8},
  kh102:{id:"kh102",name:"Kh-102",type:"air_to_ground",damage:500,rangeKM:3000,guidance:"GPS+INS",hitProb:0.85,stealth:true,mach:0.7},
  kh55:{id:"kh55",name:"Kh-55",type:"air_to_ground",damage:350,rangeKM:2500,guidance:"GPS+INS",hitProb:0.82,mach:0.8},
  tomahawk:{id:"tomahawk",name:"Tomahawk",type:"air_to_ground",damage:450,rangeKM:1600,guidance:"GPS+DSMAC",hitProb:0.88,cruise:true,mach:0.8},
  storm_shadow:{id:"storm_shadow",name:"Storm Shadow",type:"air_to_ground",damage:250,rangeKM:250,guidance:"GPS+INS",hitProb:0.85,stealth:true,mach:0.8},
  brimstone:{id:"brimstone",name:"Brimstone",type:"air_to_ground",damage:120,rangeKM:60,guidance:"MMW Radar",hitProb:0.92,mach:1.3},
  cj10:{id:"cj10",name:"CJ-10",type:"air_to_ground",damage:400,rangeKM:1500,guidance:"GPS+INS",hitProb:0.85,cruise:true,mach:0.8},
  yj12:{id:"yj12",name:"YJ-12",type:"air_to_ground",damage:250,rangeKM:400,guidance:"Active Radar",hitProb:0.82,mach:3.0},
  gbu57:{id:"gbu57",name:"GBU-57 MOP",type:"air_to_ground",damage:800,rangeKM:20,guidance:"GPS",hitProb:0.90,freefall:true,mach:0.3},
  
  agm88e:{id:"agm88e",name:"AGM-88E AARGM",type:"anti_radiation",damage:220,rangeKM:150,guidance:"Passive Radar",hitProb:0.95,pkRadar:95,mach:2},
  agm88g:{id:"agm88g",name:"AGM-88G AARGM-ER",type:"anti_radiation",damage:250,rangeKM:300,guidance:"Passive Radar",hitProb:0.98,pkRadar:98,mach:4},
  kh31p:{id:"kh31p",name:"Kh-31P",type:"anti_radiation",damage:220,rangeKM:250,guidance:"Passive Radar",hitProb:0.90,pkRadar:90,mach:3.5},
  yj21:{id:"yj21",name:"YJ-21",type:"anti_ship",damage:700,rangeKM:1500,guidance:"Active Radar",hitProb:0.98,pkShip:98,mach:10},
  agm158c:{id:"agm158c",name:"AGM-158C LRASM",type:"anti_ship",damage:320,rangeKM:560,guidance:"AI+Passive",hitProb:0.88,stealth:true,mach:0.85},
  exocet:{id:"exocet",name:"Exocet",type:"anti_ship",damage:210,rangeKM:180,guidance:"Active Radar",hitProb:0.82,mach:0.93},
  harpoon:{id:"harpoon",name:"Harpoon",type:"anti_ship",damage:220,rangeKM:130,guidance:"Active Radar",hitProb:0.80,mach:0.85},
  rbs15:{id:"rbs15",name:"RBS-15",type:"anti_ship",damage:200,rangeKM:200,guidance:"Active Radar",hitProb:0.80,mach:0.9},
  mk54:{id:"mk54",name:"Mk54 Torpedo",type:"torpedo",damage:300,rangeKM:15,guidance:"Active Sonar",hitProb:0.82,underwater:true,mach:0.05},
  
  "40n6":{id:"40n6",name:"40N6 SAM",type:"surface_to_air",damage:100,rangeKM:380,hitProb:0.90,mach:5.5},
  "48n6":{id:"48n6",name:"48N6DM SAM",type:"surface_to_air",damage:85,rangeKM:250,hitProb:0.82,mach:5},
  "9m96e2":{id:"9m96e2",name:"9M96E2 SAM",type:"surface_to_air",damage:70,rangeKM:120,hitProb:0.78,mach:4},
  "9m100":{id:"9m100",name:"9M100 SAM",type:"surface_to_air",damage:50,rangeKM:40,hitProb:0.72,mach:3},
  "57e6":{id:"57e6",name:"57E6 SAM",type:"surface_to_air",damage:55,rangeKM:30,hitProb:0.65,mach:2},
  patriot:{id:"patriot",name:"PAC-3 MSE",type:"surface_to_air",damage:90,rangeKM:160,hitProb:0.88,mach:5},
  pac2:{id:"pac2",name:"PAC-2 SAM",type:"surface_to_air",damage:75,rangeKM:160,hitProb:0.75,mach:4.5},
  sm3:{id:"sm3",name:"SM-3",type:"abm",damage:120,rangeKM:500,exoatmospheric:true,hitProb:0.70,mach:5},
  sayyad4b:{id:"sayyad4b",name:"Sayyad-4B",type:"surface_to_air",damage:88,rangeKM:300,hitProb:0.78,mach:4.5},
  hq9:{id:"hq9",name:"HQ-9",type:"surface_to_air",damage:85,rangeKM:300,hitProb:0.82,mach:5.5},
  hq22:{id:"hq22",name:"HQ-22",type:"surface_to_air",damage:75,rangeKM:170,hitProb:0.78,mach:4.5},
  aster30:{id:"aster30",name:"Aster-30",type:"surface_to_air",damage:80,rangeKM:120,hitProb:0.85,mach:4.5},
  "9r31m":{id:"9r31m",name:"9R31M",type:"surface_to_air",damage:65,rangeKM:70,hitProb:0.72,mach:3},
  "9m338":{id:"9m338",name:"9M338",type:"surface_to_air",damage:55,rangeKM:16,hitProb:0.68,mach:2.5},
  
  trident:{id:"trident",name:"Trident II D5",type:"sub",damage:475,rangeKM:12000,ballistic:true,hitProb:0.85,mach:15},
  // === NEW WEAPONS ===
  kh25:{id:"kh25",name:"Kh-25ML",type:"air_to_ground",damage:200,rangeKM:25,guidance:"Laser",hitProb:0.82,mach:1.5},
  mam_c:{id:"mam_c",name:"MAM-C",type:"air_to_ground",damage:80,rangeKM:40,guidance:"Laser",hitProb:0.75,mach:0.6},
  mam_l:{id:"mam_l",name:"MAM-L",type:"air_to_ground",damage:120,rangeKM:60,guidance:"Laser",hitProb:0.78,mach:0.6},
  agm114r:{id:"agm114r",name:"AGM-114R Hellfire",type:"air_to_ground",damage:160,rangeKM:11,guidance:"Laser",hitProb:0.88,mach:1.3},
  mica_ng:{id:"mica_ng",name:"MICA NG",type:"air_to_air",damage:85,rangeKM:120,guidance:"Active Radar",hitProb:0.86,mach:4.5},
  kh35:{id:"kh35",name:"Kh-35U",type:"anti_ship",damage:220,rangeKM:300,guidance:"Active Radar",hitProb:0.80,mach:0.85},
  
  torp_mk48:{id:"torp_mk48",name:"Mk-48 Torpedo",type:"torpedo",damage:350,rangeKM:50,guidance:"Wire+Active",hitProb:0.80,underwater:true,mach:0.1},

  qaem:{id:"qaem",name:"Qaem-1",type:"air_to_ground",damage:120,rangeKM:12,guidance:"Laser",hitProb:0.78,mach:0.6},
  almas:{id:"almas",name:"Almas-1",type:"air_to_ground",damage:140,rangeKM:10,guidance:"Laser",hitProb:0.80,mach:0.7}
};