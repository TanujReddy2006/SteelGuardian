// src/zones/BlastFurnace.js

const Zone = require("../models/Zone");
const Sensor = require("../models/Sensor");

class BlastFurnace extends Zone {

    constructor() {

        super({
            id: "blast_furnace",
            name: "Blast Furnace",
            priority: 10,
            description: "Converts iron ore into molten iron."
        });

        this.initializeSensors();
        // =====================================================
// Process State
// =====================================================
this.processState = {

    targetTemperature: 1515,

    combustionRate: 1.0,

    coolingEfficiency: 1.0,

    productionRate: 1.0,

    furnaceEfficiency: 0.95

};

    }

    // =====================================================
    // Initialize Sensors
    // =====================================================

    initializeSensors() {

        // Furnace Temperature
        this.addSensor(new Sensor({

            id: "BF_TEMP_001",
            name: "Furnace Temperature",
            type: "temperature",
            zone: this.id,

            unit: "°C",

            minValue: 1450,
            maxValue: 1600,

            warningHigh: 1570,
            criticalHigh: 1590,

            initialValue: 1500,

            updateInterval: 2000

        }));

        // Furnace Pressure
        this.addSensor(new Sensor({

            id: "BF_PRESS_001",
            name: "Furnace Pressure",
            type: "pressure",
            zone: this.id,

            unit: "bar",

            minValue: 7,
            maxValue: 9,

            warningHigh: 8.6,
            criticalHigh: 8.9,

            initialValue: 8,

            updateInterval: 2000

        }));

        // CO Gas
        this.addSensor(new Sensor({

            id: "BF_CO_001",
            name: "CO Gas",
            type: "gas",
            zone: this.id,

            unit: "ppm",

            minValue: 20,
            maxValue: 45,

            warningHigh: 38,
            criticalHigh: 42,

            initialValue: 30,

            updateInterval: 1000

        }));

        // Cooling Water Flow
        this.addSensor(new Sensor({

            id: "BF_COOL_001",
            name: "Cooling Water Flow",
            type: "flow",
            zone: this.id,

            unit: "%",

            minValue: 80,
            maxValue: 100,

            warningLow: 85,
            criticalLow: 82,

            initialValue: 95,

            updateInterval: 2000

        }));

        // Top Gas Pressure
        this.addSensor(new Sensor({

            id: "BF_TOP_001",
            name: "Top Gas Pressure",
            type: "pressure",
            zone: this.id,

            unit: "bar",

            minValue: 3,
            maxValue: 5,

            warningHigh: 4.6,
            criticalHigh: 4.9,

            initialValue: 4,

            updateInterval: 2000

        }));

        // Vibration
        this.addSensor(new Sensor({

            id: "BF_VIB_001",
            name: "Vibration",
            type: "vibration",
            zone: this.id,

            unit: "mm/s",

            minValue: 1,
            maxValue: 4,

            warningHigh: 3,
            criticalHigh: 3.5,

            initialValue: 2,

            updateInterval: 5000

        }));

    }

    // =====================================================
    // Utility
    // =====================================================

    random(min, max) {

        return Math.random() * (max - min) + min;

    }

    // =====================================================
    // Update
    // =====================================================

    update(currentScenario) {

    this.updateProcessState(currentScenario);

    switch (currentScenario) {

        case "COOLING_FAILURE":
            this.updateCoolingFailure();
            break;

        default:
            this.updateNormal();
            break;

    }

    super.update();

}

    // =====================================================
    // Normal Operation
    // =====================================================

   updateNormal() {

    const temp = this.getSensorById("BF_TEMP_001");
    const pressure = this.getSensorById("BF_PRESS_001");
    const co = this.getSensorById("BF_CO_001");
    const cooling = this.getSensorById("BF_COOL_001");
    const topGas = this.getSensorById("BF_TOP_001");
    const vibration = this.getSensorById("BF_VIB_001");

    // ===========================================
    // Slowly changing process variables
    // ===========================================

    this.processState.combustionRate += this.random(-0.005, 0.005);

    this.processState.coolingEfficiency += this.random(-0.002, 0.002);

    this.processState.productionRate += this.random(-0.003, 0.003);

    this.processState.furnaceEfficiency += this.random(-0.001, 0.001);

    // Clamp process values

    this.processState.combustionRate =
        Math.max(0.9, Math.min(1.1, this.processState.combustionRate));

    this.processState.coolingEfficiency =
        Math.max(0.9, Math.min(1.0, this.processState.coolingEfficiency));

    this.processState.productionRate =
        Math.max(0.9, Math.min(1.1, this.processState.productionRate));

    this.processState.furnaceEfficiency =
        Math.max(0.90, Math.min(0.98, this.processState.furnaceEfficiency));

    // ===========================================
    // Cooling Water
    // ===========================================

    const coolingValue = Math.max(
        80,
        Math.min(
            100,
            95 * this.processState.coolingEfficiency +
            this.random(-0.2, 0.2)
        )
    );

    cooling.updateValue(coolingValue);

    // ===========================================
    // Furnace Temperature
    // ===========================================

    const heatGeneration =
        20 * this.processState.combustionRate;

    const coolingLoss =
        (100 - coolingValue) * 2;

    const targetTemp =
        this.processState.targetTemperature +
        heatGeneration -
        coolingLoss;

    const temperatureValue =
        temp.currentValue +
        (targetTemp - temp.currentValue) * 0.08 +
        this.random(-0.3, 0.3);

    temp.updateValue(temperatureValue);

    // ===========================================
    // Pressure
    // ===========================================

    const pressureTarget =
        8 +
        (temperatureValue - 1500) * 0.01 +
        (this.processState.productionRate - 1) * 0.2;

    pressure.updateValue(

        pressure.currentValue +

        (pressureTarget - pressure.currentValue) * 0.15 +

        this.random(-0.01, 0.01)

    );

    // ===========================================
    // CO Gas
    // ===========================================

    const coTarget =

        30 +

        (temperatureValue - 1500) * 0.12 +

        (pressure.currentValue - 8) * 4;

    co.updateValue(

        co.currentValue +

        (coTarget - co.currentValue) * 0.12 +

        this.random(-0.2, 0.2)

    );

    // ===========================================
    // Top Gas Pressure
    // ===========================================

    const topGasTarget =

        4 +

        (pressure.currentValue - 8) * 0.15;

    topGas.updateValue(

        topGas.currentValue +

        (topGasTarget - topGas.currentValue) * 0.2 +

        this.random(-0.01, 0.01)

    );

    // ===========================================
    // Vibration
    // ===========================================

    const vibrationTarget =

        2 +

        (pressure.currentValue - 8) * 0.3 +

        (temperatureValue - 1500) * 0.003;

    vibration.updateValue(

        vibration.currentValue +

        (vibrationTarget - vibration.currentValue) * 0.15 +

        this.random(-0.01, 0.01)

    );

}
updateCoolingFailure() {

    const temp = this.getSensorById("BF_TEMP_001");
    const pressure = this.getSensorById("BF_PRESS_001");
    const co = this.getSensorById("BF_CO_001");
    const cooling = this.getSensorById("BF_COOL_001");
    const topGas = this.getSensorById("BF_TOP_001");
    const vibration = this.getSensorById("BF_VIB_001");

    // Cooling system degrades continuously

    this.processState.coolingEfficiency -= 0.015;

    this.processState.coolingEfficiency =

        Math.max(0.55, this.processState.coolingEfficiency);

    // Production slows down

    this.processState.productionRate -= 0.002;

    this.processState.productionRate =

        Math.max(0.85, this.processState.productionRate);

    // Reuse normal model

    this.updateNormal();

}
updateProcessState(mode) {

    switch (mode) {

        case "STARTUP":

            this.processState.targetTemperature = 1450;
            this.processState.productionRate = 0.4;
            this.processState.combustionRate = 0.6;
            break;

        case "NORMAL":

            this.processState.targetTemperature = 1515;
            this.processState.productionRate = 1.0;
            this.processState.combustionRate = 1.0;
            break;

        case "HIGH_PRODUCTION":

            this.processState.targetTemperature = 1545;
            this.processState.productionRate = 1.2;
            this.processState.combustionRate = 1.15;
            break;

        case "LOW_PRODUCTION":

            this.processState.targetTemperature = 1485;
            this.processState.productionRate = 0.75;
            this.processState.combustionRate = 0.8;
            break;

        case "MAINTENANCE":

            this.processState.targetTemperature = 1200;
            this.processState.productionRate = 0.2;
            this.processState.combustionRate = 0.3;
            break;

        case "SHUTDOWN":

            this.processState.targetTemperature = 500;
            this.processState.productionRate = 0;
            this.processState.combustionRate = 0;
            break;

        default:

            break;

    }

}
}

module.exports = BlastFurnace;