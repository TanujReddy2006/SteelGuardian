const express = require("express");

const router = express.Router();

const PlantController = require("../controllers/plantController");

// Get complete plant state
router.get("/", PlantController.getPlantState);

// Start simulation
router.post("/start", PlantController.startSimulation);

// Stop simulation
router.post("/stop", PlantController.stopSimulation);

// Simulation status
router.get("/status", PlantController.getSimulationStatus);

module.exports = router;