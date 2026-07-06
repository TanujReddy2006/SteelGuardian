const express = require("express");

const router = express.Router();

const ScenarioController = require("../controllers/scenarioController");

// Get all active scenarios
router.get("/", ScenarioController.getScenarios);

// Change scenario
router.post("/", ScenarioController.setScenario);

// Reset one zone
router.post("/reset", ScenarioController.resetScenario);

// Reset entire plant
router.post("/reset-all", ScenarioController.resetAllScenarios);
router.get("/config", ScenarioController.getScenarioConfig);

module.exports = router;