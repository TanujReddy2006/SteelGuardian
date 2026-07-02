const { STATUS } = require("../config/constants");

class Plant {

    constructor(config = {}) {

        // =====================================================
        // Plant Information
        // =====================================================

        this.id = config.id || "steel_guardian";

        this.name = config.name || "SteelGuardian AI";

        this.description =
            config.description ||
            "Industrial Digital Twin";

        // =====================================================
        // Plant State
        // =====================================================

        this.plantState = {

            operatingMode: "NORMAL",

            emergency: false,

            productionTarget: 0.85,

            ambientTemperature: 32,

            humidity: 0.58,

            windSpeed: 4,

            powerAvailability: 1,

            waterAvailability: 1,

            compressedAirAvailability: 1,

            fuelAvailability: 1,

            timestamp: new Date()

        };

        // =====================================================
        // Zones
        // =====================================================

        this.zones = [];

        this.zoneMap = {};

        // =====================================================
        // Industrial Data Bus
        // =====================================================

        this.dataBus = {};

        // =====================================================
        // Plant Statistics
        // =====================================================

        this.statistics = {

            totalZones: 0,

            totalSensors: 0,

            healthySensors: 0,

            warningSensors: 0,

            criticalSensors: 0,

            faultySensors: 0,

            offlineSensors: 0,

            plantRiskScore: 0,

            productionEfficiency: 100

        };

        // =====================================================
        // Environment
        // =====================================================

        this.environment = {

            ambientTemperature: 32,

            humidity: 60,

            atmosphericPressure: 1.01,

            windSpeed: 4,

            rainfall: 0

        };

    }

    // =====================================================
    // Register Zone
    // =====================================================

    registerZone(zone) {

        this.zones.push(zone);

        this.zoneMap[zone.id] = zone;

        this.dataBus[zone.id] = {

            production: {},

            utilities: {},

            emissions: {},

            equipment: {},

            health: {},

            alarms: []

        };

        this.statistics.totalZones = this.zones.length;

    }

    // =====================================================
    // Get Zone
    // =====================================================

    getZone(id) {

        return this.zoneMap[id];

    }

    // =====================================================
    // Get All Zones
    // =====================================================

    getZones() {

        return this.zones;

    }

    // =====================================================
    // Publish To Data Bus
    // =====================================================

    publish(zoneId, data) {

        if (!this.dataBus[zoneId]) {

            this.dataBus[zoneId] = {};

        }

        this.dataBus[zoneId] = {

            ...this.dataBus[zoneId],

            ...data

        };

    }

    // =====================================================
    // Read Data Bus
    // =====================================================

    read(zoneId) {

        return this.dataBus[zoneId];

    }

    // =====================================================
    // Read Entire Data Bus
    // =====================================================

    getDataBus() {

        return this.dataBus;

    }
        // =====================================================
    // Plant Operating Mode
    // =====================================================

    setOperatingMode(mode) {

        this.plantState.operatingMode = mode;

        switch (mode) {

            case "STARTUP":

                this.plantState.productionTarget = 0.35;
                break;

            case "NORMAL":

                this.plantState.productionTarget = 0.85;
                break;

            case "HIGH_PRODUCTION":

                this.plantState.productionTarget = 1.10;
                break;

            case "LOW_PRODUCTION":

                this.plantState.productionTarget = 0.60;
                break;

            case "MAINTENANCE":

                this.plantState.productionTarget = 0.20;
                break;

            case "EMERGENCY":

                this.plantState.productionTarget = 0.10;
                this.plantState.emergency = true;
                break;

            case "SHUTDOWN":

                this.plantState.productionTarget = 0;
                break;

        }

    }

    // =====================================================
    // Environment Simulation
    // =====================================================

    updateEnvironment() {

        this.environment.ambientTemperature +=

            this.random(-0.05, 0.05);

        this.environment.humidity +=

            this.random(-0.10, 0.10);

        this.environment.windSpeed +=

            this.random(-0.05, 0.05);

        this.environment.atmosphericPressure +=

            this.random(-0.001, 0.001);

        this.environment.ambientTemperature =

            Math.max(20,
                Math.min(45,
                    this.environment.ambientTemperature
                )
            );

        this.environment.humidity =

            Math.max(20,
                Math.min(95,
                    this.environment.humidity
                )
            );

        this.environment.windSpeed =

            Math.max(0,
                Math.min(25,
                    this.environment.windSpeed
                )
            );

    }

    // =====================================================
    // Utility Distribution
    // =====================================================

    updateUtilities() {

        const target = this.plantState.productionTarget;

        this.plantState.powerAvailability =

            Math.max(
                0.70,
                Math.min(
                    1.0,
                    1 - (target * 0.03)
                )
            );

        this.plantState.waterAvailability =

            Math.max(
                0.75,
                Math.min(
                    1.0,
                    1 - (target * 0.02)
                )
            );

        this.plantState.compressedAirAvailability =

            Math.max(
                0.80,
                Math.min(
                    1.0,
                    1 - (target * 0.015)
                )
            );

        this.plantState.fuelAvailability =

            Math.max(
                0.80,
                Math.min(
                    1.0,
                    1 - (target * 0.025)
                )
            );

    }

    // =====================================================
    // Build Plant Context
    // =====================================================

    buildPlantContext() {

        return {

            plantState: this.plantState,

            environment: this.environment,

            utilities: {

                powerAvailability:

                    this.plantState.powerAvailability,

                waterAvailability:

                    this.plantState.waterAvailability,

                compressedAirAvailability:

                    this.plantState.compressedAirAvailability,

                fuelAvailability:

                    this.plantState.fuelAvailability

            },

            dataBus: this.dataBus

        };

    }

    // =====================================================
    // Utility Access
    // =====================================================

    getUtilities() {

        return {

            powerAvailability:

                this.plantState.powerAvailability,

            waterAvailability:

                this.plantState.waterAvailability,

            compressedAirAvailability:

                this.plantState.compressedAirAvailability,

            fuelAvailability:

                this.plantState.fuelAvailability

        };

    }

    // =====================================================
    // Plant Random Noise
    // =====================================================

    random(min, max) {

        return Math.random() * (max - min) + min;

    }
        // =====================================================
    // Update Entire Plant
    // =====================================================

    update(scenarios = {}) {

        // Update plant timestamp
        this.plantState.timestamp = new Date();

        // Update environment
        this.updateEnvironment();

        // Update utilities
        this.updateUtilities();

        // Build one shared context
        const context = this.buildPlantContext();

        // Reset statistics
        this.resetStatistics();

        // =====================================================
        // Update Every Zone
        // =====================================================

        for (const zone of this.zones) {

            const scenario = scenarios[zone.id] || "NORMAL";

            // Every zone receives identical plant context
            zone.update({

                context,

                scenario

            });

            // Zone publishes industrial outputs
            if (typeof zone.publishData === "function") {

                this.publish(

                    zone.id,

                    zone.publishData()

                );

            }

            // Collect statistics
            this.collectZoneStatistics(zone);

        }

        // =====================================================
        // Plant Analytics
        // =====================================================

        this.calculatePlantHealth();

        this.calculatePlantRisk();

    }

    // =====================================================
    // Reset Statistics
    // =====================================================

    resetStatistics() {

        this.statistics.totalSensors = 0;

        this.statistics.healthySensors = 0;

        this.statistics.warningSensors = 0;

        this.statistics.criticalSensors = 0;

        this.statistics.faultySensors = 0;

        this.statistics.offlineSensors = 0;

    }

    // =====================================================
    // Zone Statistics
    // =====================================================

    collectZoneStatistics(zone) {

        this.statistics.totalSensors += zone.sensors.length;

        zone.sensors.forEach(sensor => {

            switch (sensor.status) {

                case "NORMAL":

                    this.statistics.healthySensors++;
                    break;

                case "WARNING":

                    this.statistics.warningSensors++;
                    break;

                case "CRITICAL":

                    this.statistics.criticalSensors++;
                    break;

            }

            switch (sensor.health) {

                case "FAULTY":

                    this.statistics.faultySensors++;
                    break;

                case "OFFLINE":

                    this.statistics.offlineSensors++;
                    break;

            }

        });

    }

    // =====================================================
    // Plant Health
    // =====================================================

    calculatePlantHealth() {

        if (this.statistics.totalSensors === 0) {

            this.statistics.productionEfficiency = 100;

            return;

        }

        const healthyPercentage =

            this.statistics.healthySensors /

            this.statistics.totalSensors;

        this.statistics.productionEfficiency =

            Number((healthyPercentage * 100).toFixed(2));

    }

    // =====================================================
    // Plant Risk
    // =====================================================

    calculatePlantRisk() {

        let risk = 0;

        risk += this.statistics.warningSensors * 2;

        risk += this.statistics.criticalSensors * 6;

        risk += this.statistics.faultySensors * 4;

        risk += this.statistics.offlineSensors * 5;

        risk = Math.min(100, risk);

        this.statistics.plantRiskScore = risk;

    }

    // =====================================================
    // Plant Status
    // =====================================================

    getStatus() {

        if (this.statistics.plantRiskScore >= 80)

            return STATUS.CRITICAL;

        if (this.statistics.plantRiskScore >= 40)

            return STATUS.WARNING;

        return STATUS.NORMAL;

    }
    // =====================================================
    // Plant Summary
    // =====================================================

    getPlantSummary() {

        return {

            id: this.id,

            name: this.name,

            description: this.description,

            status: this.getStatus(),

            plantState: {

                ...this.plantState

            },

            environment: {

                ...this.environment

            },

            statistics: {

                ...this.statistics

            }

        };

    }

    // =====================================================
    // Dashboard Data
    // =====================================================

    getDashboardData() {

        return {

            summary: this.getPlantSummary(),

            zones: this.zones.map(zone => zone.toJSON()),

            dataBus: this.dataBus,

            timestamp: new Date()

        };

    }

    // =====================================================
    // Zone Summaries
    // =====================================================

    getZoneSummaries() {

        return this.zones.map(zone => ({

            id: zone.id,

            name: zone.name,

            status: zone.status,

            riskScore: zone.riskScore,

            totalSensors: zone.sensors.length,

            healthySensors:

                zone.sensors.filter(s => s.status === "NORMAL").length,

            warningSensors:

                zone.sensors.filter(s => s.status === "WARNING").length,

            criticalSensors:

                zone.sensors.filter(s => s.status === "CRITICAL").length

        }));

    }

    // =====================================================
    // Data Bus Export
    // =====================================================

    exportDataBus() {

        return JSON.parse(

            JSON.stringify(this.dataBus)

        );

    }

    // =====================================================
    // Analytics
    // =====================================================

    getAnalytics() {

        return {

            plantRiskScore:

                this.statistics.plantRiskScore,

            productionEfficiency:

                this.statistics.productionEfficiency,

            totalZones:

                this.statistics.totalZones,

            totalSensors:

                this.statistics.totalSensors,

            healthySensors:

                this.statistics.healthySensors,

            warningSensors:

                this.statistics.warningSensors,

            criticalSensors:

                this.statistics.criticalSensors,

            faultySensors:

                this.statistics.faultySensors,

            offlineSensors:

                this.statistics.offlineSensors

        };

    }

    // =====================================================
    // JSON
    // =====================================================

    toJSON() {

        return {

            summary: this.getPlantSummary(),

            analytics: this.getAnalytics(),

            zones: this.zones.map(zone => zone.toJSON()),

            dataBus: this.exportDataBus()

        };

    }

}

module.exports = Plant;