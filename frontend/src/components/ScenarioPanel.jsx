    import { useEffect, useState } from "react";
    import axios from "axios";

    const API = "http://localhost:5000/api";

    const zoneNames = {
        rawMaterialYard: "Raw Material",
        cokeOven: "Coke Oven",
        blastFurnace: "Blast Furnace",
        sms: "SMS",
        rollingMill: "Rolling Mill"
    };

    export default function ScenarioPanel() {

        const [config, setConfig] = useState({});
        const [zone, setZone] = useState("");
        const [scenario, setScenario] = useState("");
        const [currentScenarios, setCurrentScenarios] = useState({});
        const [simulationRunning, setSimulationRunning] = useState(false);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            loadScenarioConfig();
            loadCurrentScenarios();
            getSimulationStatus();
        }, []);

        async function loadScenarioConfig() {

            const res = await axios.get(`${API}/scenario/config`);

            const data = res.data.data;

            setConfig(data);

            const zones = Object.keys(data);

            if (zones.length) {

                setZone(zones[0]);
                setScenario(data[zones[0]][0]);

            }

        }

        async function loadCurrentScenarios() {

            try {

                const res = await axios.get(`${API}/scenario`);

                setCurrentScenarios(res.data.scenarios);

            }

            catch (err) {

                console.log(err);

            }

        }

        async function getSimulationStatus() {

            try {

                const res = await axios.get(`${API}/plant/status`);

                setSimulationRunning(
                    res.data.running ??
                    res.data.data?.running ??
                    false
                );

            }

            catch (err) {

                console.log(err);

            }

        }

        async function startSimulation() {

            try {

                setLoading(true);

                await axios.post(`${API}/plant/start`, {

                    tickRate: 1000

                });

                setSimulationRunning(true);

            }

            finally {

                setLoading(false);

            }

        }

        async function stopSimulation() {

            try {

                setLoading(true);

                await axios.post(`${API}/plant/stop`);

                setSimulationRunning(false);

            }

            finally {

                setLoading(false);

            }

        }

        async function applyScenario() {

            try {

                setLoading(true);

                await axios.post(`${API}/scenario`, {

                    zone,
                    scenario

                });

                await loadCurrentScenarios();

            }

            catch (err) {

                console.log(err);

            }

            finally {

                setLoading(false);

            }

        }

        return (

            <div className="bg-white rounded-xl p-4 h-full flex flex-col">

                <div className="flex justify-between items-center mb-3">

                    <h2 className="font-bold text-lg">

                        Scenario Control

                    </h2>

                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            simulationRunning
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {simulationRunning ? "Running" : "Stopped"}
                    </span>

                </div>

                <div className="space-y-3">

                    <div>

                        <label className="text-sm font-medium text-gray-700">

                            Zone

                        </label>

                        <select
    value={zone}
    onChange={(e) => {
        setZone(e.target.value);
        setScenario(config[e.target.value][0]);
    }}
    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
>
    {Object.keys(config).map((item) => (
        <option
            key={item}
            value={item}
            className="text-black bg-white"
        >
            {zoneNames[item]}
        </option>
    ))}
</select>

                    </div>

                    <div>

                        <label className="text-sm font-medium text-gray-700">

                            Scenario

                        </label>

                        <select
    value={scenario}
    onChange={(e) => setScenario(e.target.value)}
    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
>
    {(config[zone] || []).map((item) => (
        <option
            key={item}
            value={item}
            className="text-black bg-white"
        >
            {item}
        </option>
    ))}
</select>

                    </div>

                    <button
                        disabled={loading}
                        onClick={applyScenario}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-semibold"
                    >

                        Apply Scenario

                    </button>

                    {simulationRunning ? (

                        <button
                            disabled={loading}
                            onClick={stopSimulation}
                            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-semibold"
                        >

                            Stop Simulation

                        </button>

                    ) : (

                        <button
                            disabled={loading}
                            onClick={startSimulation}
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-semibold"
                        >

                            Start Simulation

                        </button>

                    )}

                </div>

                <hr className="my-4"/>

                <h3 className="font-semibold text-sm mb-2">

                    Current Plant Scenarios

                </h3>

                <div className="space-y-2 text-sm overflow-y-auto">

                    {

                        Object.entries(currentScenarios).map(([zone, value]) => (

                            <div
                                key={zone}
                                className="flex justify-between items-center"
                            >

                                <span className="text-gray-600">

                                    {zoneNames[zone]}

                                </span>

                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                        value === "NORMAL"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >

                                    {value}

                                </span>

                            </div>

                        ))

                    }

                </div>

            </div>

        );

    }