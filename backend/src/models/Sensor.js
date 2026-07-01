// src/models/Sensor.js

const { STATUS, SENSOR_STATUS } = require("../config/constants");

class Sensor {

    constructor(config) {

        // =====================================================
        // Basic Information
        // =====================================================

        this.id = config.id;
        this.name = config.name;
        this.type = config.type;
        this.zone = config.zone;

        // =====================================================
        // Configuration
        // =====================================================

        this.unit = config.unit;

        this.minValue = config.minValue;
        this.maxValue = config.maxValue;

        // Engineering Thresholds

        this.warningLow = config.warningLow ?? null;
        this.warningHigh = config.warningHigh ?? null;

        this.criticalLow = config.criticalLow ?? null;
        this.criticalHigh = config.criticalHigh ?? null;

        this.updateInterval = config.updateInterval;

        // =====================================================
        // Live Data
        // =====================================================

        this.currentValue = config.initialValue;
        this.previousValue = config.initialValue;

        // Keep last 20 readings

        this.history = [
            {
                value: config.initialValue,
                timestamp: new Date()
            }
        ];

        // =====================================================
        // Sensor State
        // =====================================================

        this.health = SENSOR_STATUS.HEALTHY;

        this.status = STATUS.NORMAL;

        this.trend = "STABLE";

        this.quality = "GOOD";

        // =====================================================
        // Metadata
        // =====================================================

        this.createdAt = new Date();

        this.lastUpdated = new Date();

    }

    // =====================================================
    // Update Value
    // =====================================================

    updateValue(value) {

        if (!this.isHealthy()) return;

        this.previousValue = this.currentValue;

        this.currentValue = value;

        this.calculateTrend();

        this.evaluateStatus();

        this.lastUpdated = new Date();

        this.addHistory(value);

    }

    // =====================================================
    // Store History
    // =====================================================

    addHistory(value) {

        this.history.push({

            value,

            timestamp: new Date()

        });

        if (this.history.length > 20) {

            this.history.shift();

        }

    }

    // =====================================================
    // Trend
    // =====================================================

    calculateTrend() {

        if (this.currentValue > this.previousValue)

            this.trend = "UP";

        else if (this.currentValue < this.previousValue)

            this.trend = "DOWN";

        else

            this.trend = "STABLE";

    }

    // =====================================================
    // Status Evaluation
    // =====================================================

    evaluateStatus() {

        // Critical

        if (

            (this.criticalLow !== null &&
                this.currentValue <= this.criticalLow)

            ||

            (this.criticalHigh !== null &&
                this.currentValue >= this.criticalHigh)

        ) {

            this.status = STATUS.CRITICAL;

            return;

        }

        // Warning

        if (

            (this.warningLow !== null &&
                this.currentValue <= this.warningLow)

            ||

            (this.warningHigh !== null &&
                this.currentValue >= this.warningHigh)

        ) {

            this.status = STATUS.WARNING;

            return;

        }

        this.status = STATUS.NORMAL;

    }

    // =====================================================
    // Health
    // =====================================================

    markFaulty() {

        this.health = SENSOR_STATUS.FAULTY;

        this.quality = "BAD";

    }

    markOffline() {

        this.health = SENSOR_STATUS.OFFLINE;

        this.quality = "BAD";

    }

    restore() {

        this.health = SENSOR_STATUS.HEALTHY;

        this.quality = "GOOD";

    }

    isHealthy() {

        return this.health === SENSOR_STATUS.HEALTHY;

    }

    // =====================================================
    // Analytics
    // =====================================================

    getAverage() {

        const total = this.history.reduce(

            (sum, item) => sum + item.value,

            0

        );

        return Number(

            (total / this.history.length).toFixed(2)

        );

    }

    getRateOfChange() {

        if (this.history.length < 2)

            return 0;

        const first = this.history[0].value;

        const last = this.history[this.history.length - 1].value;

        return Number(

            ((last - first) / (this.history.length - 1)).toFixed(2)

        );

    }

    getLatestReading() {

        return this.history[this.history.length - 1];

    }

    // =====================================================
    // JSON
    // =====================================================

    toJSON() {

        return {

            id: this.id,

            name: this.name,

            type: this.type,

            zone: this.zone,

            value: this.currentValue,

            previousValue: this.previousValue,

            average: this.getAverage(),

            rateOfChange: this.getRateOfChange(),

            trend: this.trend,

            unit: this.unit,

            status: this.status,

            health: this.health,

            quality: this.quality,

            minValue: this.minValue,

            maxValue: this.maxValue,

            warningLow: this.warningLow,

            warningHigh: this.warningHigh,

            criticalLow: this.criticalLow,

            criticalHigh: this.criticalHigh,

            updateInterval: this.updateInterval,

            createdAt: this.createdAt,

            lastUpdated: this.lastUpdated

        };

    }

}

module.exports = Sensor;