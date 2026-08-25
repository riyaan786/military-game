// ============================================================================
// buildings.js — BUILDINGS DATABASE for CMO
// ============================================================================
const BUILDINGS_DB = {
  // ============ MILITARY ============
  bunker: { name:'Bunker', hp:70, icon:'.', type:'military', desc:'Reinforced defensive bunker' },
  command_center: { name:'Command Center', hp:70, icon:'.', type:'military', desc:'Military command & control' },
  radar_station: { name:'Radar Station', hp:70, icon:'.', type:'military', desc:'Early warning radar' },
  barracks: { name:'Barracks', hp:70, icon:'.', type:'military', desc:'Troop quarters' },
  ammo_depot: { name:'Ammo Depot', hp:70, icon:'.', type:'military', desc:'Explosive ammo storage' },
  fuel_depot: { name:'Fuel Depot', hp:70, icon:'.', type:'military', desc:'Fuel storage facility' },
  military_tent: { name:'Military Tent', hp:70, icon:'.', type:'military', desc:'Field command post' },
  
  // ============ INDUSTRIAL ============
  factory: { name:'Factory', hp:70, icon:'.', type:'industrial', desc:'Industrial manufacturing' },
  power_plant: { name:'Power Plant', hp:70, icon:'.', type:'industrial', desc:'Electricity generation' },
  oil_refinery: { name:'Oil Refinery', hp:70, icon:'.', type:'industrial', desc:'Oil processing facility' },
  warehouse: { name:'Warehouse', hp:70, icon:'.', type:'industrial', desc:'Storage warehouse' },
  
  // ============ INFRASTRUCTURE ============
  bridge: { name:'Bridge', hp:70, icon:'.', type:'infrastructure', desc:'Road/rail bridge' },
  dam: { name:'Dam', hp:70, icon:'.', type:'infrastructure', desc:'Hydroelectric dam' },
  water_tower: { name:'Water Tower', hp:70, icon:'.', type:'infrastructure', desc:'Water storage tower' },
  comms_tower: { name:'Comms Tower', hp:70, icon:'.', type:'infrastructure', desc:'Telecom tower' },
  
  // ============ CIVILIAN ============
  hospital: { name:'Hospital', hp:70, icon:'.', type:'civilian', desc:'Medical facility' },
  school: { name:'School', hp:70, icon:'.', type:'civilian', desc:'Educational building' },
  church: { name:'Church', hp:70, icon:'.', type:'civilian', desc:'Place of worship' },
  house: { name:'House', hp:70, icon:'.', type:'civilian', desc:'Residential building' },
  apartment: { name:'Apartment', hp:70, icon:'.', type:'civilian', desc:'Apartment complex' },
  skyscraper: { name:'Skyscraper', hp:70, icon:'.', type:'civilian', desc:'Tall office building' },
  shop: { name:'Shop', hp:70, icon:'.', type:'civilian', desc:'Retail store' },
  
  // ============ TRANSPORT ============
  airport_terminal: { name:'Airport Terminal', hp:70, icon:'.', type:'transport', desc:'Civilian airport' },
  train_station: { name:'Train Station', hp:70, icon:'.', type:'transport', desc:'Railway station' },
  port: { name:'Port', hp:70, icon:'.', type:'transport', desc:'Shipping port' },
  parking_lot: { name:'Parking Lot', hp:70, icon:'.', type:'transport', desc:'Vehicle parking' },
};

window.BUILDINGS_DB = BUILDINGS_DB;
console.log('Buildings DB loaded:', Object.keys(BUILDINGS_DB).length, 'types');