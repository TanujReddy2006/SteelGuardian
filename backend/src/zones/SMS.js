const Zone = require("../models/Zone");
const Sensor = require("../models/Sensor");

class SMS extends Zone {

    constructor() {

        super({

            id: "sms",

            name: "Steel Melting Shop",

            priority: 10,

            description: "Converts hot metal into molten steel using oxygen refining."

        });

        // =====================================================
        // Process State
        // =====================================================

        this.processState = {

            // Operating

            operatingMode: "NORMAL",

            // Material Feed

            hotMetalFeed: 0.90,

            scrapRatio: 0.22,

            limeAddition: 0.14,

            oxygenFlowRate: 0.88,

            // Furnace

            furnaceEfficiency: 0.95,

            furnaceHealth: 0.98,

            electrodeHealth: 0.97,

            refractoryHealth: 0.98,

            // Refining

            refiningProgress: 0.82,

            carbonRemovalEfficiency: 0.96,

            slagFormation: 0.35,

            tapLevel: 0.78,

            // Steel Quality

            steelPurity: 0.992,

            steelYield: 0.96,

            // Production

            moltenSteelProduction: 0,

            slagProduction: 0,

            oxygenConsumption: 0,

            powerConsumption: 0,

            thermalEfficiency: 0.95,

            // Equipment

            vibrationIndex: 1,

            lastUpdate: new Date()

        };

        this.initializeSensors();

    }

    // =====================================================
    // Sensors
    // =====================================================

    initializeSensors() {

        this.addSensor(new Sensor({

            id:"SMS_TEMP",

            name:"Furnace Temperature",

            type:"temperature",

            zone:this.id,

            unit:"°C",

            minValue:1500,

            maxValue:1750,

            warningHigh:1690,

            criticalHigh:1725,

            initialValue:1625,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"SMS_OXYGEN",

            name:"Oxygen Flow",

            type:"flow",

            zone:this.id,

            unit:"Nm³/min",

            minValue:100,

            maxValue:300,

            warningLow:140,

            criticalLow:120,

            initialValue:220,

            updateInterval:1000

        }));

        this.addSensor(new Sensor({

            id:"SMS_PRESSURE",

            name:"Furnace Pressure",

            type:"pressure",

            zone:this.id,

            unit:"bar",

            minValue:0.5,

            maxValue:2.5,

            warningHigh:2,

            criticalHigh:2.3,

            initialValue:1.3,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"SMS_CARBON",

            name:"Carbon Content",

            type:"composition",

            zone:this.id,

            unit:"%",

            minValue:0.02,

            maxValue:4.5,

            warningHigh:1.5,

            criticalHigh:2.2,

            initialValue:0.55,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"SMS_PURITY",

            name:"Steel Purity",

            type:"purity",

            zone:this.id,

            unit:"%",

            minValue:95,

            maxValue:100,

            warningLow:98.5,

            criticalLow:97.5,

            initialValue:99.2,

            updateInterval:3000

        }));

        this.addSensor(new Sensor({

            id:"SMS_SLAG",

            name:"Slag Level",

            type:"level",

            zone:this.id,

            unit:"%",

            minValue:0,

            maxValue:100,

            warningHigh:75,

            criticalHigh:90,

            initialValue:32,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"SMS_LADLE",

            name:"Ladle Level",

            type:"level",

            zone:this.id,

            unit:"%",

            minValue:0,

            maxValue:100,

            warningHigh:95,

            criticalHigh:99,

            initialValue:72,

            updateInterval:3000

        }));

        this.addSensor(new Sensor({

            id:"SMS_CURRENT",

            name:"Electrode Current",

            type:"current",

            zone:this.id,

            unit:"kA",

            minValue:10,

            maxValue:60,

            warningHigh:48,

            criticalHigh:55,

            initialValue:36,

            updateInterval:1000

        }));

        this.addSensor(new Sensor({

            id:"SMS_POWER",

            name:"Power Consumption",

            type:"power",

            zone:this.id,

            unit:"MW",

            minValue:5,

            maxValue:80,

            warningHigh:65,

            criticalHigh:74,

            initialValue:42,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"SMS_VIB",

            name:"Furnace Vibration",

            type:"vibration",

            zone:this.id,

            unit:"mm/s",

            minValue:1,

            maxValue:8,

            warningHigh:5,

            criticalHigh:6.5,

            initialValue:2.4,

            updateInterval:3000

        }));

    }

    // =====================================================
    // Helpers
    // =====================================================

    random(min,max){

        return Math.random()*(max-min)+min;

    }

    getSensor(id){

        return this.sensors.find(sensor=>sensor.id===id);

    }

    // =====================================================
    // Operating Modes
    // =====================================================

    updateProcessState(mode){

        this.processState.operatingMode=mode;

        switch(mode){

            case "STARTUP":

                this.processState.hotMetalFeed=0.45;
                this.processState.oxygenFlowRate=0.50;
                break;

            case "NORMAL":

                this.processState.hotMetalFeed=0.90;
                this.processState.oxygenFlowRate=0.88;
                break;

            case "HIGH_PRODUCTION":

                this.processState.hotMetalFeed=1.10;
                this.processState.oxygenFlowRate=1.05;
                break;

            case "LOW_PRODUCTION":

                this.processState.hotMetalFeed=0.70;
                this.processState.oxygenFlowRate=0.70;
                break;

            case "MAINTENANCE":

                this.processState.hotMetalFeed=0.20;
                this.processState.oxygenFlowRate=0.30;
                break;

            case "SHUTDOWN":

                this.processState.hotMetalFeed=0;
                this.processState.oxygenFlowRate=0;
                break;

        }

    }
        // =====================================================
    // Normal Steel Refining Process
    // =====================================================

    updateNormal() {

        const temp = this.getSensor("SMS_TEMP");
        const oxygen = this.getSensor("SMS_OXYGEN");
        const pressure = this.getSensor("SMS_PRESSURE");
        const carbon = this.getSensor("SMS_CARBON");
        const purity = this.getSensor("SMS_PURITY");
        const slag = this.getSensor("SMS_SLAG");
        const ladle = this.getSensor("SMS_LADLE");
        const current = this.getSensor("SMS_CURRENT");
        const power = this.getSensor("SMS_POWER");
        const vibration = this.getSensor("SMS_VIB");

        // ==================================================
        // Plant Context
        // ==================================================

        const utilities = this.context?.utilities || {};

        const powerAvailability =
            utilities.powerAvailability ?? 1;

        // ==================================================
        // Future Data Bus Integration
        // ==================================================

        const blastFurnaceData =
            this.context?.dataBus?.blast_furnace;

        if (blastFurnaceData?.production?.hotMetalProduction) {

            this.processState.hotMetalFeed =

                Math.min(

                    1.10,

                    blastFurnaceData.production.hotMetalProduction / 100

                );

        }

        // ==================================================
        // Equipment Aging
        // ==================================================

        this.processState.furnaceEfficiency +=
            this.random(-0.0003, 0.0003);

        this.processState.furnaceHealth +=
            this.random(-0.0002, 0.0002);

        this.processState.electrodeHealth +=
            this.random(-0.0003, 0.0003);

        this.processState.refractoryHealth +=
            this.random(-0.0003, 0.0003);

        this.processState.scrapRatio +=
            this.random(-0.0002, 0.0002);

        this.processState.furnaceEfficiency =
            Math.max(0.88,
            Math.min(1.00,
            this.processState.furnaceEfficiency));

        this.processState.furnaceHealth =
            Math.max(0.90,
            Math.min(1.00,
            this.processState.furnaceHealth));

        this.processState.electrodeHealth =
            Math.max(0.90,
            Math.min(1.00,
            this.processState.electrodeHealth));

        this.processState.refractoryHealth =
            Math.max(0.90,
            Math.min(1.00,
            this.processState.refractoryHealth));

        // ==================================================
        // Refining Progress
        // ==================================================

        const refiningTarget =

            this.processState.hotMetalFeed *

            this.processState.oxygenFlowRate *

            this.processState.furnaceEfficiency *

            powerAvailability;

        this.processState.refiningProgress +=

            (refiningTarget -

            this.processState.refiningProgress) * 0.06;

        // ==================================================
        // Furnace Temperature
        // ==================================================

        const targetTemperature =

            1525 +

            (this.processState.hotMetalFeed * 90) +

            (this.processState.oxygenFlowRate * 35) -

            (this.processState.scrapRatio * 40);

        temp.updateValue(

            temp.currentValue +

            (targetTemperature -

            temp.currentValue) * 0.08 +

            this.random(-0.30, 0.30)

        );

        // ==================================================
        // Oxygen Flow
        // ==================================================

        const oxygenTarget =

            110 +

            this.processState.oxygenFlowRate * 170;

        oxygen.updateValue(

            oxygen.currentValue +

            (oxygenTarget -

            oxygen.currentValue) * 0.10 +

            this.random(-0.20, 0.20)

        );

        // ==================================================
        // Carbon Removal
        // ==================================================

        const carbonTarget =

            2.0 -

            this.processState.refiningProgress * 1.9 +

            this.processState.scrapRatio * 0.18;

        carbon.updateValue(

            carbon.currentValue +

            (carbonTarget -

            carbon.currentValue) * 0.08 +

            this.random(-0.003, 0.003)

        );

        // ==================================================
        // Steel Purity
        // ==================================================

        this.processState.steelPurity =

            0.96 +

            this.processState.refiningProgress * 0.04;

        purity.updateValue(

            this.processState.steelPurity * 100 +

            this.random(-0.02, 0.02)

        );

        // ==================================================
        // Slag Formation
        // ==================================================

        this.processState.slagFormation +=

            (this.processState.oxygenFlowRate * 0.45 -

            this.processState.slagFormation) * 0.05;

        slag.updateValue(

            this.processState.slagFormation * 100 +

            this.random(-0.10, 0.10)

        );

        // ==================================================
        // Ladle Filling
        // ==================================================

        this.processState.tapLevel +=

            this.processState.refiningProgress * 0.015;

        this.processState.tapLevel =

            Math.min(1.0,

            this.processState.tapLevel);

        ladle.updateValue(

            this.processState.tapLevel * 100 +

            this.random(-0.08, 0.08)

        );

        // ==================================================
        // Power Consumption
        // ==================================================

        this.processState.powerConsumption =

            this.processState.hotMetalFeed *

            this.processState.oxygenFlowRate *

            0.82;

        power.updateValue(

            10 +

            this.processState.powerConsumption * 55 +

            this.random(-0.15, 0.15)

        );

        // ==================================================
        // Electrode Current
        // ==================================================

        const currentTarget =

            18 +

            power.currentValue * 0.52 +

            (1 -

            this.processState.electrodeHealth) * 16;

        current.updateValue(

            current.currentValue +

            (currentTarget -

            current.currentValue) * 0.08 +

            this.random(-0.05, 0.05)

        );

        // ==================================================
        // Furnace Pressure
        // ==================================================

        const pressureTarget =

            0.9 +

            oxygen.currentValue / 320 +

            (temp.currentValue - 1500) / 400;

        pressure.updateValue(

            pressure.currentValue +

            (pressureTarget -

            pressure.currentValue) * 0.08 +

            this.random(-0.005, 0.005)

        );

        // ==================================================
        // Furnace Vibration
        // ==================================================

        const vibrationTarget =

            1.8 +

            (1 -

            this.processState.furnaceHealth) * 5 +

            (current.currentValue / 30);

        vibration.updateValue(

            vibration.currentValue +

            (vibrationTarget -

            vibration.currentValue) * 0.08 +

            this.random(-0.02, 0.02)

        );

        // ==================================================
        // Production Model
        // ==================================================

        this.processState.steelYield =

            this.processState.refiningProgress *

            this.processState.furnaceEfficiency *

            this.processState.carbonRemovalEfficiency;

        this.processState.moltenSteelProduction =

            this.processState.steelYield * 100;

        this.processState.slagProduction =

            this.processState.moltenSteelProduction * 0.11;

        this.processState.oxygenConsumption =

            oxygen.currentValue * 0.45;

        this.processState.thermalEfficiency =

            this.processState.furnaceEfficiency *

            this.processState.refractoryHealth;

        this.processState.lastUpdate = new Date();

    }   
        // =====================================================
    // Oxygen Valve Failure
    // =====================================================

    updateOxygenValveFailure() {

        this.processState.oxygenFlowRate -= 0.01;

        this.processState.oxygenFlowRate =

            Math.max(

                0.50,

                this.processState.oxygenFlowRate

            );

        this.updateNormal();

    }

    // =====================================================
    // Electrode Wear
    // =====================================================

    updateElectrodeWear() {

        this.processState.electrodeHealth -= 0.01;

        this.processState.electrodeHealth =

            Math.max(

                0.60,

                this.processState.electrodeHealth

            );

        this.updateNormal();

    }

    // =====================================================
    // Slag Overflow
    // =====================================================

    updateSlagOverflow() {

        this.processState.slagFormation += 0.015;

        this.processState.slagFormation =

            Math.min(

                1,

                this.processState.slagFormation

            );

        this.updateNormal();

    }

    // =====================================================
    // Power Loss
    // =====================================================

    updatePowerLoss() {

        this.processState.furnaceEfficiency -= 0.01;

        this.processState.furnaceEfficiency =

            Math.max(

                0.75,

                this.processState.furnaceEfficiency

            );

        this.updateNormal();

    }

    // =====================================================
    // Refractory Damage
    // =====================================================

    updateRefractoryDamage() {

        this.processState.refractoryHealth -= 0.01;

        this.processState.refractoryHealth =

            Math.max(

                0.60,

                this.processState.refractoryHealth

            );

        this.updateNormal();

    }

    // =====================================================
    // Publish Industrial Data
    // =====================================================

    publishData() {

        const temp = this.getSensor("SMS_TEMP");
        const carbon = this.getSensor("SMS_CARBON");
        const purity = this.getSensor("SMS_PURITY");
        const oxygen = this.getSensor("SMS_OXYGEN");
        const vibration = this.getSensor("SMS_VIB");

        const alarms = [];

        if (temp.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Converter",

                message: "Converter temperature exceeded safe operating limit."

            });

        }

        if (oxygen.status === "CRITICAL") {

            alarms.push({

                severity: "WARNING",

                equipment: "Oxygen Lance",

                message: "Oxygen flow outside operating range."

            });

        }

        if (purity.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Steel Quality",

                message: "Steel purity below specification."

            });

        }

        return {

            production: {

                moltenSteelProduction:

                    Number(

                        this.processState.moltenSteelProduction.toFixed(2)

                    ),

                slagProduction:

                    Number(

                        this.processState.slagProduction.toFixed(2)

                    ),

                steelYield:

                    Number(

                        (this.processState.steelYield * 100).toFixed(2)

                    )

            },

            quality: {

                steelPurity:

                    Number(

                        purity.currentValue.toFixed(2)

                    ),

                carbonContent:

                    Number(

                        carbon.currentValue.toFixed(3)

                    )

            },

            utilities: {

                oxygenConsumption:

                    Number(

                        this.processState.oxygenConsumption.toFixed(2)

                    ),

                powerConsumption:

                    Number(

                        this.processState.powerConsumption.toFixed(2)

                    )

            },

            equipment: {

                furnaceHealth:

                    Number(

                        (this.processState.furnaceHealth * 100).toFixed(2)

                    ),

                electrodeHealth:

                    Number(

                        (this.processState.electrodeHealth * 100).toFixed(2)

                    ),

                refractoryHealth:

                    Number(

                        (this.processState.refractoryHealth * 100).toFixed(2)

                    ),

                vibration:

                    Number(

                        vibration.currentValue.toFixed(2)

                    )

            },

            health: {

                availability:

                    Number(

                        (this.processState.furnaceHealth * 100).toFixed(2)

                    ),

                performance:

                    Number(

                        (this.processState.furnaceEfficiency * 100).toFixed(2)

                    ),

                quality:

                    Number(

                        (this.processState.steelPurity * 100).toFixed(2)

                    )

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

            refiningProgress:

                Number(

                    this.processState.refiningProgress.toFixed(3)

                ),

            furnaceEfficiency:

                Number(

                    this.processState.furnaceEfficiency.toFixed(3)

                ),

            furnaceHealth:

                Number(

                    this.processState.furnaceHealth.toFixed(3)

                ),

            refractoryHealth:

                Number(

                    this.processState.refractoryHealth.toFixed(3)

                ),

            electrodeHealth:

                Number(

                    this.processState.electrodeHealth.toFixed(3)

                ),

            moltenSteelProduction:

                Number(

                    this.processState.moltenSteelProduction.toFixed(2)

                ),

            slagProduction:

                Number(

                    this.processState.slagProduction.toFixed(2)

                ),

            steelYield:

                Number(

                    (this.processState.steelYield * 100).toFixed(2)

                ),

            oxygenConsumption:

                Number(

                    this.processState.oxygenConsumption.toFixed(2)

                )

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

            case "OXYGEN_VALVE_FAILURE":

                this.updateOxygenValveFailure();
                break;

            case "ELECTRODE_WEAR":

                this.updateElectrodeWear();
                break;

            case "SLAG_OVERFLOW":

                this.updateSlagOverflow();
                break;

            case "POWER_LOSS":

                this.updatePowerLoss();
                break;

            case "REFRACTORY_DAMAGE":

                this.updateRefractoryDamage();
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

            processState:

                this.getProcessSummary()

        };

    }

}

module.exports = SMS;