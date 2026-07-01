// server.js

const Plant = require("./src/models/Plant");

const BlastFurnace = require("./src/zones/BlastFurnace");

const ScenarioManager = require("./src/simulator/ScenarioManager");

const DigitalTwinEngine = require("./src/simulator/DigitalTwinEngine");

// ===========================================
// Create Plant
// ===========================================

const plant = new Plant({

    id: "steel_guardian",

    name: "SteelGuardian AI",

    description: "Industrial Digital Twin"

});

// ===========================================
// Add Zones
// ===========================================

plant.addZone(new BlastFurnace());

// ===========================================
// Scenario Manager
// ===========================================

const scenarioManager = new ScenarioManager();

// ===========================================
// Digital Twin
// ===========================================

const digitalTwin = new DigitalTwinEngine(

    plant,

    scenarioManager

);

// ===========================================
// Start Simulation
// ===========================================

digitalTwin.start();

// ===========================================
// Debug Output
// ===========================================

setInterval(() => {

    console.clear();

    console.log("========================================");
    console.log("SteelGuardian AI Digital Twin");
    console.log("========================================");

    console.log("Scenario :", scenarioManager.getCurrentScenario());

    console.log("");

    console.log(

        JSON.stringify(

            plant.toJSON(),

            null,

            2

        )

    );

},2000);