const Zone = require("../models/Zone");
const Sensor = require("../models/Sensor");

class RollingMill extends Zone {

    constructor() {

        super({

            id: "rolling_mill",

            name: "Rolling Mill",

            priority: 9,

            description: "Converts molten steel into finished steel coils through reheating and rolling."

        });

        // =====================================================
        // Process State
        // =====================================================

        this.processState = {

            // Operating

            operatingMode: "NORMAL",

            // Feed From SMS

            steelFeed: 0.92,

            billetTemperature: 0.95,

            reheatingEfficiency: 0.96,

            // Rolling

            rollingSpeed: 0.82,

            reductionRatio: 0.88,

            rollGap: 0.55,

            stripThickness: 12,

            stripWidth: 1250,

            // Cooling

            coolingEfficiency: 0.96,

            coolingWaterFlow: 0.90,

            // Quality

            surfaceQuality: 0.98,

            widthAccuracy: 0.99,

            thicknessAccuracy: 0.99,

            // Equipment

            motorHealth: 0.98,

            rollHealth: 0.97,

            bearingHealth: 0.98,

            hydraulicHealth: 0.98,

            // Production

            productionRate: 1.0,

            finishedSteelProduction: 0,

            coilWeight: 0,

            yield: 0,

            scrapGeneration: 0,

            powerConsumption: 0,

            thermalEfficiency: 0.95,

            lastUpdate: new Date()

        };

        this.initializeSensors();

    }

    // =====================================================
    // Sensors
    // =====================================================

    initializeSensors() {

        this.addSensor(new Sensor({

            id:"RM_TEMP",

            name:"Billet Temperature",

            type:"temperature",

            zone:this.id,

            unit:"°C",

            minValue:850,

            maxValue:1250,

            warningHigh:1180,

            criticalHigh:1220,

            initialValue:1100,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"RM_SPEED",

            name:"Rolling Speed",

            type:"speed",

            zone:this.id,

            unit:"m/s",

            minValue:1,

            maxValue:8,

            warningLow:2,

            criticalLow:1.5,

            initialValue:4.5,

            updateInterval:1000

        }));

        this.addSensor(new Sensor({

            id:"RM_CURRENT",

            name:"Motor Current",

            type:"current",

            zone:this.id,

            unit:"A",

            minValue:100,

            maxValue:900,

            warningHigh:760,

            criticalHigh:840,

            initialValue:480,

            updateInterval:1000

        }));

        this.addSensor(new Sensor({

            id:"RM_PRESSURE",

            name:"Hydraulic Pressure",

            type:"pressure",

            zone:this.id,

            unit:"bar",

            minValue:120,

            maxValue:320,

            warningLow:150,

            criticalLow:130,

            initialValue:240,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"RM_GAP",

            name:"Roll Gap",

            type:"distance",

            zone:this.id,

            unit:"mm",

            minValue:2,

            maxValue:25,

            warningHigh:20,

            criticalHigh:23,

            initialValue:12,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"RM_THICKNESS",

            name:"Strip Thickness",

            type:"thickness",

            zone:this.id,

            unit:"mm",

            minValue:2,

            maxValue:25,

            warningHigh:18,

            criticalHigh:22,

            initialValue:12,

            updateInterval:3000

        }));

        this.addSensor(new Sensor({

            id:"RM_COOL",

            name:"Cooling Water Flow",

            type:"flow",

            zone:this.id,

            unit:"m³/hr",

            minValue:40,

            maxValue:220,

            warningLow:70,

            criticalLow:55,

            initialValue:150,

            updateInterval:2000

        }));

        this.addSensor(new Sensor({

            id:"RM_VIB",

            name:"Stand Vibration",

            type:"vibration",

            zone:this.id,

            unit:"mm/s",

            minValue:1,

            maxValue:8,

            warningHigh:5,

            criticalHigh:6.5,

            initialValue:2.2,

            updateInterval:3000

        }));

        this.addSensor(new Sensor({

            id:"RM_COIL",

            name:"Finished Coil Weight",

            type:"weight",

            zone:this.id,

            unit:"ton",

            minValue:5,

            maxValue:40,

            warningHigh:35,

            criticalHigh:38,

            initialValue:18,

            updateInterval:5000

        }));

        this.addSensor(new Sensor({

            id:"RM_DEFECT",

            name:"Surface Defect Rate",

            type:"quality",

            zone:this.id,

            unit:"%",

            minValue:0,

            maxValue:10,

            warningHigh:5,

            criticalHigh:8,

            initialValue:1,

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

                this.processState.productionRate=0.45;
                this.processState.rollingSpeed=0.45;
                break;

            case "NORMAL":

                this.processState.productionRate=1.0;
                this.processState.rollingSpeed=0.82;
                break;

            case "HIGH_PRODUCTION":

                this.processState.productionRate=1.15;
                this.processState.rollingSpeed=1.00;
                break;

            case "LOW_PRODUCTION":

                this.processState.productionRate=0.70;
                this.processState.rollingSpeed=0.65;
                break;

            case "MAINTENANCE":

                this.processState.productionRate=0.20;
                this.processState.rollingSpeed=0.25;
                break;

            case "SHUTDOWN":

                this.processState.productionRate=0;
                this.processState.rollingSpeed=0;
                break;

        }

    }
        // =====================================================
    // Normal Rolling Process
    // =====================================================

    updateNormal() {

        const temp = this.getSensor("RM_TEMP");
        const speed = this.getSensor("RM_SPEED");
        const current = this.getSensor("RM_CURRENT");
        const pressure = this.getSensor("RM_PRESSURE");
        const gap = this.getSensor("RM_GAP");
        const thickness = this.getSensor("RM_THICKNESS");
        const cooling = this.getSensor("RM_COOL");
        const vibration = this.getSensor("RM_VIB");
        const coil = this.getSensor("RM_COIL");
        const defect = this.getSensor("RM_DEFECT");

        // ==================================================
        // Plant Context
        // ==================================================

        const utilities = this.context?.utilities || {};

        const powerAvailability =
            utilities.powerAvailability ?? 1;

        const waterAvailability =
            utilities.waterAvailability ?? 1;

        // ==================================================
        // Read Steel From SMS
        // ==================================================

        const sms = this.context?.dataBus?.sms;

        if (sms?.production?.moltenSteelProduction) {

            this.processState.steelFeed = Math.min(

                1.20,

                sms.production.moltenSteelProduction / 100

            );

        }

        // ==================================================
        // Equipment Aging
        // ==================================================

        this.processState.motorHealth +=
            this.random(-0.0002,0.0002);

        this.processState.rollHealth +=
            this.random(-0.0003,0.0003);

        this.processState.bearingHealth +=
            this.random(-0.0002,0.0002);

        this.processState.hydraulicHealth +=
            this.random(-0.0002,0.0002);

        this.processState.coolingEfficiency +=
            this.random(-0.0003,0.0003);

        this.processState.motorHealth =
            Math.max(0.90,Math.min(1.00,this.processState.motorHealth));

        this.processState.rollHealth =
            Math.max(0.88,Math.min(1.00,this.processState.rollHealth));

        this.processState.bearingHealth =
            Math.max(0.90,Math.min(1.00,this.processState.bearingHealth));

        this.processState.hydraulicHealth =
            Math.max(0.90,Math.min(1.00,this.processState.hydraulicHealth));

        this.processState.coolingEfficiency =
            Math.max(0.85,Math.min(1.00,this.processState.coolingEfficiency));

        // ==================================================
        // Reheating Furnace
        // ==================================================

        this.processState.billetTemperature +=

            (

                this.processState.reheatingEfficiency *

                powerAvailability -

                this.processState.billetTemperature

            ) * 0.04;

        // ==================================================
        // Rolling Speed
        // ==================================================

        const rollingTarget =

            this.processState.productionRate *

            this.processState.motorHealth *

            this.processState.rollHealth;

        this.processState.rollingSpeed +=

            (rollingTarget -

            this.processState.rollingSpeed) * 0.08;

        // ==================================================
        // Reduction Ratio
        // ==================================================

        this.processState.reductionRatio =

            this.processState.rollingSpeed *

            this.processState.hydraulicHealth;

        // ==================================================
        // Strip Thickness
        // ==================================================

        this.processState.stripThickness =

            20 -

            this.processState.reductionRatio * 10;

        // ==================================================
        // Production Model
        // ==================================================

        this.processState.yield =

            this.processState.steelFeed *

            this.processState.rollHealth *

            this.processState.surfaceQuality;

        this.processState.finishedSteelProduction =

            this.processState.yield * 100;

        this.processState.coilWeight =

            this.processState.finishedSteelProduction * 0.18;

        this.processState.scrapGeneration =

            this.processState.finishedSteelProduction *

            (1 -

            this.processState.surfaceQuality);

        this.processState.powerConsumption =

            this.processState.productionRate *

            this.processState.rollingSpeed *

            55;

        this.processState.thermalEfficiency =

            this.processState.coolingEfficiency *

            this.processState.reheatingEfficiency;

        // ==================================================
        // Update Sensors
        // ==================================================

        temp.updateValue(

            900 +

            this.processState.billetTemperature * 250 +

            this.random(-0.3,0.3)

        );

        speed.updateValue(

            1 +

            this.processState.rollingSpeed * 5 +

            this.random(-0.03,0.03)

        );

        current.updateValue(

            180 +

            this.processState.productionRate * 420 +

            (1 -

            this.processState.motorHealth) * 180 +

            this.random(-0.4,0.4)

        );

        pressure.updateValue(

            150 +

            this.processState.hydraulicHealth * 100 +

            this.random(-0.3,0.3)

        );

        gap.updateValue(

            this.processState.stripThickness +

            this.random(-0.02,0.02)

        );

        thickness.updateValue(

            this.processState.stripThickness +

            this.random(-0.02,0.02)

        );

        cooling.updateValue(

            60 +

            this.processState.coolingEfficiency *

            waterAvailability *

            120 +

            this.random(-0.4,0.4)

        );

        vibration.updateValue(

            1.5 +

            (1 -

            this.processState.rollHealth) * 5 +

            (1 -

            this.processState.bearingHealth) * 4 +

            this.random(-0.02,0.02)

        );

        coil.updateValue(

            this.processState.coilWeight +

            this.random(-0.03,0.03)

        );

        this.processState.surfaceQuality =

            this.processState.rollHealth *

            this.processState.coolingEfficiency *

            this.processState.widthAccuracy;

        defect.updateValue(

            (1 -

            this.processState.surfaceQuality) * 100 +

            this.random(-0.05,0.05)

        );

        this.processState.lastUpdate = new Date();

    }
        // =====================================================
    // Motor Failure
    // =====================================================

    updateMotorFailure() {

        this.processState.motorHealth -= 0.01;

        this.processState.motorHealth =

            Math.max(

                0.60,

                this.processState.motorHealth

            );

        this.updateNormal();

    }

    // =====================================================
    // Hydraulic Failure
    // =====================================================

    updateHydraulicFailure() {

        this.processState.hydraulicHealth -= 0.01;

        this.processState.hydraulicHealth =

            Math.max(

                0.60,

                this.processState.hydraulicHealth

            );

        this.updateNormal();

    }

    // =====================================================
    // Cooling Failure
    // =====================================================

    updateCoolingFailure() {

        this.processState.coolingEfficiency -= 0.015;

        this.processState.coolingEfficiency =

            Math.max(

                0.55,

                this.processState.coolingEfficiency

            );

        this.updateNormal();

    }

    // =====================================================
    // Roll Wear
    // =====================================================

    updateRollWear() {

        this.processState.rollHealth -= 0.01;

        this.processState.rollHealth =

            Math.max(

                0.60,

                this.processState.rollHealth

            );

        this.updateNormal();

    }

    // =====================================================
    // Bearing Failure
    // =====================================================

    updateBearingFailure() {

        this.processState.bearingHealth -= 0.01;

        this.processState.bearingHealth =

            Math.max(

                0.60,

                this.processState.bearingHealth

            );

        this.updateNormal();

    }

    // =====================================================
    // Publish Data
    // =====================================================

    publishData() {

        const temp = this.getSensor("RM_TEMP");
        const thickness = this.getSensor("RM_THICKNESS");
        const defect = this.getSensor("RM_DEFECT");
        const current = this.getSensor("RM_CURRENT");
        const vibration = this.getSensor("RM_VIB");

        const alarms = [];

        if (temp.status === "CRITICAL") {

            alarms.push({

                severity: "CRITICAL",

                equipment: "Reheating Furnace",

                message: "Billet temperature exceeded safe limit."

            });

        }

        if (current.status === "CRITICAL") {

            alarms.push({

                severity: "WARNING",

                equipment: "Main Drive Motor",

                message: "Rolling motor current is critically high."

            });

        }

        if (vibration.status === "CRITICAL") {

            alarms.push({

                severity: "WARNING",

                equipment: "Rolling Stand",

                message: "Rolling stand vibration exceeded safe limit."

            });

        }

        if (defect.currentValue > 5) {

            alarms.push({

                severity: "WARNING",

                equipment: "Quality Inspection",

                message: "Surface defect rate is increasing."

            });

        }

        return {

            production: {

                finishedSteel:

                    Number(this.processState.finishedSteelProduction.toFixed(2)),

                coilWeight:

                    Number(this.processState.coilWeight.toFixed(2)),

                yield:

                    Number((this.processState.yield * 100).toFixed(2)),

                scrap:

                    Number(this.processState.scrapGeneration.toFixed(2))

            },

            quality: {

                stripThickness:

                    Number(thickness.currentValue.toFixed(2)),

                surfaceQuality:

                    Number((this.processState.surfaceQuality * 100).toFixed(2)),

                defectRate:

                    Number(defect.currentValue.toFixed(2))

            },

            utilities: {

                powerConsumption:

                    Number(this.processState.powerConsumption.toFixed(2)),

                coolingWater:

                    Number(this.getSensor("RM_COOL").currentValue.toFixed(2))

            },

            equipment: {

                motorHealth:

                    Number((this.processState.motorHealth * 100).toFixed(2)),

                rollHealth:

                    Number((this.processState.rollHealth * 100).toFixed(2)),

                bearingHealth:

                    Number((this.processState.bearingHealth * 100).toFixed(2)),

                hydraulicHealth:

                    Number((this.processState.hydraulicHealth * 100).toFixed(2))

            },

            health: {

                availability:

                    Number((this.processState.motorHealth * 100).toFixed(2)),

                performance:

                    Number((this.processState.productionRate * 100).toFixed(2)),

                quality:

                    Number((this.processState.surfaceQuality * 100).toFixed(2))

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

            rollingSpeed:

                Number(this.processState.rollingSpeed.toFixed(3)),

            reheatingEfficiency:

                Number(this.processState.reheatingEfficiency.toFixed(3)),

            coolingEfficiency:

                Number(this.processState.coolingEfficiency.toFixed(3)),

            motorHealth:

                Number(this.processState.motorHealth.toFixed(3)),

            rollHealth:

                Number(this.processState.rollHealth.toFixed(3)),

            hydraulicHealth:

                Number(this.processState.hydraulicHealth.toFixed(3)),

            bearingHealth:

                Number(this.processState.bearingHealth.toFixed(3)),

            finishedSteelProduction:

                Number(this.processState.finishedSteelProduction.toFixed(2)),

            coilWeight:

                Number(this.processState.coilWeight.toFixed(2)),

            yield:

                Number((this.processState.yield * 100).toFixed(2))

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

            case "MOTOR_FAILURE":

                this.updateMotorFailure();
                break;

            case "HYDRAULIC_FAILURE":

                this.updateHydraulicFailure();
                break;

            case "COOLING_FAILURE":

                this.updateCoolingFailure();
                break;

            case "ROLL_WEAR":

                this.updateRollWear();
                break;

            case "BEARING_FAILURE":

                this.updateBearingFailure();
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

module.exports = RollingMill;