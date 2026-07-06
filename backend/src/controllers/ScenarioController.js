const ScenarioManager = require("../simulation/ScenarioManager");
const SocketManager = require("../sockets/socketManager");
const ScenarioConfig = require("../config/ScenarioConfig");

class ScenarioController {

    setScenario(req, res) {

        try {

            const { zone, scenario } = req.body;

            if (!zone || !scenario) {

                return res.status(400).json({

                    success: false,

                    message: "zone and scenario are required."

                });

            }

            if (!ScenarioConfig[zone]) {

    return res.status(400).json({

        success: false,

        message: "Invalid Zone"

    });

}

if (!ScenarioConfig[zone].includes(scenario)) {

    return res.status(400).json({

        success: false,

        message: "Invalid Scenario"

    });

}
ScenarioManager.setScenario(zone, scenario);
            SocketManager.broadcastScenarioUpdate(

                ScenarioManager.getAllScenarios()

            );

            res.status(200).json({

                success: true,

                message: `${zone} changed to ${scenario}`,

                scenarios: ScenarioManager.getAllScenarios()

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    getScenarios(req, res) {

        res.status(200).json({

            success: true,

            scenarios: ScenarioManager.getAllScenarios()

        });

    }
    getScenarioConfig(req, res) {

    res.status(200).json({

        success: true,

        data: ScenarioConfig

    });

}

    resetScenario(req, res) {

        try {

            const { zone } = req.body;

            if (!zone) {

                return res.status(400).json({

                    success: false,

                    message: "zone is required."

                });

            }

            ScenarioManager.resetScenario(zone);

            SocketManager.broadcastScenarioUpdate(

                ScenarioManager.getAllScenarios()

            );

            res.status(200).json({

                success: true,

                message: `${zone} reset to NORMAL`,

                scenarios: ScenarioManager.getAllScenarios()

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    resetAllScenarios(req, res) {

        try {

            ScenarioManager.resetAll();

            SocketManager.broadcastScenarioUpdate(

                ScenarioManager.getAllScenarios()

            );

            res.status(200).json({

                success: true,

                message: "All scenarios reset.",

                scenarios: ScenarioManager.getAllScenarios()

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = new ScenarioController();