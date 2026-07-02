const Zone = require("../models/Zone");
const Sensor = require("../models/Sensor");

class CokeOven extends Zone {

    constructor() {

        super({

            id: "coke_oven",

            name: "Coke Oven",

            priority: 9,

            description: "Converts metallurgical coal into coke through high-temperature carbonization."

        });

        // =====================================================
        // Process State
        // =====================================================

        this.processState = {

            // Operating Mode
            operatingMode: "NORMAL",

            // Coal Charging
            coalFeedRate: 1.0,

            coalMoisture: 0.08,

            coalQuality: 0.95,

            chargingEfficiency: 0.97,

            // Heating
            heatingRate: 1.0,

            heatingEfficiency: 0.96,

            combustionEfficiency: 0.95,

            // Carbonization
            carbonizationProgress: 0,

            carbonizationEfficiency: 0.95,

            ovenTemperatureTarget: 1100,

            // Gas Collection
            gasExtractionEfficiency: 0.97,

            gasHolderPressure: 1.0,

            // Equipment
            ovenHealth: 0.98,

            doorSealHealth: 0.99,

            wallIntegrity: 0.98,

            // Production
            cokeProduction: 0,

            cokeOvenGas: 0,

            tarProduction: 0,

            ammoniaProduction: 0,

            benzolProduction: 0,

            // Consumption
            energyConsumption: 0,

            gasConsumption: 0,

            // Overall
            productionRate: 1.0,

            thermalEfficiency: 0.95,

            lastUpdate: new Date()

        };

        this.initializeSensors();

    }

    // =====================================================
    // Initialize Sensors
    // =====================================================

    initializeSensors() {

        this.addSensor(new Sensor({

            id: "CO_TEMP_001",

            name: "Oven Temperature",

            type: "temperature",

            zone: this.id,

            unit: "°C",

            minValue: 950,

            maxValue: 1200,

            warningHigh: 1160,

            criticalHigh: 1190,

            initialValue: 1080,

            updateInterval: 2000

        }));

        this.addSensor(new Sensor({

            id: "CO_PRESS_001",

            name: "Gas Pressure",

            type: "pressure",

            zone: this.id,

            unit: "bar",

            minValue: 0.8,

            maxValue: 2.0,

            warningHigh: 1.8,

            criticalHigh: 1.95,

            initialValue: 1.2,

            updateInterval: 2000

        }));

        this.addSensor(new Sensor({

            id: "CO_GAS_001",

            name: "Coke Oven Gas",

            type: "gas",

            zone: this.id,

            unit: "%",

            minValue: 60,

            maxValue: 90,

            warningLow: 65,

            criticalLow: 62,

            initialValue: 75,

            updateInterval: 2000

        }));

        this.addSensor(new Sensor({

            id: "CO_FLOW_001",

            name: "Gas Flow",

            type: "flow",

            zone: this.id,

            unit: "Nm³/hr",

            minValue: 4000,

            maxValue: 7000,

            warningLow: 4500,

            criticalLow: 4200,

            initialValue: 5500,

            updateInterval: 2000

        }));

        this.addSensor(new Sensor({

            id: "CO_WALL_001",

            name: "Wall Temperature",

            type: "temperature",

            zone: this.id,

            unit: "°C",

            minValue: 250,

            maxValue: 450,

            warningHigh: 420,

            criticalHigh: 440,

            initialValue: 340,

            updateInterval: 3000

        }));

        this.addSensor(new Sensor({

            id: "CO_DOOR_001",

            name: "Door Leakage",

            type: "gas",

            zone: this.id,

            unit: "%",

            minValue: 0,

            maxValue: 10,

            warningHigh: 6,

            criticalHigh: 8,

            initialValue: 2,

            updateInterval: 3000

        }));

        this.addSensor(new Sensor({

            id: "CO_VIB_001",

            name: "Charging Machine Vibration",

            type: "vibration",

            zone: this.id,

            unit: "mm/s",

            minValue: 1,

            maxValue: 5,

            warningHigh: 4,

            criticalHigh: 4.5,

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

                this.processState.productionRate = 0.45;
                this.processState.heatingRate = 0.60;
                this.processState.ovenTemperatureTarget = 900;
                break;

            case "NORMAL":

                this.processState.productionRate = 1.00;
                this.processState.heatingRate = 1.00;
                this.processState.ovenTemperatureTarget = 1100;
                break;

            case "HIGH_PRODUCTION":

                this.processState.productionRate = 1.15;
                this.processState.heatingRate = 1.10;
                this.processState.ovenTemperatureTarget = 1140;
                break;

            case "LOW_PRODUCTION":

                this.processState.productionRate = 0.70;
                this.processState.heatingRate = 0.75;
                this.processState.ovenTemperatureTarget = 1020;
                break;

            case "MAINTENANCE":

                this.processState.productionRate = 0.20;
                this.processState.heatingRate = 0.30;
                this.processState.ovenTemperatureTarget = 650;
                break;

            case "SHUTDOWN":

                this.processState.productionRate = 0;
                this.processState.heatingRate = 0;
                this.processState.ovenTemperatureTarget = 100;
                break;

        }

    }
        // =====================================================
    // Normal Carbonization Process
    // =====================================================

    updateNormal() {

        const ovenTemp = this.getSensor("CO_TEMP_001");
        const pressure = this.getSensor("CO_PRESS_001");
        const gas = this.getSensor("CO_GAS_001");
        const flow = this.getSensor("CO_FLOW_001");
        const wallTemp = this.getSensor("CO_WALL_001");
        const leakage = this.getSensor("CO_DOOR_001");
        const vibration = this.getSensor("CO_VIB_001");

        // ==============================================
        // Plant Context
        // ==============================================

        const utilities = this.context?.utilities || {};

        const powerAvailability =
            utilities.powerAvailability ?? 1;

        const fuelAvailability =
            utilities.fuelAvailability ?? 1;

        // ==============================================
        // Equipment Aging
        // ==============================================

        this.processState.ovenHealth +=
            this.random(-0.0002, 0.0002);

        this.processState.wallIntegrity +=
            this.random(-0.0003, 0.0003);

        this.processState.doorSealHealth +=
            this.random(-0.0004, 0.0004);

        this.processState.heatingEfficiency +=
            this.random(-0.0004, 0.0004);

        this.processState.gasExtractionEfficiency +=
            this.random(-0.0003, 0.0003);

        this.processState.ovenHealth =
            Math.max(0.90, Math.min(1.00,
            this.processState.ovenHealth));

        this.processState.wallIntegrity =
            Math.max(0.90, Math.min(1.00,
            this.processState.wallIntegrity));

        this.processState.doorSealHealth =
            Math.max(0.85, Math.min(1.00,
            this.processState.doorSealHealth));

        this.processState.heatingEfficiency =
            Math.max(0.85, Math.min(1.00,
            this.processState.heatingEfficiency));

        this.processState.gasExtractionEfficiency =
            Math.max(0.90, Math.min(1.00,
            this.processState.gasExtractionEfficiency));

        // ==============================================
        // Heating System
        // ==============================================

        const heatingPower =

            this.processState.heatingRate *

            this.processState.heatingEfficiency *

            fuelAvailability *

            powerAvailability;

        // ==============================================
        // Carbonization Progress
        // ==============================================

        const targetProgress =

            heatingPower *

            this.processState.coalQuality *

            this.processState.chargingEfficiency;

        this.processState.carbonizationProgress =
            this.processState.carbonizationProgress || 0;

        this.processState.carbonizationProgress +=

            (targetProgress -

            this.processState.carbonizationProgress) * 0.05;

        // ==============================================
        // Oven Temperature
        // ==============================================

        const targetTemperature =

            this.processState.ovenTemperatureTarget +

            (heatingPower * 45) -

            (this.processState.coalMoisture * 120);

        ovenTemp.updateValue(

            ovenTemp.currentValue +

            (targetTemperature -

            ovenTemp.currentValue) * 0.08 +

            this.random(-0.25, 0.25)

        );

        // ==============================================
        // Wall Temperature
        // ==============================================

        const wallTarget =

            ovenTemp.currentValue *

            0.31 *

            this.processState.wallIntegrity;

        wallTemp.updateValue(

            wallTemp.currentValue +

            (wallTarget -

            wallTemp.currentValue) * 0.10 +

            this.random(-0.20,0.20)

        );

        // ==============================================
        // Coke Oven Gas
        // ==============================================

        const gasTarget =

            70 +

            (this.processState.carbonizationProgress * 12);

        gas.updateValue(

            gas.currentValue +

            (gasTarget -

            gas.currentValue) * 0.10 +

            this.random(-0.15,0.15)

        );

        // ==============================================
        // Gas Flow
        // ==============================================

        const flowTarget =

            4200 +

            (gas.currentValue * 28);

        flow.updateValue(

            flow.currentValue +

            (flowTarget -

            flow.currentValue) * 0.10 +

            this.random(-3,3)

        );

        // ==============================================
        // Gas Pressure
        // ==============================================

        const pressureTarget =

            1.0 +

            (flow.currentValue / 7000) *

            this.processState.gasExtractionEfficiency;

        pressure.updateValue(

            pressure.currentValue +

            (pressureTarget -

            pressure.currentValue) * 0.10 +

            this.random(-0.005,0.005)

        );

        // ==============================================
        // Door Leakage
        // ==============================================

        const leakageTarget =

            (1 -

            this.processState.doorSealHealth) * 100;

        leakage.updateValue(

            leakage.currentValue +

            (leakageTarget -

            leakage.currentValue) * 0.08 +

            this.random(-0.03,0.03)

        );

        // ==============================================
        // Charging Machine Vibration
        // ==============================================

        const vibrationTarget =

            1.8 +

            ((1 -

            this.processState.ovenHealth) * 8);

        vibration.updateValue(

            vibration.currentValue +

            (vibrationTarget -

            vibration.currentValue) * 0.10 +

            this.random(-0.02,0.02)

        );

        // ==============================================
        // Production Model
        // ==============================================

        const production =

            this.processState.productionRate *

            this.processState.coalQuality *

            this.processState.heatingEfficiency *

            this.processState.carbonizationEfficiency;

        this.processState.cokeProduction =
            production * 100;

        this.processState.cokeOvenGas =
            this.processState.cokeProduction * 0.33;

        this.processState.tarProduction =
            this.processState.cokeProduction * 0.045;

        this.processState.ammoniaProduction =
            this.processState.cokeProduction * 0.018;

        this.processState.benzolProduction =
            this.processState.cokeProduction * 0.012;

        this.processState.energyConsumption =
            this.processState.cokeProduction * 0.27;

        this.processState.gasConsumption =
            this.processState.cokeProduction * 0.16;

        this.processState.thermalEfficiency =

            this.processState.heatingEfficiency *

            this.processState.carbonizationEfficiency;

        this.processState.lastUpdate =
            new Date();

    }
        // =====================================================
    // Heating Failure
    // =====================================================

    updateHeatingFailure() {

        this.processState.heatingEfficiency -= 0.01;

        this.processState.heatingEfficiency =
            Math.max(0.60, this.processState.heatingEfficiency);

        this.processState.ovenHealth -= 0.001;

        this.updateNormal();

    }

    // =====================================================
    // Door Leakage
    // =====================================================

    updateDoorLeakage() {

        this.processState.doorSealHealth -= 0.01;

        this.processState.doorSealHealth =
            Math.max(0.50, this.processState.doorSealHealth);

        this.updateNormal();

    }

    // =====================================================
    // Gas Main Blockage
    // =====================================================

    updateGasMainBlockage() {

        this.processState.gasExtractionEfficiency -= 0.015;

        this.processState.gasExtractionEfficiency =
            Math.max(0.60, this.processState.gasExtractionEfficiency);

        this.updateNormal();

    }

    // =====================================================
    // Fire
    // =====================================================

    updateFire() {

        this.processState.heatingRate += 0.02;

        this.processState.heatingEfficiency += 0.01;

        this.processState.wallIntegrity -= 0.003;

        this.updateNormal();

    }

    // =====================================================
    // Gas Leak
    // =====================================================

    updateGasLeak() {

        this.processState.doorSealHealth -= 0.005;

        this.processState.gasExtractionEfficiency -= 0.005;

        this.updateNormal();

    }

    // =====================================================
    // Publish Data
    // =====================================================

    publishData() {

        const ovenTemp = this.getSensor("CO_TEMP_001");
        const pressure = this.getSensor("CO_PRESS_001");
        const gas = this.getSensor("CO_GAS_001");
        const flow = this.getSensor("CO_FLOW_001");
        const leakage = this.getSensor("CO_DOOR_001");
        const vibration = this.getSensor("CO_VIB_001");

        const alarms = [];

        if (ovenTemp.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Coke Oven",

                message: "Oven temperature exceeded safe operating limit."

            });

        }

        if (pressure.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Gas Main",

                message: "Gas pressure is critically high."

            });

        }

        if (leakage.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Door Seal",

                message: "Door leakage exceeds safe limit."

            });

        }

        return {

            production: {

                cokeProduction:

                    Number(this.processState.cokeProduction.toFixed(2)),

                cokeOvenGas:

                    Number(this.processState.cokeOvenGas.toFixed(2)),

                tarProduction:

                    Number(this.processState.tarProduction.toFixed(2)),

                ammoniaProduction:

                    Number(this.processState.ammoniaProduction.toFixed(2)),

                benzolProduction:

                    Number(this.processState.benzolProduction.toFixed(2))

            },

            utilities: {

                energyConsumption:

                    Number(this.processState.energyConsumption.toFixed(2)),

                gasConsumption:

                    Number(this.processState.gasConsumption.toFixed(2))

            },

            emissions: {

                cokeOvenGas:

                    Number(gas.currentValue.toFixed(2))

            },

            equipment: {

                ovenHealth:

                    Number((this.processState.ovenHealth * 100).toFixed(2)),

                wallIntegrity:

                    Number((this.processState.wallIntegrity * 100).toFixed(2)),

                doorSealHealth:

                    Number((this.processState.doorSealHealth * 100).toFixed(2)),

                vibration:

                    Number(vibration.currentValue.toFixed(2))

            },

            health: {

                availability:

                    Number((this.processState.ovenHealth * 100).toFixed(2)),

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

            heatingEfficiency:

                Number(this.processState.heatingEfficiency.toFixed(3)),

            carbonizationEfficiency:

                Number(this.processState.carbonizationEfficiency.toFixed(3)),

            ovenHealth:

                Number(this.processState.ovenHealth.toFixed(3)),

            wallIntegrity:

                Number(this.processState.wallIntegrity.toFixed(3)),

            doorSealHealth:

                Number(this.processState.doorSealHealth.toFixed(3)),

            cokeProduction:

                Number(this.processState.cokeProduction.toFixed(2)),

            cokeOvenGas:

                Number(this.processState.cokeOvenGas.toFixed(2)),

            tarProduction:

                Number(this.processState.tarProduction.toFixed(2)),

            ammoniaProduction:

                Number(this.processState.ammoniaProduction.toFixed(2)),

            benzolProduction:

                Number(this.processState.benzolProduction.toFixed(2))

        };

    }

    // =====================================================
    // Update
    // =====================================================

    update({ context, scenario }) {

        this.context = context;

        this.updateProcessState(

            context.plantState.operatingMode

        );

        switch (scenario) {

            case "HEATING_FAILURE":

                this.updateHeatingFailure();
                break;

            case "DOOR_LEAKAGE":

                this.updateDoorLeakage();
                break;

            case "GAS_MAIN_BLOCKAGE":

                this.updateGasMainBlockage();
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

module.exports = CokeOven;