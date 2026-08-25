// ======================================================
// nationPacks.js — CHINA, TAIWAN, KOREA, JAPAN, ISRAEL, IRAN, TURKEY, PHILIPPINES, N.KOREA
// ======================================================

// ===================== CHINA 🇨🇳 =====================
const J20_MIGHTY = {id:"j20_mighty",name:"J-20 Mighty Dragon",role:"stealth_fighter",faction:"China",crew:1,cruiseKMH:900,maxKMH:2100,hp:120,radarKM:300,stealth:true,rcs:0.05,combatRadiusKM:1200,ecm:85,compatibleWeapons:["pl15","pl10","ls6"],defaultLoadout:[{id:"pl15",count:4},{id:"pl10",count:2}]};
const J35_FC31 = {id:"j35",name:"J-35 (FC-31)",role:"stealth_fighter",faction:"China",crew:1,cruiseKMH:850,maxKMH:2000,hp:110,radarKM:280,stealth:true,rcs:0.1,combatRadiusKM:800,ecm:80,compatibleWeapons:["pl15","pl10"],defaultLoadout:[{id:"pl15",count:4}]};
const J11B = {id:"j11b",name:"J-11B",role:"fighter",faction:"China",crew:1,cruiseKMH:850,maxKMH:2100,hp:105,radarKM:180,stealth:false,rcs:5,combatRadiusKM:900,ecm:65,compatibleWeapons:["pl12","pl15"],defaultLoadout:[{id:"pl12",count:4}]};
const J15 = {id:"j15",name:"J-15 Flying Shark",role:"fighter",faction:"China",crew:1,cruiseKMH:850,maxKMH:2100,hp:110,radarKM:180,stealth:false,rcs:8,combatRadiusKM:800,ecm:60,compatibleWeapons:["pl12","pl15","yj12"],defaultLoadout:[{id:"pl12",count:4}]};

// ===================== TAIWAN 🇹🇼 =====================
const F16V = {id:"f16v",name:"F-16V Viper",role:"multirole",faction:"Taiwan",crew:1,cruiseKMH:850,maxKMH:2100,hp:95,radarKM:200,stealth:false,rcs:1,combatRadiusKM:600,ecm:75,compatibleWeapons:["aim120d","agm88g","agm154"],defaultLoadout:[{id:"aim120d",count:4},{id:"agm88g",count:2}]};
const IDF = {id:"idf",name:"IDF Ching-Kuo",role:"fighter",faction:"Taiwan",crew:1,cruiseKMH:800,maxKMH:2000,hp:85,radarKM:150,stealth:false,rcs:3,combatRadiusKM:500,ecm:65,compatibleWeapons:["tc2","tc1"],defaultLoadout:[{id:"tc2",count:4}]};
const E2K = {id:"e2k",name:"E-2K Hawkeye",role:"awacs",faction:"Taiwan",crew:5,cruiseKMH:540,maxKMH:650,hp:120,radarKM:550,ecm:85,compatibleWeapons:[],defaultLoadout:[]};

// ===================== SOUTH KOREA 🇰🇷 =====================
const F15K = {id:"f15k",name:"F-15K Slam Eagle",role:"strike",faction:"South Korea",crew:2,cruiseKMH:900,maxKMH:2650,hp:120,radarKM:240,stealth:false,rcs:10,combatRadiusKM:1400,ecm:75,compatibleWeapons:["aim120d","agm158","agm158c"],defaultLoadout:[{id:"aim120d",count:4},{id:"agm158",count:2}]};
const FA50 = {id:"fa50",name:"FA-50 Golden Eagle",role:"fighter",faction:"South Korea",crew:2,cruiseKMH:850,maxKMH:1700,hp:85,radarKM:140,stealth:false,rcs:3,combatRadiusKM:500,ecm:60,compatibleWeapons:["aim9x","agm65","gbu31"],defaultLoadout:[{id:"aim9x",count:2},{id:"agm65",count:2}]};

// ===================== JAPAN 🇯🇵 =====================
const F15J = {id:"f15j",name:"F-15J Eagle",role:"fighter",faction:"Japan",crew:1,cruiseKMH:900,maxKMH:2650,hp:110,radarKM:220,stealth:false,rcs:10,combatRadiusKM:1200,ecm:70,compatibleWeapons:["aim120d","aim9x"],defaultLoadout:[{id:"aim120d",count:4}]};
const F2A = {id:"f2a",name:"F-2A",role:"multirole",faction:"Japan",crew:1,cruiseKMH:850,maxKMH:2200,hp:95,radarKM:180,stealth:false,rcs:3,combatRadiusKM:700,ecm:65,compatibleWeapons:["aim120d","aim9x","harpoon"],defaultLoadout:[{id:"aim120d",count:4}]};
const P1 = {id:"p1",name:"P-1 Maritime Patrol",role:"maritime_patrol",faction:"Japan",crew:10,cruiseKMH:815,maxKMH:900,hp:160,radarKM:500,ecm:75,compatibleWeapons:["harpoon","mk54"],defaultLoadout:[{id:"harpoon",count:4}]};

// ===================== ISRAEL 🇮🇱 =====================
const F35I = {id:"f35i",name:"F-35I Adir",role:"stealth_multirole",faction:"Israel",crew:1,cruiseKMH:850,maxKMH:1970,hp:120,radarKM:220,stealth:true,rcs:0.001,combatRadiusKM:1200,ecm:96,compatibleWeapons:["aim120d","aim9x","gbu31"],defaultLoadout:[{id:"aim120d",count:4}]};
const F15I = {id:"f15i",name:"F-15I Ra'am",role:"strike",faction:"Israel",crew:2,cruiseKMH:900,maxKMH:2650,hp:120,radarKM:210,stealth:false,rcs:10,combatRadiusKM:1400,ecm:75,compatibleWeapons:["aim120d","aim9x","agm158","gbu31"],defaultLoadout:[{id:"aim120d",count:4},{id:"gbu31",count:4}]};
const F16I = {id:"f16i",name:"F-16I Sufa",role:"multirole",faction:"Israel",crew:1,cruiseKMH:850,maxKMH:2100,hp:100,radarKM:180,stealth:false,rcs:1,combatRadiusKM:600,ecm:70,compatibleWeapons:["aim120d","aim9x","agm65","gbu31"],defaultLoadout:[{id:"aim120d",count:4},{id:"aim9x",count:2}]};
const G550 = {id:"g550",name:"G550 CAEW",role:"awacs",faction:"Israel",crew:12,cruiseKMH:750,maxKMH:850,hp:180,radarKM:900,ecm:95,compatibleWeapons:[],defaultLoadout:[]};
const HERON_TP = {id:"herontp",name:"Heron TP",role:"ucav",faction:"Israel",crew:0,cruiseKMH:350,maxKMH:400,hp:140,radarKM:300,ecm:60,stealth:true,rcs:0.5,compatibleWeapons:["aim9x"],defaultLoadout:[]};

// ===================== IRAN 🇮🇷 =====================
const F14_IRAN = {id:"f14_iran",name:"F-14A Tomcat (Iran)",role:"interceptor",faction:"Iran",crew:2,cruiseKMH:850,maxKMH:2410,hp:110,radarKM:200,stealth:false,rcs:10,combatRadiusKM:800,ecm:50,compatibleWeapons:["aim54","aim9x"],defaultLoadout:[{id:"aim54",count:4}]};
const F4_IRAN = {id:"f4_iran",name:"F-4E Phantom (Iran)",role:"fighter",faction:"Iran",crew:2,cruiseKMH:800,maxKMH:2300,hp:105,radarKM:120,stealth:false,rcs:12,combatRadiusKM:600,ecm:25,compatibleWeapons:["aim9x","agm65","gbu31"],defaultLoadout:[{id:"aim9x",count:2},{id:"gbu31",count:4}]};
const SU24_IRAN = {id:"su24_iran",name:"Su-24MK Fencer",role:"strike",faction:"Iran",crew:2,cruiseKMH:900,maxKMH:2200,hp:120,radarKM:160,stealth:false,rcs:10,combatRadiusKM:1000,ecm:45,compatibleWeapons:["kh29","gbu31"],defaultLoadout:[{id:"kh29",count:4}]};

// ===================== TURKEY 🇹🇷 =====================
const TFX = {id:"tfx",name:"TF-X KAAN",role:"stealth_fighter",faction:"Turkey",crew:1,cruiseKMH:900,maxKMH:2400,hp:120,radarKM:280,stealth:true,rcs:0.05,combatRadiusKM:1200,ecm:88,compatibleWeapons:["aim120d","aim9x","gbu31"],defaultLoadout:[{id:"aim120d",count:6}]};
const HURJET = {id:"hurjet",name:"Hurjet",role:"fighter",faction:"Turkey",crew:1,cruiseKMH:850,maxKMH:1700,hp:85,radarKM:140,stealth:false,rcs:3,combatRadiusKM:500,ecm:60,compatibleWeapons:["aim9x","agm65"],defaultLoadout:[{id:"aim9x",count:2}]};
const TB2 = {id:"tb2",name:"Bayraktar TB2",role:"ucav",faction:"Turkey",crew:0,cruiseKMH:220,maxKMH:250,hp:80,radarKM:80,ecm:40,compatibleWeapons:[],defaultLoadout:[]};
const AKINCI = {id:"akinci",name:"Akinci UAV",role:"ucav",faction:"Turkey",crew:0,cruiseKMH:360,maxKMH:400,hp:120,radarKM:220,ecm:55,compatibleWeapons:[],defaultLoadout:[]};

// ===================== NORTH KOREA 🇰🇵 =====================
const MIG23ML = {id:"mig23ml",name:"MiG-23ML Flogger",role:"interceptor",faction:"North Korea",crew:1,cruiseKMH:900,maxKMH:2300,hp:85,radarKM:120,stealth:false,rcs:8,combatRadiusKM:700,ecm:40,compatibleWeapons:["r23","r60"],defaultLoadout:[{id:"r23",count:4}]};
const MIG21BIS = {id:"mig21bis",name:"MiG-21bis Fishbed",role:"fighter",faction:"North Korea",crew:1,cruiseKMH:800,maxKMH:2100,hp:75,radarKM:80,stealth:false,rcs:12,combatRadiusKM:400,ecm:25,compatibleWeapons:["r60"],defaultLoadout:[{id:"r60",count:2}]};
const SU25 = {id:"su25",name:"Su-25 Frogfoot",role:"cas",faction:"North Korea",crew:1,cruiseKMH:560,maxKMH:950,hp:180,radarKM:40,stealth:false,rcs:15,combatRadiusKM:350,ecm:20,compatibleWeapons:["agm65","gbu31"],defaultLoadout:[{id:"agm65",count:6}]};

// ===================== PHILIPPINES 🇵🇭 =====================
const FA50PH = {id:"fa50ph",name:"FA-50PH",role:"fighter",faction:"Philippines",crew:2,cruiseKMH:850,maxKMH:1700,hp:85,radarKM:140,stealth:false,rcs:3,combatRadiusKM:500,ecm:60,compatibleWeapons:["aim9x","agm65"],defaultLoadout:[{id:"aim9x",count:2}]};
const P3 = {id:"p3",name:"P-3 Orion",role:"maritime_patrol",faction:"Philippines",crew:9,cruiseKMH:750,maxKMH:800,hp:180,radarKM:350,ecm:60,compatibleWeapons:["harpoon","mk54"],defaultLoadout:[{id:"harpoon",count:2}]};