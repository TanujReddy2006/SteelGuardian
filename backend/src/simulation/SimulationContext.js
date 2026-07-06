class SimulationContext {

    constructor() {

        this.reset();

    }

    reset() {

        this.context = {

            plantState: {

                operatingMode: "NORMAL",

                emergencyStop: false,

                maintenanceMode: false

            },

            utilities: {

                powerAvailability: 1,

                waterAvailability: 1

            },

            environment: {

                ambientTemperature: 30,

                humidity: 60

            },

            dataBus: {}

        };

    }

    getContext() {

        return this.context;

    }

    updateDataBus(dataBus) {

        this.context.dataBus = dataBus;

    }

    setOperatingMode(mode) {

        this.context.plantState.operatingMode = mode;

    }

    emergencyStop(status = true) {

        this.context.plantState.emergencyStop = status;

    }

    setPowerAvailability(value) {

        this.context.utilities.powerAvailability = value;

    }

    setWaterAvailability(value) {

        this.context.utilities.waterAvailability = value;

    }

}

module.exports = new SimulationContext();