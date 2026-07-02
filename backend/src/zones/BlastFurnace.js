const Zone = require("../models/Zone");
const Sensor = require("../models/Sensor");

class BlastFurnace extends Zone {

    constructor() {

        super({

            id: "blast_furnace",

            name: "Blast Furnace",

            priority: 10,

            description: "Converts iron ore into molten iron using coke and hot air."

        });

        // =====================================================
        // Process State
        // =====================================================

        this.processState = {

            // Operating
            operatingMode: "NORMAL",

            // Furnace Process
            targetTemperature: 1515,
            combustionRate: 1.0,
            blastAirFlow: 1.0,
            oxygenEnrichment: 0.95,
            burdenQuality: 0.96,

            // Cooling
            coolingEfficiency: 1.0,

            // Production
            productionRate: 1.0,
            furnaceEfficiency: 0.95,
            thermalEfficiency: 0.93,

            // Outputs
            hotMetalProduction: 0,
            slagProduction: 0,
            topGasGeneration: 0,

            // Consumption
            cokeConsumption: 0,
            energyConsumption: 0,

            // Equipment
            furnaceHealth: 0.98,

            // Internal Physics
            heatBalance: 1.0,

            lastUpdate: new Date()

        };

        this.initializeSensors();

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

        // Cooling Water

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
    // Helpers
    // =====================================================

    random(min, max) {

        return Math.random() * (max - min) + min;

    }

    // Uses getSensor() from Zone.js
    getSensor(id) {

        return this.sensors.find(sensor => sensor.id === id);

    }

    // =====================================================
    // Operating Modes
    // =====================================================

    updateProcessState(mode) {

        this.processState.operatingMode = mode;

        switch (mode) {

            case "STARTUP":

                this.processState.targetTemperature = 1450;
                this.processState.productionRate = 0.45;
                this.processState.combustionRate = 0.55;
                break;

            case "NORMAL":

                this.processState.targetTemperature = 1515;
                this.processState.productionRate = 1.0;
                this.processState.combustionRate = 1.0;
                break;

            case "HIGH_PRODUCTION":

                this.processState.targetTemperature = 1545;
                this.processState.productionRate = 1.15;
                this.processState.combustionRate = 1.10;
                break;

            case "LOW_PRODUCTION":

                this.processState.targetTemperature = 1485;
                this.processState.productionRate = 0.75;
                this.processState.combustionRate = 0.80;
                break;

            case "MAINTENANCE":

                this.processState.targetTemperature = 1200;
                this.processState.productionRate = 0.20;
                this.processState.combustionRate = 0.30;
                break;

            case "SHUTDOWN":

                this.processState.targetTemperature = 500;
                this.processState.productionRate = 0;
                this.processState.combustionRate = 0;
                break;

        }

    }
        // =====================================================
    // Normal Blast Furnace Process
    // =====================================================

    updateNormal() {

        const temp = this.getSensor("BF_TEMP_001");
        const pressure = this.getSensor("BF_PRESS_001");
        const co = this.getSensor("BF_CO_001");
        const cooling = this.getSensor("BF_COOL_001");
        const topGas = this.getSensor("BF_TOP_001");
        const vibration = this.getSensor("BF_VIB_001");

        // ===============================================
        // Plant Context (Future Cross-Zone Integration)
        // ===============================================

        const utilities = this.context?.utilities || {};

        const powerAvailability =
            utilities.powerAvailability ?? 1;

        const waterAvailability =
            utilities.waterAvailability ?? 1;

        // ===============================================
        // Slow Equipment Degradation
        // ===============================================

        this.processState.furnaceHealth +=
            this.random(-0.0002, 0.0002);

        this.processState.coolingEfficiency +=
            this.random(-0.001, 0.001);

        this.processState.burdenQuality +=
            this.random(-0.0005, 0.0005);

        this.processState.furnaceEfficiency +=
            this.random(-0.0004, 0.0004);

        this.processState.furnaceHealth =
            Math.max(0.90,
            Math.min(1.00,
            this.processState.furnaceHealth));

        this.processState.coolingEfficiency =
            Math.max(0.85,
            Math.min(1.00,
            this.processState.coolingEfficiency));

        this.processState.burdenQuality =
            Math.max(0.85,
            Math.min(1.00,
            this.processState.burdenQuality));

        this.processState.furnaceEfficiency =
            Math.max(0.90,
            Math.min(0.99,
            this.processState.furnaceEfficiency));

        // ===============================================
        // Blast Air Flow
        // ===============================================

        this.processState.blastAirFlow +=

            (this.processState.productionRate -

            this.processState.blastAirFlow) * 0.05;

        // ===============================================
        // Heat Balance
        // ===============================================

        this.processState.heatBalance =

            this.processState.combustionRate *

            this.processState.blastAirFlow *

            this.processState.burdenQuality *

            powerAvailability;

        // ===============================================
        // Cooling Water
        // ===============================================

        const coolingTarget =

            95 *

            this.processState.coolingEfficiency *

            waterAvailability;

        cooling.updateValue(

            cooling.currentValue +

            (coolingTarget -

            cooling.currentValue) * 0.10 +

            this.random(-0.20, 0.20)

        );

        // ===============================================
        // Furnace Temperature
        // ===============================================

     const coolingLoss = Math.max(0, 95 - cooling.currentValue);

    const targetTemperature =

    this.processState.targetTemperature +

    (this.processState.heatBalance * 45) +

    (coolingLoss * 2.5) +

    ((1 - this.processState.furnaceHealth) * 15);

        temp.updateValue(

            temp.currentValue +

            (targetTemperature -

            temp.currentValue) * 0.08 +

            this.random(-0.25, 0.25)

        );

        // ===============================================
        // Furnace Pressure
        // ===============================================

        const coolingStress = Math.max(0,95-cooling.currentValue);

const pressureTarget =

    7.8 +

    (temp.currentValue-1500)*0.012 +

    this.processState.productionRate*0.25 +

    coolingStress*0.025;

        pressure.updateValue(

            pressure.currentValue +

            (pressureTarget -

            pressure.currentValue) * 0.10 +

            this.random(-0.01, 0.01)

        );

        // ===============================================
        // CO Generation
        // ===============================================

        

const coTarget =

    28 +

    (this.processState.combustionRate*6) +

    (pressure.currentValue-8)*4 +

    coolingStress*0.4;

        co.updateValue(

            co.currentValue +

            (coTarget -

            co.currentValue) * 0.10 +

            this.random(-0.15, 0.15)

        );

        // ===============================================
        // Top Gas
        // ===============================================

        const topGasTarget =

            4 +

            (pressure.currentValue - 8) * 0.18;

        topGas.updateValue(

            topGas.currentValue +

            (topGasTarget -

            topGas.currentValue) * 0.12 +

            this.random(-0.01, 0.01)

        );

        // ===============================================
        // Furnace Vibration
        // ===============================================

        

const vibrationTarget =

    1.8 +

    (pressure.currentValue-8)*0.4 +

    ((1-this.processState.furnaceHealth)*6) +

    coolingStress*0.03;

        vibration.updateValue(

            vibration.currentValue +

            (vibrationTarget -

            vibration.currentValue) * 0.10 +

            this.random(-0.02, 0.02)

        );

        // ===============================================
        // Production Model
        // ===============================================

        const productionFactor =

    (this.processState.coolingEfficiency*0.35)+

    (this.processState.furnaceHealth*0.65);

this.processState.hotMetalProduction =

    this.processState.productionRate *

    this.processState.furnaceEfficiency *

    this.processState.burdenQuality *

    productionFactor *

    100;

        this.processState.slagProduction =

            this.processState.hotMetalProduction *

            0.12;

        this.processState.topGasGeneration =

            this.processState.hotMetalProduction *

            0.82;

        this.processState.cokeConsumption =

            this.processState.hotMetalProduction *

            0.42;

        this.processState.energyConsumption =

            this.processState.hotMetalProduction *

            0.21;

        this.processState.thermalEfficiency =

            this.processState.furnaceEfficiency *

            this.processState.coolingEfficiency;

        this.processState.lastUpdate = new Date();

    }
        // =====================================================
    // Cooling Failure
    // =====================================================

    updateCoolingFailure() {

        this.processState.coolingEfficiency -= 0.01;

        this.processState.coolingEfficiency =
            Math.max(0.60, this.processState.coolingEfficiency);

        this.processState.coolingEfficiency-=0.003; ;

        this.updateNormal();

    }

    // =====================================================
    // Gas Leak
    // =====================================================

    updateGasLeak() {

        const co = this.getSensor("BF_CO_001");

        co.updateValue(

            co.currentValue +

            this.random(2, 4)

        );

        this.processState.topGasGeneration += 3;

        this.updateNormal();

    }

    // =====================================================
    // Pressure Rise
    // =====================================================

    updatePressureRise() {

        const pressure = this.getSensor("BF_PRESS_001");

        pressure.updateValue(

            pressure.currentValue +

            this.random(0.15, 0.25)

        );

        this.processState.combustionRate += 0.02;

        this.updateNormal();

    }

    // =====================================================
    // Furnace Fire
    // =====================================================

    updateFire() {

        this.processState.combustionRate += 0.03;
        this.processState.blastAirFlow+=0.015;

this.processState.blastAirFlow=

Math.min(

1.2,

this.processState.blastAirFlow

);

        this.processState.coolingEfficiency -= 0.02;

        this.processState.furnaceHealth -= 0.002;

        this.updateNormal();

    }

    // =====================================================
    // Publish Industrial Data
    // =====================================================

    publishData() {

        const temp = this.getSensor("BF_TEMP_001");
        const pressure = this.getSensor("BF_PRESS_001");
        const co = this.getSensor("BF_CO_001");
        const cooling = this.getSensor("BF_COOL_001");
        const vibration = this.getSensor("BF_VIB_001");

        const alarms = [];

        if (temp.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Blast Furnace",

                message: "Furnace temperature exceeds safe limit."

            });

        }

        if (pressure.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Blast Furnace",

                message: "Blast furnace pressure is critically high."

            });

        }

        if (cooling.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Cooling System",

                message: "Cooling water flow is critically low."

            });

        }

        return {

            production: {

                hotMetalProduction:
                    Number(this.processState.hotMetalProduction.toFixed(2)),

                slagProduction:
                    Number(this.processState.slagProduction.toFixed(2)),

                topGasGeneration:
                    Number(this.processState.topGasGeneration.toFixed(2)),

                cokeConsumption:
                    Number(this.processState.cokeConsumption.toFixed(2))

            },

            utilities: {

                energyConsumption:
                    Number(this.processState.energyConsumption.toFixed(2)),

                coolingWater:
                    Number(cooling.currentValue.toFixed(2))

            },

            emissions: {

                co:
                    Number(co.currentValue.toFixed(2)),

                co2:
                    Number((co.currentValue * 2.6).toFixed(2))

            },

            equipment: {

                furnaceHealth:
                    Number((this.processState.furnaceHealth * 100).toFixed(2)),

                coolingEfficiency:
                    Number((this.processState.coolingEfficiency * 100).toFixed(2)),

                vibration:
                    Number(vibration.currentValue.toFixed(2))

            },

            health: {

                availability:
                    Number((this.processState.furnaceHealth * 100).toFixed(2)),

                performance:
                    Number((this.processState.productionRate * 100).toFixed(2)),

                quality:
                    Number((this.processState.thermalEfficiency * 100).toFixed(2))

            },

            alarms

        };

    }

    // =====================================================
    // Process Summary
    // =====================================================

    getProcessSummary() {

        return {

            operatingMode:
                this.processState.operatingMode,

            productionRate:
                Number(this.processState.productionRate.toFixed(3)),

            furnaceEfficiency:
                Number(this.processState.furnaceEfficiency.toFixed(3)),

            thermalEfficiency:
                Number(this.processState.thermalEfficiency.toFixed(3)),

            combustionRate:
                Number(this.processState.combustionRate.toFixed(3)),

            coolingEfficiency:
                Number(this.processState.coolingEfficiency.toFixed(3)),

            furnaceHealth:
                Number(this.processState.furnaceHealth.toFixed(3)),

            hotMetalProduction:
                Number(this.processState.hotMetalProduction.toFixed(2)),

            slagProduction:
                Number(this.processState.slagProduction.toFixed(2)),

            topGasGeneration:
                Number(this.processState.topGasGeneration.toFixed(2)),

            cokeConsumption:
                Number(this.processState.cokeConsumption.toFixed(2)),

            energyConsumption:
                Number(this.processState.energyConsumption.toFixed(2))

        };

    }

    // =====================================================
    // Main Update
    // =====================================================

    update({ context, scenario }) {

        this.context = context;

        this.updateProcessState(

            context.plantState.operatingMode

        );

        switch (scenario) {

            case "COOLING_FAILURE":

                this.updateCoolingFailure();
                break;

            case "PRESSURE_RISE":

                this.updatePressureRise();
                break;

            case "GAS_LEAK":

                this.updateGasLeak();
                break;

            case "FIRE":

                this.updateFire();
                break;

            default:

                this.updateNormal();
                break;

        }

        super.update();

    }

    // =====================================================
    // JSON
    // =====================================================

    toJSON() {

        return {

            ...super.toJSON(),

            processState: this.getProcessSummary()

        };

    }

}

module.exports = BlastFurnace;