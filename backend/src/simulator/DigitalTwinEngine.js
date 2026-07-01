// src/simulator/DigitalTwinEngine.js

class DigitalTwinEngine {

    constructor(plant, scenarioManager) {

    this.plant = plant;

    this.scenarioManager = scenarioManager;

    this.interval = null;

    this.isRunning = false;

    this.tick = 0;

}

    // ======================================
    // Start Simulation
    // ======================================

    start() {

        if (this.isRunning) {

            console.log("Digital Twin already running.");

            return;

        }

        console.log("Starting Digital Twin...");

        this.isRunning = true;

        this.interval = setInterval(() => {

            this.update();

        }, 2000);

    }

    // ======================================
    // Stop Simulation
    // ======================================

    stop() {

        if (!this.isRunning) return;

        clearInterval(this.interval);

        this.interval = null;

        this.isRunning = false;

        console.log("Digital Twin stopped.");

    }

    // ======================================
    // Update Plant
    // ======================================

    update() {

        this.tick++;

        this.plant.getAllZones().forEach(zone => {

            zone.update(
    this.scenarioManager.getCurrentScenario()
);

        });

        this.plant.update();

    }

    // ======================================
    // Scenario
    // ======================================



    // ======================================
    // Information
    // ======================================

    getPlant() {

        return this.plant;

    }

}

module.exports = DigitalTwinEngine;