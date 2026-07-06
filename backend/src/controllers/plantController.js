const PlantSimulator = require("../simulation/PlantSimulator");
const SimulationClock = require("../simulation/SimulationClock");

class PlantController {

    getPlantState(req, res) {

        try {

            const state = PlantSimulator.getPlantState();

            res.status(200).json({

                success: true,

                data: state

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    startSimulation(req, res) {

        try {

            const tickRate = req.body.tickRate || 1000;

            SimulationClock.start(tickRate);

            res.status(200).json({

                success: true,

                message: "Simulation started.",

                tickRate

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    stopSimulation(req, res) {

        try {

            SimulationClock.stop();

            res.status(200).json({

                success: true,

                message: "Simulation stopped."

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    getSimulationStatus(req, res) {

        res.status(200).json({

            success: true,

            running: SimulationClock.isRunning(),

            tickRate: SimulationClock.getTickRate()

        });

    }

}

module.exports = new PlantController();