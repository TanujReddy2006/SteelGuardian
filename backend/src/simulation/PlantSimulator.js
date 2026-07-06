const ScenarioManager = require("./ScenarioManager");
const PlantState = require("./PlantState");

const RawMaterialYard = require("../zones/RawMaterialYard");
const CokeOven = require("../zones/CokeOven");
const BlastFurnace = require("../zones/BlastFurnace");
const SMS = require("../zones/SMS");
const RollingMill = require("../zones/RollingMill");
const SimulationContext = require("./SimulationContext");

class PlantSimulator {

    constructor() {



        this.zones = {

            rawMaterialYard: new RawMaterialYard(),

            cokeOven: new CokeOven(),

            blastFurnace: new BlastFurnace(),

            sms: new SMS(),

            rollingMill: new RollingMill()

        };

       
    }

    updateOnce() {

        const scenarios = ScenarioManager.getAllScenarios();

        for (const [zoneName, zone] of Object.entries(this.zones)) {

            zone.update({

    context: SimulationContext.getContext(),

    scenario: scenarios[zoneName]

});

            const data = zone.publishData();

            PlantState.updateZone(zoneName, data);

        }

    }

    

    getPlantState() {

        return PlantState.getPlantState();

    }

    getZone(zone) {

        return PlantState.getZone(zone);

    }

  

}

module.exports = new PlantSimulator();