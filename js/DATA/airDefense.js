// ======================================================
// airDefense.js — AIR DEFENSE DATABASE v3.0
// ======================================================
const AIR_DEFENSE_DB = {
  // ===== RUSSIAN =====
  pantsir_sm: {
    name:"Pantsir-SM", faction:"Russia", type:"shorad",
    hp:220, armor:0.48, radarKM:40, engageKM:40, reloadS:3, maxMissiles:72,
    antiStealth:0.35, radarPower:0.75, tracking:20, simultaneous:8,
    ammo:["57e6m","57e6"], gun:true, radarRotation:0.8, crew:3,
    engagementChannels:8, trackCapacity:20, missilesPerLauncher:12, launchers:6,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  s400: {
    name:"S-400 Triumf", faction:"Russia", type:"long_range_sam",
    hp:350, armor:0.62, radarKM:600, engageKM:380, reloadS:8, maxMissiles:16,
    antiStealth:0.72, radarPower:0.95, tracking:36, simultaneous:12,
    ammo:["40n6","48n6","9m96e2"], radarRotation:0.6, crew:6,
    engagementChannels:12, trackCapacity:36, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  s300: {
    name:"S-300PMU-2", faction:"Russia", type:"long_range_sam",
    hp:300, armor:0.55, radarKM:300, engageKM:250, reloadS:10, maxMissiles:12,
    antiStealth:0.50, radarPower:0.85, tracking:24, simultaneous:6,
    ammo:["48n6"], radarRotation:0.7, crew:5,
    engagementChannels:6, trackCapacity:24, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  s350: {
    name:"S-350 Vityaz", faction:"Russia", type:"medium_range_sam",
    hp:300, armor:0.55, radarKM:300, engageKM:120, reloadS:6, maxMissiles:48,
    antiStealth:0.65, radarPower:0.90, tracking:80, simultaneous:12,
    ammo:["9m96e2","9m100"], radarRotation:0.5, crew:4,
    engagementChannels:12, trackCapacity:80, missilesPerLauncher:6, launchers:8,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  pantsir: {
    name:"Pantsir-S1", faction:"Russia", type:"short_range_sam",
    hp:180, armor:0.45, radarKM:40, engageKM:30, reloadS:2, maxMissiles:12,
    antiStealth:0.30, radarPower:0.70, tracking:10, simultaneous:4,
    ammo:["57e6","9m96e2"], gun:true, radarRotation:1.0, crew:3,
    engagementChannels:4, trackCapacity:10, missilesPerLauncher:6, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  buk: {
    name:"Buk-M3", faction:"Russia", type:"medium_range_sam",
    hp:250, armor:0.50, radarKM:120, engageKM:70, reloadS:5, maxMissiles:18,
    antiStealth:0.35, radarPower:0.75, tracking:12, simultaneous:4,
    ammo:["9r31m"], radarRotation:0.8, crew:4,
    engagementChannels:4, trackCapacity:12, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  tor: {
    name:"Tor-M2", faction:"Russia", type:"short_range_sam",
    hp:150, armor:0.40, radarKM:25, engageKM:16, reloadS:3, maxMissiles:16,
    antiStealth:0.25, radarPower:0.65, tracking:6, simultaneous:3,
    ammo:["9m338"], radarRotation:1.0, crew:3,
    engagementChannels:3, trackCapacity:6, missilesPerLauncher:8, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },

  // ===== USA/NATO =====
  patriot: {
    name:"MIM-104 Patriot PAC-3", faction:"USA", type:"long_range_sam",
    hp:320, armor:0.55, radarKM:250, engageKM:160, reloadS:6, maxMissiles:16,
    antiStealth:0.55, radarPower:0.88, tracking:100, simultaneous:9,
    ammo:["patriot","pac2"], radarRotation:0.5, crew:4,
    engagementChannels:9, trackCapacity:100, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  thAad: {
    name:"THAAD", faction:"USA", type:"abm",
    hp:200, armor:0.70, radarKM:1000, engageKM:200, reloadS:12, maxMissiles:8,
    antiStealth:0.40, radarPower:0.98, tracking:100, simultaneous:9,
    ammo:["sm3"], exoatmospheric:true, radarRotation:0.3, crew:4,
    engagementChannels:9, trackCapacity:100, missilesPerLauncher:2, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  nasams: {
    name:"NASAMS III", faction:"USA/NATO", type:"medium_range_sam",
    hp:250, armor:0.40, radarKM:120, engageKM:50, reloadS:4, maxMissiles:24,
    antiStealth:0.45, radarPower:0.80, tracking:72, simultaneous:6,
    ammo:["aim120c","aim120d","aim9x"], radarRotation:0.7, crew:3,
    engagementChannels:6, trackCapacity:72, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  spyder: {
    name:"Spyder MR", faction:"Israel", type:"short_range_sam",
    hp:200, armor:0.35, radarKM:60, engageKM:50, reloadS:3, maxMissiles:16,
    antiStealth:0.25, radarPower:0.65, tracking:16, simultaneous:4,
    ammo:["derby","python5"], radarRotation:0.9, crew:3,
    engagementChannels:4, trackCapacity:16, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },

  // ===== ISRAELI ADVANCED =====
  davidsling: {
    name:"David's Sling", faction:"Israel", type:"medium_range_sam",
    hp:280, armor:0.55, radarKM:350, engageKM:250, reloadS:6, maxMissiles:16,
    antiStealth:0.40, radarPower:0.85, tracking:40, simultaneous:8,
    ammo:["stunner"], radarRotation:0.5, crew:4,
    engagementChannels:8, trackCapacity:40, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  arrow2: {
    name:"Arrow-2", faction:"Israel", type:"abm",
    hp:220, armor:0.60, radarKM:800, engageKM:500, reloadS:15, maxMissiles:6,
    antiStealth:0.30, radarPower:0.95, tracking:30, simultaneous:6,
    ammo:["arrow2"], exoatmospheric:true, radarRotation:0.3, crew:5,
    engagementChannels:6, trackCapacity:30, missilesPerLauncher:3, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  arrow3: {
    name:"Arrow-3", faction:"Israel", type:"exoatmospheric_abm",
    hp:200, armor:0.75, radarKM:1200, engageKM:2400, reloadS:20, maxMissiles:4,
    antiStealth:0.50, radarPower:0.99, tracking:50, simultaneous:4,
    ammo:["arrow3"], exoatmospheric:true, radarRotation:0.2, crew:5,
    engagementChannels:4, trackCapacity:50, missilesPerLauncher:2, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  irondome: {
    name:"Iron Dome", faction:"Israel", type:"crm",
    hp:180, armor:0.30, radarKM:100, engageKM:70, reloadS:2, maxMissiles:80,
    antiStealth:0.15, radarPower:0.60, tracking:200, simultaneous:20,
    ammo:["tamir"], radarRotation:0.8, crew:3,
    engagementChannels:20, trackCapacity:200, missilesPerLauncher:20, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },

  // ===== US NAVY/NATO SHORE =====
  aegis: {
    name:"Aegis Ashore", faction:"USA", type:"abm",
    hp:400, armor:0.60, radarKM:600, engageKM:500, reloadS:8, maxMissiles:24,
    antiStealth:0.40, radarPower:0.95, tracking:200, simultaneous:20,
    ammo:["sm3","sm6"], radarRotation:0.0, crew:6,
    engagementChannels:20, trackCapacity:200, missilesPerLauncher:4, launchers:6,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },

  // ===== GERMANY =====
  iris_t_slm: {
    name:"IRIS-T SLM", faction:"Germany", type:"short_range_sam",
    hp:200, armor:0.35, radarKM:80, engageKM:40, reloadS:3, maxMissiles:12,
    antiStealth:0.30, radarPower:0.70, tracking:24, simultaneous:4,
    ammo:["iris_t"], radarRotation:0.8, crew:3,
    engagementChannels:4, trackCapacity:24, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },

  // ===== CHINESE =====
  hq19: {
    name:"HQ-19", faction:"China", type:"abm",
    hp:350, armor:0.65, radarKM:1000, engageKM:300, reloadS:15, maxMissiles:36,
    antiStealth:0.40, radarPower:0.90, tracking:100, simultaneous:12,
    ammo:["hq19_interceptor"], exoatmospheric:true, radarRotation:0.3, crew:5,
    engagementChannels:12, trackCapacity:100, missilesPerLauncher:6, launchers:6,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  hq9: {
    name:"HQ-9B", faction:"China", type:"long_range_sam",
    hp:320, armor:0.55, radarKM:350, engageKM:300, reloadS:8, maxMissiles:16,
    antiStealth:0.50, radarPower:0.85, tracking:30, simultaneous:8,
    ammo:["hq9"], radarRotation:0.6, crew:4,
    engagementChannels:8, trackCapacity:30, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  hq22: {
    name:"HQ-22", faction:"China", type:"medium_range_sam",
    hp:280, armor:0.50, radarKM:250, engageKM:170, reloadS:6, maxMissiles:12,
    antiStealth:0.45, radarPower:0.80, tracking:20, simultaneous:6,
    ammo:["hq22"], radarRotation:0.7, crew:4,
    engagementChannels:6, trackCapacity:20, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  hq16: {
    name:"HQ-16", faction:"China", type:"medium_range_sam",
    hp:260, armor:0.45, radarKM:160, engageKM:70, reloadS:5, maxMissiles:16,
    antiStealth:0.35, radarPower:0.75, tracking:12, simultaneous:4,
    ammo:["hq16"], radarRotation:0.7, crew:4,
    engagementChannels:4, trackCapacity:12, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  fk3: {
    name:"FK-3 (HQ-22 Export)", faction:"China", type:"medium_range_sam",
    hp:280, armor:0.50, radarKM:200, engageKM:100, reloadS:6, maxMissiles:12,
    antiStealth:0.40, radarPower:0.75, tracking:20, simultaneous:6,
    ammo:["fk3"], radarRotation:0.7, crew:4,
    engagementChannels:6, trackCapacity:20, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  ks1c: {
    name:"KS-1C", faction:"China", type:"medium_range_sam",
    hp:240, armor:0.45, radarKM:120, engageKM:70, reloadS:5, maxMissiles:12,
    antiStealth:0.30, radarPower:0.70, tracking:12, simultaneous:4,
    ammo:["ks1c"], radarRotation:0.8, crew:4,
    engagementChannels:4, trackCapacity:12, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },

  // ===== INDIAN =====
  barak8: {
    name:"Barak-8 (MR-SAM)", faction:"India/Israel", type:"medium_range_sam",
    hp:280, armor:0.45, radarKM:200, engageKM:150, reloadS:6, maxMissiles:16,
    antiStealth:0.35, radarPower:0.78, tracking:24, simultaneous:6,
    ammo:["barak8"], radarRotation:0.6, crew:4,
    engagementChannels:6, trackCapacity:24, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  akashng: {
    name:"Akash NG", faction:"India", type:"medium_range_sam",
    hp:250, armor:0.40, radarKM:150, engageKM:70, reloadS:4, maxMissiles:12,
    antiStealth:0.30, radarPower:0.72, tracking:16, simultaneous:4,
    ammo:["akashng"], radarRotation:0.7, crew:4,
    engagementChannels:4, trackCapacity:16, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },

  // ===== IRANIAN (Complete) =====
  bavar373: {
    name:"Bavar-373", faction:"Iran", type:"long_range_sam",
    hp:300, armor:0.50, radarKM:350, engageKM:300, reloadS:10, maxMissiles:12,
    antiStealth:0.35, radarPower:0.75, tracking:20, simultaneous:6,
    ammo:["sayyad4b"], radarRotation:0.5, crew:5,
    engagementChannels:6, trackCapacity:20, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  khordad15: {
    name:"15th Khordad", faction:"Iran", type:"long_range_sam",
    hp:280, armor:0.45, radarKM:250, engageKM:200, reloadS:8, maxMissiles:12,
    antiStealth:0.30, radarPower:0.70, tracking:16, simultaneous:6,
    ammo:["sayyad3"], radarRotation:0.6, crew:4,
    engagementChannels:6, trackCapacity:16, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  khordad3: {
    name:"3rd Khordad", faction:"Iran", type:"medium_range_sam",
    hp:250, armor:0.40, radarKM:150, engageKM:105, reloadS:6, maxMissiles:8,
    antiStealth:0.25, radarPower:0.65, tracking:12, simultaneous:4,
    ammo:["taer2b"], radarRotation:0.7, crew:4,
    engagementChannels:4, trackCapacity:12, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  tabas: {
    name:"Tabas", faction:"Iran", type:"short_range_sam",
    hp:220, armor:0.35, radarKM:100, engageKM:75, reloadS:5, maxMissiles:8,
    antiStealth:0.20, radarPower:0.60, tracking:8, simultaneous:4,
    ammo:["taer"], radarRotation:0.8, crew:3,
    engagementChannels:4, trackCapacity:8, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  raad: {
    name:"Raad", faction:"Iran", type:"short_range_sam",
    hp:200, armor:0.35, radarKM:80, engageKM:75, reloadS:5, maxMissiles:8,
    antiStealth:0.20, radarPower:0.58, tracking:8, simultaneous:4,
    ammo:["taer"], radarRotation:0.8, crew:3,
    engagementChannels:4, trackCapacity:8, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  mersad: {
    name:"Mersad", faction:"Iran", type:"short_range_sam",
    hp:200, armor:0.35, radarKM:50, engageKM:45, reloadS:4, maxMissiles:8,
    antiStealth:0.15, radarPower:0.55, tracking:6, simultaneous:3,
    ammo:["shahin"], radarRotation:0.9, crew:3,
    engagementChannels:3, trackCapacity:6, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  torm1_iran: {
    name:"Tor-M1 (Iran)", faction:"Iran", type:"short_range_sam",
    hp:150, armor:0.40, radarKM:25, engageKM:12, reloadS:3, maxMissiles:8,
    antiStealth:0.20, radarPower:0.60, tracking:6, simultaneous:2,
    ammo:["9m331"], radarRotation:1.0, crew:3,
    engagementChannels:2, trackCapacity:6, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  pantsir_iran: {
    name:"Pantsir-Iran", faction:"Iran", type:"short_range_sam",
    hp:180, armor:0.40, radarKM:40, engageKM:30, reloadS:2, maxMissiles:12,
    antiStealth:0.25, radarPower:0.60, tracking:10, simultaneous:4,
    ammo:["57e6","9m96e2"], gun:true, radarRotation:1.0, crew:3,
    engagementChannels:4, trackCapacity:10, missilesPerLauncher:6, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  khalij_fars: {
    name:"Khalij Fars", faction:"Iran", type:"coastal_defense",
    hp:180, armor:0.35, radarKM:150, engageKM:300, reloadS:15, maxMissiles:6,
    antiStealth:0.10, radarPower:0.50, tracking:4, simultaneous:2,
    ammo:["khalij_fars_missile"], radarRotation:0.0, crew:4,
    engagementChannels:2, trackCapacity:4, missilesPerLauncher:3, launchers:2,
    radarType:"phased_array", canInterceptMissiles:false, canInterceptBallisticMissiles:false
  },
  hormuz2: {
    name:"Hormuz-2", faction:"Iran", type:"coastal_defense",
    hp:180, armor:0.35, radarKM:150, engageKM:300, reloadS:15, maxMissiles:6,
    antiStealth:0.10, radarPower:0.50, tracking:4, simultaneous:2,
    ammo:["hormuz2_missile"], radarRotation:0.0, crew:4,
    engagementChannels:2, trackCapacity:4, missilesPerLauncher:3, launchers:2,
    radarType:"phased_array", canInterceptMissiles:false, canInterceptBallisticMissiles:false
  },

  // ===== UK =====
  skysabre: {
    name:"Sky Sabre", faction:"UK", type:"medium_range_sam",
    hp:280, armor:0.50, radarKM:120, engageKM:45, reloadS:5, maxMissiles:24,
    antiStealth:0.40, radarPower:0.78, tracking:100, simultaneous:24,
    ammo:["camm"], radarRotation:0.6, crew:4,
    engagementChannels:24, trackCapacity:100, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  landceptor: {
    name:"Land Ceptor", faction:"UK", type:"medium_range_sam",
    hp:280, armor:0.50, radarKM:120, engageKM:45, reloadS:5, maxMissiles:24,
    antiStealth:0.40, radarPower:0.78, tracking:100, simultaneous:24,
    ammo:["camm"], radarRotation:0.6, crew:4,
    engagementChannels:24, trackCapacity:100, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  starstreak: {
    name:"Starstreak HVM", faction:"UK", type:"short_range_sam",
    hp:120, armor:0.30, radarKM:15, engageKM:7, reloadS:3, maxMissiles:8,
    antiStealth:0.15, radarPower:0.45, tracking:10, simultaneous:1,
    ammo:["starstreak_missile"], radarRotation:1.0, crew:2,
    engagementChannels:1, trackCapacity:10, missilesPerLauncher:2, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  martlet_ad: {
    name:"Martlet Air Defence", faction:"UK", type:"short_range_sam",
    hp:100, armor:0.25, radarKM:10, engageKM:8, reloadS:2, maxMissiles:20,
    antiStealth:0.10, radarPower:0.40, tracking:6, simultaneous:1,
    ammo:["martlet"], radarRotation:1.0, crew:2,
    engagementChannels:1, trackCapacity:6, missilesPerLauncher:4, launchers:5,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  rapier_fsc: {
    name:"Rapier FSC", faction:"UK", type:"short_range_sam",
    hp:180, armor:0.40, radarKM:30, engageKM:8, reloadS:4, maxMissiles:8,
    antiStealth:0.20, radarPower:0.55, tracking:12, simultaneous:2,
    ammo:["rapier"], radarRotation:0.8, crew:3,
    engagementChannels:2, trackCapacity:12, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  rapier2000: {
    name:"Rapier 2000", faction:"UK", type:"short_range_sam",
    hp:170, armor:0.38, radarKM:25, engageKM:8, reloadS:4, maxMissiles:8,
    antiStealth:0.18, radarPower:0.52, tracking:12, simultaneous:2,
    ammo:["rapier"], radarRotation:0.8, crew:3,
    engagementChannels:2, trackCapacity:12, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  bloodhound: {
    name:"Bloodhound Mk II", faction:"UK", type:"long_range_sam",
    hp:250, armor:0.50, radarKM:180, engageKM:85, reloadS:10, maxMissiles:16,
    antiStealth:0.25, radarPower:0.65, tracking:20, simultaneous:2,
    ammo:["bloodhound_missile"], radarRotation:0.6, crew:4,
    engagementChannels:2, trackCapacity:20, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  sea_viper_land: {
    name:"Sea Viper Land Battery", faction:"UK", type:"long_range_sam",
    hp:320, armor:0.55, radarKM:400, engageKM:120, reloadS:8, maxMissiles:32,
    antiStealth:0.45, radarPower:0.88, tracking:200, simultaneous:16,
    ammo:["aster30"], radarRotation:0.4, crew:5,
    engagementChannels:16, trackCapacity:200, missilesPerLauncher:8, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  camm_er_battery: {
    name:"CAMM-ER Battery", faction:"UK", type:"medium_range_sam",
    hp:280, armor:0.50, radarKM:150, engageKM:70, reloadS:5, maxMissiles:32,
    antiStealth:0.40, radarPower:0.80, tracking:120, simultaneous:24,
    ammo:["camm_er"], radarRotation:0.5, crew:4,
    engagementChannels:24, trackCapacity:120, missilesPerLauncher:8, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  dragonfire: {
    name:"DragonFire Laser AD", faction:"UK", type:"laser_ad",
    hp:150, armor:0.20, radarKM:15, engageKM:5, reloadS:0, maxMissiles:999,
    antiStealth:0.10, radarPower:0.50, tracking:20, simultaneous:1,
    ammo:[], radarRotation:0.9, crew:2,
    engagementChannels:1, trackCapacity:20, missilesPerLauncher:0, launchers:1,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },

  // ===== FRENCH (Additional) =====
  samp_t: {
    name:"SAMP/T", faction:"France/Italy", type:"medium_range_sam",
    hp:320, armor:0.50, radarKM:350, engageKM:120, reloadS:8, maxMissiles:48,
    antiStealth:0.40, radarPower:0.80, tracking:100, simultaneous:16,
    ammo:["aster30"], radarRotation:0.5, crew:4,
    engagementChannels:16, trackCapacity:100, missilesPerLauncher:8, launchers:6,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  samp_t_ng: {
    name:"SAMP/T NG", faction:"France/Italy", type:"long_range_sam",
    hp:350, armor:0.55, radarKM:400, engageKM:150, reloadS:8, maxMissiles:48,
    antiStealth:0.50, radarPower:0.88, tracking:200, simultaneous:24,
    ammo:["aster30b1nt"], radarRotation:0.4, crew:4,
    engagementChannels:24, trackCapacity:200, missilesPerLauncher:8, launchers:6,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  crotale_ng: {
    name:"Crotale NG", faction:"France", type:"short_range_sam",
    hp:180, armor:0.35, radarKM:30, engageKM:16, reloadS:4, maxMissiles:8,
    antiStealth:0.20, radarPower:0.55, tracking:20, simultaneous:4,
    ammo:["vt1"], radarRotation:0.9, crew:3,
    engagementChannels:4, trackCapacity:20, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  mistral_atlas: {
    name:"ATLAS RC", faction:"France", type:"short_range_sam",
    hp:120, armor:0.25, radarKM:15, engageKM:8, reloadS:3, maxMissiles:4,
    antiStealth:0.10, radarPower:0.40, tracking:6, simultaneous:1,
    ammo:["mistral"], radarRotation:1.0, crew:2,
    engagementChannels:1, trackCapacity:6, missilesPerLauncher:2, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  mistral_simbad: {
    name:"SIMBAD-RC", faction:"France", type:"short_range_sam",
    hp:100, armor:0.25, radarKM:15, engageKM:8, reloadS:3, maxMissiles:2,
    antiStealth:0.10, radarPower:0.38, tracking:6, simultaneous:1,
    ammo:["mistral"], radarRotation:1.0, crew:2,
    engagementChannels:1, trackCapacity:6, missilesPerLauncher:2, launchers:1,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  mica_vl: {
    name:"VL MICA", faction:"France", type:"short_range_sam",
    hp:180, armor:0.35, radarKM:80, engageKM:25, reloadS:5, maxMissiles:16,
    antiStealth:0.25, radarPower:0.60, tracking:20, simultaneous:8,
    ammo:["mica_vl_missile"], radarRotation:0.7, crew:3,
    engagementChannels:8, trackCapacity:20, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  vl_mica_ng: {
    name:"VL MICA NG", faction:"France", type:"short_range_sam",
    hp:200, armor:0.38, radarKM:120, engageKM:40, reloadS:5, maxMissiles:16,
    antiStealth:0.30, radarPower:0.65, tracking:30, simultaneous:8,
    ammo:["mica_ng"], radarRotation:0.7, crew:3,
    engagementChannels:8, trackCapacity:30, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  aster15_battery: {
    name:"Aster 15 Battery", faction:"France", type:"medium_range_sam",
    hp:220, armor:0.45, radarKM:150, engageKM:30, reloadS:5, maxMissiles:24,
    antiStealth:0.30, radarPower:0.70, tracking:40, simultaneous:8,
    ammo:["aster15"], radarRotation:0.6, crew:4,
    engagementChannels:8, trackCapacity:40, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  aster30_battery: {
    name:"Aster 30 Battery", faction:"France", type:"medium_range_sam",
    hp:280, armor:0.50, radarKM:300, engageKM:120, reloadS:8, maxMissiles:32,
    antiStealth:0.40, radarPower:0.80, tracking:100, simultaneous:16,
    ammo:["aster30"], radarRotation:0.5, crew:4,
    engagementChannels:16, trackCapacity:100, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  rapidfire: {
    name:"RapidFire 40mm", faction:"France", type:"ciws",
    hp:120, armor:0.20, radarKM:10, engageKM:4, reloadS:0, maxMissiles:999,
    antiStealth:0.05, radarPower:0.30, tracking:10, simultaneous:1,
    ammo:[], radarRotation:1.0, crew:2,
    engagementChannels:1, trackCapacity:10, missilesPerLauncher:0, launchers:1,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  // === 10 ADDITIONAL SAM/AIR DEFENSE SYSTEMS ===
  km_sam_ii: {
    name:"KM-SAM Cheongung II", faction:"South Korea", type:"medium_range_sam",
    hp:280, armor:0.50, radarKM:400, engageKM:150, reloadS:6, maxMissiles:24,
    antiStealth:0.35, radarPower:0.85, tracking:40, simultaneous:12,
    ammo:["sayyad4b","stunner"], radarRotation:0.5, crew:4,
    engagementChannels:12, trackCapacity:40, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  spyder_mr: {
    name:"SPYDER-MR", faction:"Israel", type:"medium_range_sam",
    hp:220, armor:0.40, radarKM:250, engageKM:50, reloadS:5, maxMissiles:12,
    antiStealth:0.30, radarPower:0.75, tracking:24, simultaneous:6,
    ammo:["derby","python5"], radarRotation:0.6, crew:3,
    engagementChannels:6, trackCapacity:24, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  camm_er_btry: {
    name:"CAMM-ER Battery", faction:"UK/Italy", type:"medium_range_sam",
    hp:260, armor:0.45, radarKM:300, engageKM:45, reloadS:4, maxMissiles:24,
    antiStealth:0.40, radarPower:0.82, tracking:32, simultaneous:12,
    ammo:["sea_ceptor","aster15"], radarRotation:0.4, crew:3,
    engagementChannels:12, trackCapacity:32, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  hq9a: {
    name:"HQ-9A", faction:"China", type:"long_range_sam",
    hp:320, armor:0.55, radarKM:450, engageKM:250, reloadS:8, maxMissiles:16,
    antiStealth:0.40, radarPower:0.90, tracking:40, simultaneous:12,
    ammo:["hq9","hq22"], radarRotation:0.5, crew:5,
    engagementChannels:12, trackCapacity:40, missilesPerLauncher:4, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  hq19_sam: {
    name:"HQ-19", faction:"China", type:"abm",
    hp:280, armor:0.55, radarKM:500, engageKM:300, reloadS:8, maxMissiles:12,
    antiStealth:0.40, radarPower:0.85, tracking:30, simultaneous:6,
    ammo:["hq19_interceptor"], radarRotation:0.4, crew:4,
    engagementChannels:6, trackCapacity:30, missilesPerLauncher:4, launchers:3,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:true
  },
  s350_vityaz: {
    name:"S-350 Vityaz", faction:"Russia", type:"medium_range_sam",
    hp:300, armor:0.50, radarKM:350, engageKM:120, reloadS:6, maxMissiles:24,
    antiStealth:0.55, radarPower:0.85, tracking:36, simultaneous:12,
    ammo:["9m96e2","9m100"], radarRotation:0.5, crew:4,
    engagementChannels:12, trackCapacity:36, missilesPerLauncher:6, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  hawk_ph3: {
    name:"MIM-23 Hawk Phase III", faction:"USA", type:"medium_range_sam",
    hp:200, armor:0.30, radarKM:120, engageKM:40, reloadS:10, maxMissiles:12,
    antiStealth:0.10, radarPower:0.50, tracking:12, simultaneous:4,
    ammo:["pac2","9m331"], radarRotation:0.7, crew:5,
    engagementChannels:4, trackCapacity:12, missilesPerLauncher:3, launchers:4,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  skyguard_spada: {
    name:"Oerlikon Skyguard/Spada", faction:"Switzerland/Italy", type:"short_range_sam",
    hp:160, armor:0.25, radarKM:60, engageKM:15, reloadS:4, maxMissiles:8,
    antiStealth:0.15, radarPower:0.50, tracking:12, simultaneous:3,
    ammo:["aspide_missile","9m338"], radarRotation:0.8, crew:3,
    engagementChannels:3, trackCapacity:12, missilesPerLauncher:4, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  pantsir_sm_sd: {
    name:"Pantsir-SM-SD", faction:"Russia", type:"shorad",
    hp:240, armor:0.48, radarKM:50, engageKM:40, reloadS:3, maxMissiles:72,
    antiStealth:0.40, radarPower:0.78, tracking:24, simultaneous:10,
    ammo:["57e6m","57e6","9m100"], gun:true, radarRotation:0.7, crew:3,
    engagementChannels:10, trackCapacity:24, missilesPerLauncher:12, launchers:6,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  },
  hq17ae: {
    name:"HQ-17AE", faction:"China", type:"short_range_sam",
    hp:220, armor:0.42, radarKM:30, engageKM:20, reloadS:3, maxMissiles:16,
    antiStealth:0.30, radarPower:0.70, tracking:12, simultaneous:6,
    ammo:["9m338","9m317m"], radarRotation:0.8, crew:3,
    engagementChannels:6, trackCapacity:12, missilesPerLauncher:8, launchers:2,
    radarType:"phased_array", canInterceptMissiles:true, canInterceptBallisticMissiles:false
  }
};
