// src/simulator/ScenarioManager.js

const scenarioConfig = require("../config/scenarioConfig");

class ScenarioManager {

    constructor() {

        this.currentScenario = "NORMAL";

    }

    getCurrentScenario() {

        return this.currentScenario;

    }

    setScenario(scenario) {

        if (!scenarioConfig.includes(scenario)) {

            throw new Error(`Invalid Scenario : ${scenario}`);

        }

        console.log(
            `Scenario Changed : ${this.currentScenario} -> ${scenario}`
        );

        this.currentScenario = scenario;

    }

    reset() {

        this.currentScenario = "NORMAL";

    }

    getAvailableScenarios() {

        return [...scenarioConfig];

    }

}

module.exports = ScenarioManager;