const Zone = require("../models/Zone");
const Sensor = require("../models/Sensor");

class RawMaterialYard extends Zone {

    constructor() {

        super({

            id: "raw_material_yard",

            name: "Raw Material Yard",

            priority: 8,

            description: "Receives, stores, crushes and supplies raw materials to the Blast Furnace."

        });

        // =====================================================
        // Process State
        // =====================================================

        this.processState = {

            // Operating
            operatingMode: "NORMAL",

            // Stock Levels
            oreStockLevel: 0.88,
            coalStockLevel: 0.81,
            limestoneStockLevel: 0.76,

            // Material Properties
            oreQuality: 0.96,
            coalQuality: 0.95,
            limestoneQuality: 0.97,

            materialMoisture: 0.08,

            // Material Handling
            feederSpeed: 0.84,
            conveyorLoad: 0.62,
            conveyorSpeed: 0.75,

            // Crusher
            crusherEfficiency: 0.96,
            crusherLoad: 0.65,

            // Dust Control
            dustSuppressionEfficiency: 0.97,

            // Equipment Health
            beltHealth: 0.98,
            motorHealth: 0.99,
            crusherHealth: 0.98,

            // Production
            productionDemand: 0.85,

            oreFeedRate: 0,
            coalFeedRate: 0,
            limestoneFeedRate: 0,

            // Consumption
            powerConsumption: 0,
            waterConsumption: 0,

            overallEfficiency: 0.96,

            lastUpdate: new Date()

        };

        this.initializeSensors();

    }

    // =====================================================
    // Initialize Sensors
    // =====================================================

    initializeSensors() {

        this.addSensor(new Sensor({

            id: "RMY_ORE_001",

            name: "Iron Ore Stock",

            type: "level",

            zone: this.id,

            unit: "%",

            minValue: 10,

            maxValue: 100,

            warningLow: 30,

            criticalLow: 15,

            initialValue: 88,

            updateInterval: 5000

        }));

        this.addSensor(new Sensor({

            id: "RMY_COAL_001",

            name: "Coal Stock",

            type: "level",

            zone: this.id,

            unit: "%",

            minValue: 10,

            maxValue: 100,

            warningLow: 30,

            criticalLow: 15,

            initialValue: 81,

            updateInterval: 5000

        }));

        this.addSensor(new Sensor({

            id: "RMY_LIME_001",

            name: "Limestone Stock",

            type: "level",

            zone: this.id,

            unit: "%",

            minValue: 10,

            maxValue: 100,

            warningLow: 25,

            criticalLow: 12,

            initialValue: 76,

            updateInterval: 5000

        }));

        this.addSensor(new Sensor({

            id: "RMY_CONV_SPEED",

            name: "Conveyor Speed",

            type: "speed",

            zone: this.id,

            unit: "m/s",

            minValue: 0.5,

            maxValue: 4,

            warningLow: 1.2,

            criticalLow: 0.8,

            initialValue: 2.8,

            updateInterval: 2000

        }));

        this.addSensor(new Sensor({

            id: "RMY_CURRENT",

            name: "Motor Current",

            type: "current",

            zone: this.id,

            unit: "A",

            minValue: 20,

            maxValue: 150,

            warningHigh: 120,

            criticalHigh: 135,

            initialValue: 74,

            updateInterval: 2000

        }));

        this.addSensor(new Sensor({

            id: "RMY_VIB",

            name: "Crusher Vibration",

            type: "vibration",

            zone: this.id,

            unit: "mm/s",

            minValue: 1,

            maxValue: 8,

            warningHigh: 5,

            criticalHigh: 6.5,

            initialValue: 2.3,

            updateInterval: 3000

        }));

        this.addSensor(new Sensor({

            id: "RMY_DUST",

            name: "Dust Concentration",

            type: "dust",

            zone: this.id,

            unit: "µg/m³",

            minValue: 20,

            maxValue: 250,

            warningHigh: 180,

            criticalHigh: 220,

            initialValue: 75,

            updateInterval: 2000

        }));

        this.addSensor(new Sensor({

            id: "RMY_MOISTURE",

            name: "Material Moisture",

            type: "moisture",

            zone: this.id,

            unit: "%",

            minValue: 1,

            maxValue: 20,

            warningHigh: 14,

            criticalHigh: 17,

            initialValue: 8,

            updateInterval: 4000

        }));

        this.addSensor(new Sensor({

            id: "RMY_BELT_TEMP",

            name: "Conveyor Belt Temperature",

            type: "temperature",

            zone: this.id,

            unit: "°C",

            minValue: 20,

            maxValue: 90,

            warningHigh: 65,

            criticalHigh: 80,

            initialValue: 38,

            updateInterval: 2000

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

                this.processState.productionDemand = 0.45;
                this.processState.feederSpeed = 0.50;
                break;

            case "NORMAL":

                this.processState.productionDemand = 0.85;
                this.processState.feederSpeed = 0.84;
                break;

            case "HIGH_PRODUCTION":

                this.processState.productionDemand = 1.10;
                this.processState.feederSpeed = 1.00;
                break;

            case "LOW_PRODUCTION":

                this.processState.productionDemand = 0.60;
                this.processState.feederSpeed = 0.65;
                break;

            case "MAINTENANCE":

                this.processState.productionDemand = 0.25;
                this.processState.feederSpeed = 0.30;
                break;

            case "SHUTDOWN":

                this.processState.productionDemand = 0.0;
                this.processState.feederSpeed = 0.0;
                break;

        }

    }
        // =====================================================
    // Normal Material Handling Process
    // =====================================================

    updateNormal() {

        const ore = this.getSensor("RMY_ORE_001");
        const coal = this.getSensor("RMY_COAL_001");
        const lime = this.getSensor("RMY_LIME_001");
        const speed = this.getSensor("RMY_CONV_SPEED");
        const current = this.getSensor("RMY_CURRENT");
        const vibration = this.getSensor("RMY_VIB");
        const dust = this.getSensor("RMY_DUST");
        const moisture = this.getSensor("RMY_MOISTURE");
        const beltTemp = this.getSensor("RMY_BELT_TEMP");

        // ==================================================
        // Plant Context
        // ==================================================

        const utilities = this.context?.utilities || {};

        const powerAvailability =
            utilities.powerAvailability ?? 1;

        const waterAvailability =
            utilities.waterAvailability ?? 1;

        // ==================================================
        // Equipment Aging
        // ==================================================

        this.processState.beltHealth +=
            this.random(-0.0002, 0.0002);

        this.processState.motorHealth +=
            this.random(-0.0002, 0.0002);

        this.processState.crusherHealth +=
            this.random(-0.0002, 0.0002);

        this.processState.crusherEfficiency +=
            this.random(-0.0004, 0.0004);

        this.processState.dustSuppressionEfficiency +=
            this.random(-0.0003, 0.0003);

        this.processState.materialMoisture +=
            this.random(-0.0005, 0.0005);

        this.processState.beltHealth =
            Math.max(0.90, Math.min(1.00, this.processState.beltHealth));

        this.processState.motorHealth =
            Math.max(0.90, Math.min(1.00, this.processState.motorHealth));

        this.processState.crusherHealth =
            Math.max(0.90, Math.min(1.00, this.processState.crusherHealth));

        this.processState.crusherEfficiency =
            Math.max(0.85, Math.min(1.00, this.processState.crusherEfficiency));

        this.processState.dustSuppressionEfficiency =
            Math.max(0.80, Math.min(1.00, this.processState.dustSuppressionEfficiency));

        this.processState.materialMoisture =
            Math.max(0.05, Math.min(0.20, this.processState.materialMoisture));

        // ==================================================
        // Feeder Control
        // ==================================================

        const feederTarget =

            this.processState.productionDemand *

            this.processState.crusherEfficiency *

            powerAvailability;

        this.processState.feederSpeed +=

            (feederTarget -
            this.processState.feederSpeed) * 0.08;

        // ==================================================
        // Conveyor Load
        // ==================================================

        const loadTarget =

            this.processState.feederSpeed *

            this.processState.productionDemand;

        this.processState.conveyorLoad +=

            (loadTarget -
            this.processState.conveyorLoad) * 0.08;

        // ==================================================
        // Conveyor Speed
        // ==================================================

        const speedTarget =

            0.8 +

            this.processState.feederSpeed * 2.7;

        this.processState.conveyorSpeed +=

            (speedTarget -
            this.processState.conveyorSpeed) * 0.10;

        // ==================================================
        // Material Consumption
        // ==================================================

        const oreConsumption =
            this.processState.productionDemand * 0.0012;

        const coalConsumption =
            this.processState.productionDemand * 0.0009;

        const limeConsumption =
            this.processState.productionDemand * 0.0005;

        this.processState.oreStockLevel =
            Math.max(0.10,
                this.processState.oreStockLevel -
                oreConsumption);

        this.processState.coalStockLevel =
            Math.max(0.10,
                this.processState.coalStockLevel -
                coalConsumption);

        this.processState.limestoneStockLevel =
            Math.max(0.10,
                this.processState.limestoneStockLevel -
                limeConsumption);

        // ==================================================
        // Production Outputs
        // ==================================================

        this.processState.oreFeedRate =

            this.processState.productionDemand *

            this.processState.oreQuality *

            this.processState.crusherEfficiency *

            100;

        this.processState.coalFeedRate =

            this.processState.productionDemand *

            this.processState.coalQuality *

            this.processState.crusherEfficiency *

            100;

        this.processState.limestoneFeedRate =

            this.processState.productionDemand *

            this.processState.limestoneQuality *

            this.processState.crusherEfficiency *

            100;

        this.processState.powerConsumption =

            this.processState.conveyorLoad * 15;

        this.processState.waterConsumption =

            (1 -

            this.processState.dustSuppressionEfficiency +

            this.processState.materialMoisture) * 6;

        this.processState.overallEfficiency =

            this.processState.crusherEfficiency *

            this.processState.beltHealth *

            this.processState.motorHealth;

        // ==================================================
        // Update Sensors
        // ==================================================

        ore.updateValue(
            this.processState.oreStockLevel * 100 +
            this.random(-0.15,0.15)
        );

        coal.updateValue(
            this.processState.coalStockLevel * 100 +
            this.random(-0.15,0.15)
        );

        lime.updateValue(
            this.processState.limestoneStockLevel * 100 +
            this.random(-0.15,0.15)
        );

        speed.updateValue(
            this.processState.conveyorSpeed +
            this.random(-0.02,0.02)
        );

        current.updateValue(

            35 +

            this.processState.conveyorLoad * 80 +

            (1 -

            this.processState.motorHealth) * 45 +

            this.random(-0.4,0.4)

        );

        vibration.updateValue(

            1.8 +

            (1 -

            this.processState.crusherHealth) * 8 +

            (1 -

            this.processState.crusherEfficiency) * 6 +

            this.random(-0.03,0.03)

        );

        moisture.updateValue(

            this.processState.materialMoisture * 100 +

            this.random(-0.08,0.08)

        );

        dust.updateValue(

            40 +

            this.processState.conveyorLoad * 85 +

            this.processState.materialMoisture * 180 -

            this.processState.dustSuppressionEfficiency * 55 +

            this.random(-0.4,0.4)

        );

        beltTemp.updateValue(

            30 +

            this.processState.conveyorLoad * 16 +

            (1 -

            this.processState.beltHealth) * 50 +

            this.random(-0.15,0.15)

        );

        this.processState.lastUpdate = new Date();

    }
        // =====================================================
    // Conveyor Jam
    // =====================================================

    updateConveyorJam() {

        this.processState.feederSpeed *= 0.75;
        this.processState.conveyorLoad += 0.15;
        this.processState.beltHealth -= 0.003;

        this.updateNormal();

    }

    // =====================================================
    // Wet Material
    // =====================================================

    updateWetMaterial() {

        this.processState.materialMoisture += 0.02;
        this.processState.crusherEfficiency -= 0.01;

        this.updateNormal();

    }

    // =====================================================
    // Dust Suppression Failure
    // =====================================================

    updateDustFailure() {

        this.processState.dustSuppressionEfficiency -= 0.02;

        this.processState.dustSuppressionEfficiency =
            Math.max(
                0.50,
                this.processState.dustSuppressionEfficiency
            );

        this.updateNormal();

    }

    // =====================================================
    // Low Stock Scenario
    // =====================================================

    updateLowStock() {

        this.processState.oreStockLevel -= 0.01;
        this.processState.coalStockLevel -= 0.008;
        this.processState.limestoneStockLevel -= 0.006;

        this.updateNormal();

    }

    // =====================================================
    // Publish Industrial Data
    // =====================================================

    publishData() {

        const dust = this.getSensor("RMY_DUST");
        const current = this.getSensor("RMY_CURRENT");
        const vibration = this.getSensor("RMY_VIB");

        const alarms = [];

        if (dust.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Dust Collector",

                message: "Dust concentration exceeded safe limit."

            });

        }

        if (current.status === "CRITICAL") {

            alarms.push({

                severity: "WARNING",

                equipment: "Conveyor Motor",

                message: "Motor current is abnormally high."

            });

        }

        if (vibration.status === "CRITICAL") {

            alarms.push({

                severity: "WARNING",

                equipment: "Crusher",

                message: "Crusher vibration is excessive."

            });

        }

        return {

            production: {

                oreFeedRate:
                    Number(this.processState.oreFeedRate.toFixed(2)),

                coalFeedRate:
                    Number(this.processState.coalFeedRate.toFixed(2)),

                limestoneFeedRate:
                    Number(this.processState.limestoneFeedRate.toFixed(2))

            },

            inventory: {

                oreStock:
                    Number((this.processState.oreStockLevel * 100).toFixed(2)),

                coalStock:
                    Number((this.processState.coalStockLevel * 100).toFixed(2)),

                limestoneStock:
                    Number((this.processState.limestoneStockLevel * 100).toFixed(2))

            },

            utilities: {

                powerConsumption:
                    Number(this.processState.powerConsumption.toFixed(2)),

                waterConsumption:
                    Number(this.processState.waterConsumption.toFixed(2))

            },

            equipment: {

                beltHealth:
                    Number((this.processState.beltHealth * 100).toFixed(2)),

                motorHealth:
                    Number((this.processState.motorHealth * 100).toFixed(2)),

                crusherHealth:
                    Number((this.processState.crusherHealth * 100).toFixed(2))

            },

            environment: {

                dustLevel:
                    Number(dust.currentValue.toFixed(2))

            },

            health: {

                availability:
                    Number((this.processState.beltHealth * 100).toFixed(2)),

                performance:
                    Number((this.processState.overallEfficiency * 100).toFixed(2)),

                quality:
                    Number((this.processState.oreQuality * 100).toFixed(2))

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

            productionDemand:
                Number(this.processState.productionDemand.toFixed(3)),

            overallEfficiency:
                Number(this.processState.overallEfficiency.toFixed(3)),

            crusherEfficiency:
                Number(this.processState.crusherEfficiency.toFixed(3)),

            beltHealth:
                Number(this.processState.beltHealth.toFixed(3)),

            motorHealth:
                Number(this.processState.motorHealth.toFixed(3)),

            crusherHealth:
                Number(this.processState.crusherHealth.toFixed(3)),

            oreFeedRate:
                Number(this.processState.oreFeedRate.toFixed(2)),

            coalFeedRate:
                Number(this.processState.coalFeedRate.toFixed(2)),

            limestoneFeedRate:
                Number(this.processState.limestoneFeedRate.toFixed(2))

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

            case "CONVEYOR_JAM":

                this.updateConveyorJam();
                break;

            case "WET_MATERIAL":

                this.updateWetMaterial();
                break;

            case "DUST_FAILURE":

                this.updateDustFailure();
                break;

            case "LOW_STOCK":

                this.updateLowStock();
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

module.exports = RawMaterialYard;