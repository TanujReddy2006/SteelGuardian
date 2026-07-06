class PlantState {

    constructor() {

        this.state = {

            timestamp: null,

            rawMaterialYard: {},

            cokeOven: {},

            blastFurnace: {},

            sms: {},

            rollingMill: {}

        };

    }

    updateZone(zone, data) {

        if (!this.state.hasOwnProperty(zone)) {
            throw new Error(`Unknown zone: ${zone}`);
        }

        this.state[zone] = data;
        this.state.timestamp = new Date().toISOString();

    }

    getZone(zone) {

        if (!this.state.hasOwnProperty(zone)) {
            throw new Error(`Unknown zone: ${zone}`);
        }

        return this.state[zone];

    }

    getPlantState() {

        return { ...this.state };

    }

    reset() {

        this.state = {

            timestamp: null,

            rawMaterialYard: {},

            cokeOven: {},

            blastFurnace: {},

            sms: {},

            rollingMill: {}

        };

    }

}

module.exports = new PlantState();