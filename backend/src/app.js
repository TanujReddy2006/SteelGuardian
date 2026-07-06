const express = require("express");
const cors = require("cors");

const plantRoutes = require("./routes/plantRoutes");
const scenarioRoutes = require("./routes/scenarioRoutes");

const app = express();

/* ---------------- Middleware ---------------- */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ---------------- Health Check ---------------- */

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "SteelGuardian AI Backend Running"

    });

});

/* ---------------- Routes ---------------- */

app.use("/api/plant", plantRoutes);

app.use("/api/scenario", scenarioRoutes);

/* ---------------- 404 ---------------- */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route Not Found"

    });

});

/* ---------------- Error Handler ---------------- */

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});

module.exports = app;