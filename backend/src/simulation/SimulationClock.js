const PlantSimulator = require("./PlantSimulator");
const SocketManager = require("../sockets/socketManager");

class SimulationClock {

    constructor() {

        this.interval = null;
        this.running = false;
        this.tickRate = 1000;

    }

    start(tickRate = 1000) {

        if (this.running) {

            console.log("Simulation already running.");
            return;

        }

        this.tickRate = tickRate;
        this.running = true;

        console.log(`Simulation started (${tickRate} ms)`);

        this.interval = setInterval(() => {

            // Update one simulation cycle
            PlantSimulator.updateOnce();

            // Get latest plant data
            const plantState = PlantSimulator.getPlantState();

            // Broadcast to all connected dashboards
            SocketManager.broadcastPlantState(plantState);

        }, this.tickRate);

    }

    stop() {

        if (!this.running) {

            console.log("Simulation already stopped.");
            return;

        }

        clearInterval(this.interval);

        this.interval = null;
        this.running = false;

        console.log("Simulation stopped.");

    }

    restart(tickRate = this.tickRate) {

        this.stop();
        this.start(tickRate);

    }

    isRunning() {

        return this.running;

    }

    getTickRate() {

        return this.tickRate;

    }

}

module.exports = new SimulationClock();