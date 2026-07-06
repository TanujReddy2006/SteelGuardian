class ScenarioManager {

    constructor() {

        this.scenarios = {

            rawMaterialYard: "NORMAL",
            cokeOven: "NORMAL",
            blastFurnace: "NORMAL",
            sms: "NORMAL",
            rollingMill: "NORMAL"

        };

    }

    setScenario(zone, scenario) {

        if (!this.scenarios.hasOwnProperty(zone)) {
            throw new Error(`Unknown zone: ${zone}`);
        }

        this.scenarios[zone] = scenario;

    }

    getScenario(zone) {

        return this.scenarios[zone];

    }

    getAllScenarios() {

        return { ...this.scenarios };

    }

    resetScenario(zone) {

        if (!this.scenarios.hasOwnProperty(zone)) {
            throw new Error(`Unknown zone: ${zone}`);
        }

        this.scenarios[zone] = "NORMAL";

    }

    resetAll() {

        Object.keys(this.scenarios).forEach(zone => {

            this.scenarios[zone] = "NORMAL";

        });

    }

}

module.exports = new ScenarioManager();