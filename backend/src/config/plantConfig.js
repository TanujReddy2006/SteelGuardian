// src/config/plantConfig.js

const plantConfig = {
  plantName: "SteelGuardian AI Digital Twin",

  updateInterval: 2000, // milliseconds

  zones: [
    {
      id: "raw_material_yard",
      name: "Raw Material Yard",
      priority: 2,
      status: "NORMAL"
    },

    {
      id: "coke_oven",
      name: "Coke Oven",
      priority: 5,
      status: "NORMAL"
    },

    {
      id: "blast_furnace",
      name: "Blast Furnace",
      priority: 10,
      status: "NORMAL"
    },

    {
      id: "sms",
      name: "Steel Melting Shop",
      priority: 8,
      status: "NORMAL"
    },

    {
      id: "rolling_mill",
      name: "Rolling Mill",
      priority: 6,
      status: "NORMAL"
    },

    {
      id: "tank_farm",
      name: "Tank Farm",
      priority: 9,
      status: "NORMAL"
    },

    {
      id: "power_plant",
      name: "Power Plant",
      priority: 10,
      status: "NORMAL"
    }
  ]
};

module.exports = plantConfig;