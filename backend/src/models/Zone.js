// src/models/Zone.js

const { STATUS, SENSOR_STATUS } = require("../config/constants");

class Zone {

    constructor(config) {

        this.id = config.id;
        this.name = config.name;
        this.priority = config.priority;
        this.description = config.description || "";

        this.status = STATUS.NORMAL;
        this.riskScore = 0;

        this.sensors = [];

        this.createdAt = new Date();
        this.lastUpdated = new Date();

    }

    // =====================================================
    // Sensor Operations
    // =====================================================

    addSensor(sensor) {

        this.sensors.push(sensor);

    }

    removeSensor(sensorId) {

        this.sensors = this.sensors.filter(

            sensor => sensor.id !== sensorId

        );

    }

    getSensorById(sensorId) {

        return this.sensors.find(

            sensor => sensor.id === sensorId

        );

    }

    getSensorByType(type) {

        return this.sensors.find(

            sensor => sensor.type === type

        );

    }

    getSensorByName(name) {

        return this.sensors.find(

            sensor => sensor.name === name

        );

    }

    getAllSensors() {

        return this.sensors;

    }

    // =====================================================
    // Update Zone
    // =====================================================

    update() {

        this.evaluateStatus();

        this.lastUpdated = new Date();

    }

    // =====================================================
    // Zone Status
    // =====================================================

    evaluateStatus() {

        let critical = 0;
        let warning = 0;

        this.sensors.forEach(sensor => {

            if (sensor.status === STATUS.CRITICAL)

                critical++;

            else if (sensor.status === STATUS.WARNING)

                warning++;

        });

        if (critical > 0)

            this.status = STATUS.CRITICAL;

        else if (warning > 0)

            this.status = STATUS.WARNING;

        else

            this.status = STATUS.NORMAL;

    }

    // =====================================================
    // Statistics
    // =====================================================

    getHealthySensors() {

        return this.sensors.filter(

            sensor => sensor.health === SENSOR_STATUS.HEALTHY

        ).length;

    }

    getFaultySensors() {

        return this.sensors.filter(

            sensor => sensor.health === SENSOR_STATUS.FAULTY

        ).length;

    }

    getOfflineSensors() {

        return this.sensors.filter(

            sensor => sensor.health === SENSOR_STATUS.OFFLINE

        ).length;

    }

    getCriticalSensors() {

        return this.sensors.filter(

            sensor => sensor.status === STATUS.CRITICAL

        ).length;

    }

    getWarningSensors() {

        return this.sensors.filter(

            sensor => sensor.status === STATUS.WARNING

        ).length;

    }

    getAverageHealth() {

        const total = this.sensors.length;

        if (total === 0) return 0;

        return Number(

            (
                (this.getHealthySensors() / total) * 100

            ).toFixed(2)

        );

    }

    // =====================================================
    // JSON
    // =====================================================

    toJSON() {

        return {

            id: this.id,

            name: this.name,

            description: this.description,

            priority: this.priority,

            status: this.status,

            riskScore: this.riskScore,

            totalSensors: this.sensors.length,

            healthySensors: this.getHealthySensors(),

            faultySensors: this.getFaultySensors(),

            offlineSensors: this.getOfflineSensors(),

            warningSensors: this.getWarningSensors(),

            criticalSensors: this.getCriticalSensors(),

            healthPercentage: this.getAverageHealth(),

            sensors: this.sensors.map(

                sensor => sensor.toJSON()

            ),

            lastUpdated: this.lastUpdated

        };

    }

}

module.exports = Zone;