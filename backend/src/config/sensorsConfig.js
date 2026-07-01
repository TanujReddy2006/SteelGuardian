// src/config/sensorConfig.js

const sensorConfig = {

    blast_furnace: [

        {
            id: "BF_TEMP_001",
            name: "Furnace Temperature",
            type: "temperature",
            unit: "°C",
            minValue: 1450,
            maxValue: 1600,
            initialValue: 1500,
            updateInterval: 2000
        },

        {
            id: "BF_PRESS_001",
            name: "Furnace Pressure",
            type: "pressure",
            unit: "bar",
            minValue: 7,
            maxValue: 9,
            initialValue: 8,
            updateInterval: 2000
        },

        {
            id: "BF_CO_001",
            name: "CO Gas",
            type: "gas",
            unit: "ppm",
            minValue: 20,
            maxValue: 45,
            initialValue: 30,
            updateInterval: 1000
        },

        {
            id: "BF_COOL_001",
            name: "Cooling Water Flow",
            type: "flow",
            unit: "%",
            minValue: 80,
            maxValue: 100,
            initialValue: 95,
            updateInterval: 2000
        },

        {
            id: "BF_TOP_001",
            name: "Top Gas Pressure",
            type: "pressure",
            unit: "bar",
            minValue: 3,
            maxValue: 5,
            initialValue: 4,
            updateInterval: 2000
        },

        {
            id: "BF_VIB_001",
            name: "Vibration",
            type: "vibration",
            unit: "mm/s",
            minValue: 1,
            maxValue: 4,
            initialValue: 2,
            updateInterval: 5000
        }

    ]

};

module.exports = sensorConfig;