// src/models/Plant.js

class Plant {

    constructor(config) {

        this.id = config.id;

        this.name = config.name;

        this.description = config.description || "";

        this.zones = [];

        this.createdAt = new Date();

        this.lastUpdated = new Date();

    }

    // ===========================================
    // Zone Operations
    // ===========================================

    addZone(zone) {

        this.zones.push(zone);

        this.lastUpdated = new Date();

    }

    removeZone(zoneId) {

        this.zones = this.zones.filter(

            zone => zone.id !== zoneId

        );

        this.lastUpdated = new Date();

    }

    getZone(zoneId) {

        return this.zones.find(

            zone => zone.id === zoneId

        );

    }

    getAllZones() {

        return this.zones;

    }

    // ===========================================
    // Plant Status
    // ===========================================

    update() {

        this.zones.forEach(zone => zone.update());

        this.lastUpdated = new Date();

    }

    // ===========================================
    // Statistics
    // ===========================================

    getTotalZones() {

        return this.zones.length;

    }

    getTotalSensors() {

        return this.zones.reduce(

            (total, zone) => total + zone.sensors.length,

            0

        );

    }

    getCriticalZones() {

        return this.zones.filter(

            zone => zone.status === "CRITICAL"

        ).length;

    }

    getWarningZones() {

        return this.zones.filter(

            zone => zone.status === "WARNING"

        ).length;

    }

    // ===========================================
    // JSON
    // ===========================================

    toJSON() {

        return {

            id: this.id,

            name: this.name,

            description: this.description,

            totalZones: this.getTotalZones(),

            totalSensors: this.getTotalSensors(),

            warningZones: this.getWarningZones(),

            criticalZones: this.getCriticalZones(),

            zones: this.zones.map(

                zone => zone.toJSON()

            ),

            createdAt: this.createdAt,

            lastUpdated: this.lastUpdated

        };

    }

}

module.exports = Plant;