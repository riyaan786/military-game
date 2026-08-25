// ======================================================
// submarines.js — SUBMARINE DATABASE
// ======================================================
const SUBMARINE_DB = {
  // ===== USA =====
  virginia:{
    id:"virginia",name:"Virginia-class SSN",faction:"USA",type:"attack_sub",
    hp:850,crew:132,speedKnots:34,depthM:488,
    missileTubes:0,torpedoTubes:4,sonarKM:120,
    weapons:["tomahawk","mk54"],
    radarKM:0,stealth:true,rcs:0.01
  },
  seawolf:{
    id:"seawolf",name:"Seawolf-class SSN",faction:"USA",type:"attack_sub",
    hp:950,crew:140,speedKnots:35,depthM:600,
    missileTubes:0,torpedoTubes:8,sonarKM:150,
    weapons:["tomahawk","mk54","torp_mk48"],
    radarKM:0,stealth:true,rcs:0.001
  },

  // ===== UK =====
  astute:{
    id:"astute",name:"Astute-class SSN",faction:"UK",type:"attack_sub",
    hp:780,crew:98,speedKnots:30,depthM:500,
    missileTubes:0,torpedoTubes:6,sonarKM:130,
    weapons:["tomahawk","mk54"],
    radarKM:0,stealth:true,rcs:0.02
  },

  // ===== RUSSIA =====
  yasen:{
    id:"yasen",name:"Yasen-class SSGN",faction:"Russia",type:"attack_sub",
    hp:900,crew:90,speedKnots:35,depthM:600,
    missileTubes:8,torpedoTubes:4,sonarKM:140,
    weapons:["kalibr","kh101","p800_oniks"],
    radarKM:0,stealth:true,rcs:0.1
  },
  borei:{
    id:"borei",name:"Borei-class SSBN",faction:"Russia",type:"boomer_sub",
    hp:1200,crew:107,speedKnots:29,depthM:480,
    missileTubes:16,torpedoTubes:2,sonarKM:130,
    weapons:["bulava"],
    radarKM:0,stealth:true,rcs:0.15
  },
  kilo:{
    id:"kilo",name:"Kilo-class SS",faction:"Russia",type:"attack_sub",
    hp:650,crew:52,speedKnots:20,depthM:300,
    missileTubes:0,torpedoTubes:6,sonarKM:80,
    weapons:["kalibr"],
    radarKM:0,stealth:true,rcs:0.5
  },

  // ===== FRANCE =====
  scorpene:{
    id:"scorpene",name:"Scorpène-class SS",faction:"France",type:"attack_sub",
    hp:700,crew:31,speedKnots:20,depthM:350,
    missileTubes:0,torpedoTubes:6,sonarKM:100,
    weapons:["exocet","mk54"],
    radarKM:0,stealth:true,rcs:0.3
  },
  suffren:{
    id:"suffren",name:"Suffren-class SSN",faction:"France",type:"attack_sub",
    hp:820,crew:65,speedKnots:27,depthM:400,
    missileTubes:0,torpedoTubes:6,sonarKM:120,
    weapons:["exocet","tomahawk"],
    radarKM:0,stealth:true,rcs:0.05
  },

  // ===== INDIA =====
  kalvari:{
    id:"kalvari",name:"Kalvari-class SS",faction:"India",type:"attack_sub",
    hp:680,crew:31,speedKnots:20,depthM:350,
    missileTubes:0,torpedoTubes:6,sonarKM:90,
    weapons:["exocet"],
    radarKM:0,stealth:true,rcs:0.35
  },

  // ===== CHINA =====
  shang:{
    id:"shang",name:"Shang-class SSN",faction:"China",type:"attack_sub",
    hp:800,crew:120,speedKnots:30,depthM:400,
    missileTubes:0,torpedoTubes:6,sonarKM:110,
    weapons:["yj12","yj18"],
    radarKM:0,stealth:true,rcs:0.2
  },
  jin:{
    id:"jin",name:"Jin-class SSBN",faction:"China",type:"boomer_sub",
    hp:1100,crew:140,speedKnots:22,depthM:350,
    missileTubes:12,torpedoTubes:4,sonarKM:110,
    weapons:["cj10"],
    radarKM:0,stealth:true,rcs:0.25
  }
};