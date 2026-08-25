// ======================================================
// missiles.js — MISSILE DATABASE (COMPLETE)
// ======================================================
const MISSILE_DB = {
  // === A2A ===
  aim120c:{name:"AIM-120C AMRAAM",type:"a2a",range:160,damage:85,guidance:"Active Radar",mach:4.0,compatible:["f35a","f16","f15","f18","f22","eurofighter","gripen","rafale","fa18e"]},
  aim120d:{name:"AIM-120D AMRAAM",type:"a2a",range:180,damage:90,guidance:"Active Radar",mach:4.2,compatible:["f35a","f16","f15","f18","f22","fa18e","eurofighter"]},
  aim9x:{name:"AIM-9X Sidewinder",type:"a2a",range:35,damage:70,guidance:"Infrared",mach:2.5,compatible:["f35a","f16","f15","f18","f22","eurofighter","gripen","rafale","a10","av8b","f14"]},
  meteor:{name:"Meteor",type:"a2a",range:200,damage:90,guidance:"Active Radar",mach:4.5,compatible:["eurofighter","gripen","rafale"]},
  iris_t:{name:"IRIS-T",type:"a2a",range:30,damage:72,guidance:"Infrared",mach:3.0,compatible:["gripen","eurofighter"]},
  r77:{name:"R-77",type:"a2a",range:110,damage:75,guidance:"Active Radar",mach:3.5,compatible:["su35","su30sm","su57","mig29","mig31"]},
  r73:{name:"R-73 Archer",type:"a2a",range:30,damage:65,guidance:"Infrared",mach:2.5,compatible:["su35","su30sm","su57","mig29","mig31"]},
  r37m:{name:"R-37M",type:"a2a",range:300,damage:100,guidance:"Active Radar",mach:6.0,compatible:["mig31","su35","su57"]},
  r77m:{name:"R-77M",type:"a2a",range:200,damage:90,guidance:"Active Radar",mach:5.0,compatible:["su57","su35"]},
  r74m:{name:"R-74M",type:"a2a",range:40,damage:75,guidance:"Infrared",mach:2.8,compatible:["su57","su35"]},
  pl15:{name:"PL-15",type:"a2a",range:250,damage:95,guidance:"Active Radar",mach:4.5,compatible:["j20","j10c","j16"]},
  pl10:{name:"PL-10",type:"a2a",range:20,damage:70,guidance:"Infrared",mach:2.5,compatible:["j20","j10c","j16"]},
  mica:{name:"MICA",type:"a2a",range:80,damage:78,guidance:"Active Radar",mach:4.0,compatible:["rafale"]},
  aim54:{name:"AIM-54 Phoenix",type:"a2a",range:190,damage:95,guidance:"Active Radar",mach:5.0,compatible:["f14"]},
  derby:{name:"Derby",type:"a2a",range:60,damage:75,guidance:"Active Radar",mach:3.5,compatible:[]},
  python5:{name:"Python-5",type:"a2a",range:30,damage:75,guidance:"Infrared",mach:3.0,compatible:[]},

  // === A2G ===
  agm158:{name:"AGM-158 JASSM",type:"a2g",range:370,damage:220,guidance:"GPS+INS",stealth:true,mach:0.8,compatible:["f35a","f16","f15e","fa18e","b1b","b2","b52"]},
  agm154:{name:"AGM-154 JSOW",type:"a2g",range:130,damage:180,guidance:"GPS",glide:true,mach:0.6,compatible:["f35a","f16","f15e","fa18e","f22"]},
  gbu31:{name:"GBU-31 JDAM",type:"a2g",range:28,damage:250,guidance:"GPS",freefall:true,mach:0.3,compatible:["a10","f35a","f16","f15e","fa18e","f22","b1b","b2","b52","av8b","f4"]},
  gbu39:{name:"GBU-39 SDB",type:"a2g",range:110,damage:90,guidance:"GPS",glide:true,mach:0.5,compatible:["f35a","f15e","f22","b1b","b2"]},
  agm65:{name:"AGM-65 Maverick",type:"a2g",range:27,damage:200,guidance:"IR/TV",mach:1.2,compatible:["f16","f15e","fa18e","a10","av8b","f4"]},
  kh59:{name:"Kh-59MK2",type:"a2g",range:290,damage:200,guidance:"GPS+TV",mach:0.8,compatible:["su35","su30sm","su57","mig29"]},
  kh29:{name:"Kh-29",type:"a2g",range:30,damage:250,guidance:"TV/Laser",mach:1.5,compatible:["su30sm","su35","mig29"]},
  kh31:{name:"Kh-31",type:"a2g",range:160,damage:180,guidance:"Anti-Radiation",mach:3.5,compatible:["su30sm","su35","mig29"]},
  kh101:{name:"Kh-101",type:"a2g",range:4500,damage:450,guidance:"GPS+TERCOM",mach:0.8,compatible:["tu95","tu160"]},
  kh102:{name:"Kh-102",type:"a2g",range:4500,damage:600,guidance:"GPS+TERCOM",mach:0.8,compatible:["tu95","tu160"]},
  kh55:{name:"Kh-55",type:"a2g",range:2500,damage:350,guidance:"GPS+INS",mach:0.8,compatible:["tu95"]},
  tomahawk:{name:"Tomahawk",type:"a2g",range:1600,damage:450,guidance:"GPS+DSMAC",cruise:true,mach:0.8,compatible:["b52"]},
  storm_shadow:{name:"Storm Shadow",type:"a2g",range:560,damage:350,guidance:"GPS+Terrain",mach:0.8,compatible:["rafale","eurofighter"]},
  brimstone:{name:"Brimstone",type:"a2g",range:60,damage:120,guidance:"Millimeter Radar",mach:1.3,compatible:["eurofighter"]},
  cj10:{name:"CJ-10",type:"a2g",range:2000,damage:400,guidance:"GPS+Terrain",mach:0.8,compatible:["h6k"]},
  yj12:{name:"YJ-12",type:"a2g",range:400,damage:350,guidance:"Active Radar",mach:3.0,compatible:["h6k","j16"]},
  gbu57:{name:"GBU-57 MOP",type:"a2g",range:50,damage:1000,guidance:"GPS",freefall:true,mach:0.4,compatible:["b2"]},
  aasm:{name:"AASM",type:"a2g",range:60,damage:150,guidance:"GPS/Laser",mach:0.8,compatible:["rafale"]},

  // === ANTI-SHIP ===
  agm158c:{name:"AGM-158C LRASM",type:"a2s",range:560,damage:320,guidance:"AI+Passive",stealth:true,mach:0.85,compatible:["f35a","f15e","fa18e","b1b","b52"]},
  harpoon:{name:"Harpoon",type:"a2s",range:130,damage:220,guidance:"Active Radar",mach:0.85,compatible:["f16","fa18e","p8"]},
  exocet:{name:"Exocet",type:"a2s",range:180,damage:210,guidance:"Active Radar",mach:0.93,compatible:["rafale"]},
  rbs15:{name:"RBS-15",type:"a2s",range:200,damage:200,guidance:"Active Radar",mach:0.9,compatible:["gripen"]},

  // === TORPEDO ===
  mk54:{name:"Mk-54",type:"torpedo",range:28,damage:320,guidance:"Active/Passive Sonar",underwater:true,mach:0.08,compatible:["p8"]},
  torp_mk48:{name:"Mk-48 Torpedo",type:"torpedo",range:50,damage:350,guidance:"Wire+Active",underwater:true,mach:0.1,compatible:[]},

  // === SAM ===
  "40n6":{name:"40N6 SAM",type:"sam",range:380,damage:100,guidance:"Command+Radar",mach:5.5,compatible:["s400"]},
  "48n6":{name:"48N6DM SAM",type:"sam",range:250,damage:85,guidance:"Command",mach:5,compatible:["s300","s400"]},
  "9m96e2":{name:"9M96E2 SAM",type:"sam",range:120,damage:70,guidance:"Active Radar",mach:4,compatible:["s350","s400","pantsir"]},
  "9m100":{name:"9M100 SAM",type:"sam",range:40,damage:50,guidance:"Infrared",mach:3,compatible:["s350"]},
  "57e6":{name:"57E6 SAM",type:"sam",range:30,damage:55,guidance:"Command",mach:2,compatible:["pantsir","pantsir_iran"]},
  "57e6m":{name:"57E6M SAM",type:"sam",range:40,damage:65,guidance:"Command+Radar",mach:4,compatible:["pantsir_sm"]},
  aster30b1nt:{name:"Aster 30 B1NT",type:"sam",range:150,damage:95,guidance:"Active Radar",mach:4.5,compatible:["samp_t_ng"]},
  patriot:{name:"PAC-3 MSE",type:"sam",range:160,damage:90,guidance:"Command+Active",mach:5,compatible:["patriot"]},
  pac2:{name:"PAC-2 SAM",type:"sam",range:160,damage:75,guidance:"Command",mach:4.5,compatible:["patriot"]},
  sm3:{name:"SM-3",type:"abm",range:500,damage:120,guidance:"GPS+IR",exoatmospheric:true,mach:5,compatible:["thaad","aegis"]},
  sm6:{name:"SM-6",type:"abm",range:240,damage:100,guidance:"Active Radar",mach:4.5,compatible:["aegis"]},
  thaad_interceptor:{name:"THAAD",type:"abm",range:200,damage:150,guidance:"GPS+IR",exoatmospheric:true,mach:5,compatible:["thAad"]},
  sayyad4b:{name:"Sayyad-4B",type:"sam",range:300,damage:95,guidance:"Active Radar",mach:4.5,compatible:["bavar373"]},
  sayyad3:{name:"Sayyad-3",type:"sam",range:200,damage:85,guidance:"Active Radar",mach:5,compatible:["khordad15"]},
  taer2b:{name:"Taer-2B",type:"sam",range:105,damage:75,guidance:"Command",mach:4,compatible:["khordad3"]},
  taer:{name:"Taer",type:"sam",range:75,damage:65,guidance:"Command",mach:3.5,compatible:["tabas","raad"]},
  shahin:{name:"Shahin",type:"sam",range:45,damage:60,guidance:"Command",mach:3,compatible:["mersad"]},
  "9m331":{name:"9M331",type:"sam",range:12,damage:50,guidance:"Command",mach:2.5,compatible:["torm1_iran"]},
  hq9:{name:"HQ-9",type:"sam",range:250,damage:90,guidance:"Command+Radar",mach:4.5,compatible:["hq9"]},
  hq22:{name:"HQ-22",type:"sam",range:170,damage:85,guidance:"Semi Active Radar",mach:4,compatible:["hq22"]},
  hq16:{name:"HQ-16",type:"sam",range:70,damage:70,guidance:"Command",mach:3.5,compatible:["hq16"]},
  fk3:{name:"FK-3",type:"sam",range:100,damage:75,guidance:"Command",mach:4,compatible:["fk3"]},
  ks1c:{name:"KS-1C",type:"sam",range:70,damage:65,guidance:"Command",mach:3.5,compatible:["ks1c"]},
  aster30:{name:"Aster-30",type:"sam",range:120,damage:90,guidance:"Active Radar",mach:4.5,compatible:["samp_t"]},
  "9m317m":{name:"9M317M",type:"sam",range:70,damage:65,guidance:"Command",mach:3,compatible:["buk"]},
  "9m338":{name:"9M338",type:"sam",range:16,damage:75,guidance:"Command",mach:3,compatible:["tor"]},
  barak8:{name:"Barak-8",type:"sam",range:150,damage:85,guidance:"Active Radar",mach:4.5,compatible:["barak8"]},
  akashng:{name:"Akash NG",type:"sam",range:70,damage:65,guidance:"Command",mach:3.5,compatible:["akashng"]},
  stunner:{name:"Stunner",type:"sam",range:250,damage:90,guidance:"Active Radar",mach:4.5,compatible:["davidsling"]},
  arrow2:{name:"Arrow-2",type:"abm",range:500,damage:120,guidance:"GPS+IR",exoatmospheric:true,mach:5,compatible:["arrow2"]},
  arrow3:{name:"Arrow-3",type:"abm",range:2400,damage:200,guidance:"GPS+IR",exoatmospheric:true,mach:6,compatible:["arrow3"]},
  tamir:{name:"Tamir",type:"sam",range:70,damage:60,guidance:"Active Radar",mach:3,compatible:["irondome"]},
  khalij_fars_missile:{name:"Khalij Fars",type:"coastal",range:300,damage:400,guidance:"Anti-Ship",mach:4,compatible:["khalij_fars"]},
  hormuz2_missile:{name:"Hormuz-2",type:"coastal",range:300,damage:400,guidance:"Anti-Ship",mach:4,compatible:["hormuz2"]},

  // === MISSING SAM MISSILES ===
  camm:{name:"CAMM",type:"sam",range:45,damage:75,guidance:"Active Radar",mach:3,compatible:["sky_sabre","land_ceptor"]},
  camm_er:{name:"CAMM-ER",type:"sam",range:45,damage:80,guidance:"Active Radar",mach:3.5,compatible:["camm_er_battery"]},
  aspide_missile:{name:"Aspide",type:"sam",range:35,damage:65,guidance:"Semi-Active Radar",mach:2.5,compatible:["skyguard_spada"]},
  rapier:{name:"Rapier",type:"sam",range:8,damage:55,guidance:"Command",mach:2.5,compatible:["rapier_fsc","rapier_2000"]},
  vt1:{name:"VT1",type:"sam",range:12,damage:60,guidance:"Command",mach:2.5,compatible:["crotale_ng"]},
  starstreak_missile:{name:"Starstreak",type:"sam",range:7,damage:70,guidance:"Laser Beam Riding",mach:3.5,compatible:["starstreak"]},
  martlet:{name:"Martlet",type:"sam",range:6,damage:50,guidance:"Laser Beam Riding",mach:1.5,compatible:["martlet"]},
  bloodhound_missile:{name:"Bloodhound",type:"sam",range:80,damage:75,guidance:"Semi-Active Radar",mach:3,compatible:["bloodhound"]},
  "9r31m":{name:"9R31M",type:"sam",range:70,damage:70,guidance:"Command",mach:3.5,compatible:["buk_m3"]},

  // === BALLISTIC/STRIKE ===
  fateh110:{name:"Fateh-110",type:"ballistic",range:300,damage:350,guidance:"INS+Terminal",mach:4,blastRadiusM:70,terminalManeuvering:true},
  zolfaghar:{name:"Zolfaghar",type:"ballistic",range:700,damage:420,guidance:"INS+Terminal",mach:5,blastRadiusM:90,terminalManeuvering:true},
  kheibar_shekan_rkt:{name:"Kheibar Shekan",type:"ballistic",range:1450,damage:500,guidance:"Terminal Maneuvering",mach:8,blastRadiusM:110,terminalManeuvering:true},
  sejjil_rkt:{name:"Sejjil",type:"ballistic",range:2000,damage:650,guidance:"INS",mach:12,blastRadiusM:130},
  ghadr110_rkt:{name:"Ghadr-110",type:"ballistic",range:1800,damage:550,guidance:"INS",mach:10,blastRadiusM:120},

  // === ROCKETS ===
  fajr5:{name:"Fajr-5",type:"rocket",range:75,damage:180,guidance:"Unguided",mach:3,blastRadiusM:40},
  m302:{name:"M-302 Khaibar",type:"rocket",range:160,damage:250,guidance:"Unguided",mach:3,blastRadiusM:60},
  qassam3:{name:"Qassam-3",type:"rocket",range:16,damage:70,guidance:"Unguided",mach:2,blastRadiusM:15},
  ayyash250:{name:"Ayyash-250",type:"rocket",range:250,damage:280,guidance:"Unguided",mach:3,blastRadiusM:70},

  // === NEW ===
  hq19_interceptor:{name:"HQ-19 Interceptor",type:"abm",range:300,damage:120,guidance:"GPS+IR",exoatmospheric:true,mach:5,compatible:[]},
  sea_ceptor:{name:"Sea Ceptor",type:"sam",range:45,damage:75,guidance:"Active Radar",mach:3,compatible:[]},
  jericho3:{name:"Jericho-3",type:"ballistic",range:6500,damage:900,guidance:"INS",ballistic:true,mach:15,blastRadiusM:180},
  p800_oniks:{name:"P-800 Oniks",type:"anti_ship",range:600,damage:650,guidance:"Active Radar",mach:2.5,blastRadiusM:100,pkShip:97},
  arash2:{name:"Arash-2",type:"loitering",range:2000,damage:250,guidance:"GPS/INS",mach:0.2,blastRadiusM:40},
  aim260:{name:"AIM-260 JATM",type:"a2a",range:220,damage:100,guidance:"Active Radar",mach:5,blastRadiusM:18,compatible:["f35a","f22"]},
  brahmos:{name:"BrahMos",type:"anti_ship",range:450,damage:700,guidance:"Active Radar",mach:3,blastRadiusM:120,pkShip:98,compatible:[]},
  kalibr:{name:"3M-14 Kalibr",type:"cruise",range:2500,damage:500,guidance:"GPS+TERCOM",mach:0.8,blastRadiusM:90,compatible:[]},
  yj18:{name:"YJ-18",type:"anti_ship",range:540,damage:650,guidance:"Active Radar",mach:3,blastRadiusM:110,pkShip:97,compatible:[]},
  trident:{name:"Trident II D5",type:"sub",range:12000,damage:475,guidance:"GPS+INS",ballistic:true,mach:15,compatible:[]}
};

// ======================================================
// BALLISTIC MISSILE DATABASE
// ======================================================
const BALLISTIC_DB = {
  shahab3:{id:"shahab3",name:"Shahab-3",type:"ballistic",rangeKM:1300,speedMach:7,damage:450,warheadKG:760,guidance:"INS",launchPlatform:"TEL",hp:1,reloadS:60},
  emad:{id:"emad",name:"Emad",type:"ballistic",rangeKM:1700,speedMach:8,damage:500,warheadKG:750,guidance:"INS+Terminal",launchPlatform:"TEL",hp:1,reloadS:60},
  ghadr:{id:"ghadr",name:"Ghadr",type:"ballistic",rangeKM:2000,speedMach:8,damage:500,warheadKG:650,guidance:"INS",launchPlatform:"TEL",hp:1,reloadS:60},
  sejjil:{id:"sejjil",name:"Sejjil",type:"ballistic",rangeKM:2000,speedMach:12,damage:550,warheadKG:700,guidance:"INS",launchPlatform:"TEL",hp:1,reloadS:60},
  kheibar_shekan:{id:"kheibar_shekan",name:"Kheibar Shekan",type:"ballistic",rangeKM:1450,speedMach:10,damage:550,warheadKG:550,guidance:"Terminal Maneuvering",launchPlatform:"TEL",hp:1,reloadS:50},
  khorramshahr4:{id:"khorramshahr4",name:"Khorramshahr-4",type:"ballistic",rangeKM:2000,speedMach:8,damage:900,warheadKG:1500,guidance:"INS",launchPlatform:"TEL",hp:1,reloadS:60},
  fattah1:{id:"fattah1",name:"Fattah-1",type:"hypersonic",rangeKM:1400,speedMach:13,damage:600,warheadKG:450,guidance:"MaRV",launchPlatform:"TEL",hp:1,reloadS:45},
  haj_qasem:{id:"haj_qasem",name:"Haj Qasem",type:"ballistic",rangeKM:1400,speedMach:10,damage:500,warheadKG:500,guidance:"Precision Strike",launchPlatform:"TEL",hp:1,reloadS:50},
  shahed136:{id:"shahed136",name:"Shahed-136 (Swarm Drone x30)",type:"drone",rangeKM:2000,speedKMH:185,damage:120,warheadKG:40,guidance:"GPS/INS",launchPlatform:"Truck",hp:20,reloadS:10},
  shahed238:{id:"shahed238",name:"Shahed-238 (Jet Swarm Drone x20)",type:"jet_drone",rangeKM:2000,speedKMH:600,damage:150,warheadKG:50,guidance:"GPS/INS",launchPlatform:"Truck",hp:25,reloadS:10},
  fateh110:{id:"fateh110",name:"Fateh-110",type:"ballistic",rangeKM:300,speedMach:4,damage:350,warheadKG:500,guidance:"INS+Terminal",launchPlatform:"TEL",hp:1,reloadS:40},
  zolfaghar:{id:"zolfaghar",name:"Zolfaghar",type:"ballistic",rangeKM:700,speedMach:5,damage:420,warheadKG:580,guidance:"INS+Terminal",launchPlatform:"TEL",hp:1,reloadS:45},
  kheibar_shekan_rkt:{id:"kheibar_shekan_rkt",name:"Kheibar Shekan (Rkt)",type:"ballistic",rangeKM:1450,speedMach:8,damage:500,warheadKG:500,guidance:"Terminal Maneuvering",launchPlatform:"TEL",hp:1,reloadS:50},
  sejjil_rkt:{id:"sejjil_rkt",name:"Sejjil (Rkt)",type:"ballistic",rangeKM:2000,speedMach:12,damage:650,warheadKG:700,guidance:"INS",launchPlatform:"TEL",hp:1,reloadS:60},
  ghadr110_rkt:{id:"ghadr110_rkt",name:"Ghadr-110 (Rkt)",type:"ballistic",rangeKM:1800,speedMach:10,damage:550,warheadKG:750,guidance:"INS",launchPlatform:"TEL",hp:1,reloadS:60},
  jericho3:{id:"jericho3",name:"Jericho-3",type:"ballistic",rangeKM:6500,speedMach:15,damage:900,warheadKG:1500,guidance:"INS",launchPlatform:"Silo",hp:1,reloadS:90},
  hyunmoo2:{id:"hyunmoo2",name:"Hyunmoo-2",type:"ballistic",rangeKM:800,speedMach:6,damage:500,warheadKG:500,guidance:"INS+GPS",launchPlatform:"TEL",hp:1,reloadS:50},
  hyunmoo3:{id:"hyunmoo3",name:"Hyunmoo-3",type:"cruise",rangeKM:1500,speedKMH:950,damage:450,warheadKG:450,guidance:"GPS+TERCOM",launchPlatform:"TEL",hp:1,reloadS:45},
  type12_ssm:{id:"type12_ssm",name:"Type 12 SSM (Land)",type:"cruise",rangeKM:1400,speedKMH:900,damage:400,warheadKG:350,guidance:"GPS+INS",launchPlatform:"Truck",hp:1,reloadS:40},
  iskander:{id:"iskander",name:"Iskander-M",type:"ballistic",rangeKM:500,speedMach:7,damage:480,warheadKG:480,guidance:"INS+Optical",launchPlatform:"TEL",hp:1,reloadS:40},
  kinzhal:{id:"kinzhal",name:"Kinzhal (Kh-47M2)",type:"hypersonic",rangeKM:2000,speedMach:10,damage:600,warheadKG:480,guidance:"INS+GLONASS",launchPlatform:"MiG-31",hp:1,reloadS:30},
  atacms:{id:"atacms",name:"ATACMS (MGM-140)",type:"ballistic",rangeKM:300,speedMach:3,damage:350,warheadKG:230,guidance:"INS+GPS",launchPlatform:"M270/HIMARS",hp:1,reloadS:30},
  prism:{id:"prism",name:"PrSM (Precision Strike)",type:"ballistic",rangeKM:499,speedMach:5,damage:400,warheadKG:200,guidance:"INS+GPS",launchPlatform:"HIMARS",hp:1,reloadS:25},
  taurus:{id:"taurus",name:"Taurus KEPD 350",type:"cruise",rangeKM:500,speedKMH:950,damage:550,warheadKG:480,guidance:"GPS+INS+IIR",launchPlatform:"Tornado/EF-18",hp:1,reloadS:35},
  df21d:{id:"df21d",name:"DF-21D (Carrier Killer)",type:"ballistic",rangeKM:1500,speedMach:10,damage:900,warheadKG:600,guidance:"INS+Radar Term",launchPlatform:"TEL",hp:1,reloadS:60},
  switchblade600:{id:"switchblade600",name:"Switchblade 600",type:"loitering",rangeKM:80,speedKMH:185,damage:150,warheadKG:25,guidance:"GPS+EO",launchPlatform:"Manpack",hp:15,reloadS:5},
  agni5:{id:"agni5",name:"Agni-V",type:"ballistic",rangeKM:5000,speedMach:12,damage:800,warheadKG:1500,guidance:"INS+GPS+Star",launchPlatform:"TEL/Rail",hp:1,reloadS:90},
  shaheen3:{id:"shaheen3",name:"Shaheen-III",type:"ballistic",rangeKM:2750,speedMach:8,damage:600,warheadKG:700,guidance:"INS+GPS",launchPlatform:"TEL",hp:1,reloadS:70},
  hwasong14:{id:"hwasong14",name:"Hwasong-14",type:"ballistic",rangeKM:6700,speedMach:11,damage:750,warheadKG:600,guidance:"INS",launchPlatform:"TEL",hp:1,reloadS:80},
  hwasong17:{id:"hwasong17",name:"Hwasong-17",type:"ballistic",rangeKM:13000,speedMach:15,damage:1000,warheadKG:1500,guidance:"INS+RV",launchPlatform:"TEL",hp:1,reloadS:120},
  jericho2:{id:"jericho2",name:"Jericho-2",type:"ballistic",rangeKM:3500,speedMach:10,damage:650,warheadKG:1000,guidance:"INS",launchPlatform:"Silo/TEL",hp:1,reloadS:75},
  m51:{id:"m51",name:"M51 SLBM",type:"ballistic",rangeKM:8000,speedMach:14,damage:900,warheadKG:1000,guidance:"INS+GPS",launchPlatform:"Submarine",hp:1,reloadS:120},
  sarmat:{id:"sarmat",name:"RS-28 Sarmat",type:"ballistic",rangeKM:16000,speedMach:16,damage:1200,warheadKG:5000,guidance:"INS+GLONASS",launchPlatform:"Silo",hp:1,reloadS:180},
  minuteman3:{id:"minuteman3",name:"Minuteman III",type:"ballistic",rangeKM:12000,speedMach:15,damage:1000,warheadKG:1000,guidance:"INS+GPS",launchPlatform:"Silo",hp:1,reloadS:150},
  bora:{id:"bora",name:"BORA (Turkey)",type:"ballistic",rangeKM:280,speedMach:4,damage:350,warheadKG:400,guidance:"INS+GPS",launchPlatform:"TEL",hp:1,reloadS:30},
  dezful:{id:"dezful",name:"Dezful (Iran)",type:"ballistic",rangeKM:1000,speedMach:5,damage:450,warheadKG:650,guidance:"INS+Terminal",launchPlatform:"TEL",hp:1,reloadS:45}
};

// ======================================================
// MISSILE COMBAT STATS
// ======================================================
const MISSILE_COMBAT_STATS = {
  aim120d:{pkAircraft:85,pkCruiseMissile:45,pkBallisticMissile:5,eccm:95,seekerStrength:95,maneuverLimitG:40},
  meteor:{pkAircraft:92,pkCruiseMissile:50,pkBallisticMissile:5,eccm:98,seekerStrength:98,maneuverLimitG:50},
  aim9x:{pkAircraft:80,pkCruiseMissile:35,pkBallisticMissile:0,eccm:90,seekerStrength:90,maneuverLimitG:60},
  r77:{pkAircraft:75,pkCruiseMissile:35,pkBallisticMissile:0,eccm:80,seekerStrength:82,maneuverLimitG:35},
  r73:{pkAircraft:78,pkCruiseMissile:25,pkBallisticMissile:0,eccm:85,seekerStrength:88,maneuverLimitG:60},
  "40n6":{pkAircraft:90,pkCruiseMissile:70,pkBallisticMissile:20,eccm:90,seekerStrength:92,maneuverLimitG:25},
  "48n6":{pkAircraft:85,pkCruiseMissile:65,pkBallisticMissile:15,eccm:85,seekerStrength:88,maneuverLimitG:22},
  "9m96e2":{pkAircraft:88,pkCruiseMissile:85,pkBallisticMissile:20,eccm:92,seekerStrength:92,maneuverLimitG:60},
  patriot:{pkAircraft:88,pkCruiseMissile:80,pkBallisticMissile:70,eccm:95,seekerStrength:95,maneuverLimitG:50},
  aster30:{pkAircraft:90,pkCruiseMissile:88,pkBallisticMissile:60,eccm:98,seekerStrength:98,maneuverLimitG:60},
  aster15:{pkAircraft:82,pkCruiseMissile:85,pkBallisticMissile:10,eccm:95,seekerStrength:95,maneuverLimitG:50},
  sm3:{pkAircraft:10,pkCruiseMissile:20,pkBallisticMissile:98,eccm:98,seekerStrength:98,maneuverLimitG:70},
  arrow3:{pkAircraft:5,pkCruiseMissile:10,pkBallisticMissile:99,eccm:99,seekerStrength:99,maneuverLimitG:80},
  thaad_interceptor:{pkAircraft:5,pkCruiseMissile:10,pkBallisticMissile:97,eccm:99,seekerStrength:99,maneuverLimitG:80},
  barak8:{pkAircraft:85,pkCruiseMissile:90,pkBallisticMissile:35,eccm:95,seekerStrength:95,maneuverLimitG:50},
  sm6:{pkAircraft:92,pkCruiseMissile:95,pkBallisticMissile:55,eccm:98,seekerStrength:98,maneuverLimitG:60},
  stunner:{pkAircraft:60,pkCruiseMissile:90,pkBallisticMissile:85,eccm:97,seekerStrength:97,maneuverLimitG:70},
  iris_t:{pkAircraft:90,pkCruiseMissile:92,pkBallisticMissile:15,eccm:95,seekerStrength:95,maneuverLimitG:65},
  mica:{pkAircraft:88,pkCruiseMissile:80,pkBallisticMissile:10,eccm:92,seekerStrength:92,maneuverLimitG:50},
  aim120c:{pkAircraft:82,pkCruiseMissile:40,pkBallisticMissile:5,eccm:90,seekerStrength:90,maneuverLimitG:35},
  aim54:{pkAircraft:75,pkCruiseMissile:30,pkBallisticMissile:5,eccm:75,seekerStrength:80,maneuverLimitG:25},
  r37m:{pkAircraft:82,pkCruiseMissile:45,pkBallisticMissile:5,eccm:85,seekerStrength:85,maneuverLimitG:30},
  pl15:{pkAircraft:88,pkCruiseMissile:45,pkBallisticMissile:5,eccm:92,seekerStrength:92,maneuverLimitG:40},
  derby:{pkAircraft:78,pkCruiseMissile:35,pkBallisticMissile:0,eccm:85,seekerStrength:85,maneuverLimitG:35},
  python5:{pkAircraft:90,pkCruiseMissile:35,pkBallisticMissile:0,eccm:95,seekerStrength:95,maneuverLimitG:70}
};

window.MISSILE_DB = MISSILE_DB;
window.BALLISTIC_DB = BALLISTIC_DB;
window.MISSILE_COMBAT_STATS = MISSILE_COMBAT_STATS;
console.log('Missiles DB loaded:', Object.keys(MISSILE_DB).length, 'types');