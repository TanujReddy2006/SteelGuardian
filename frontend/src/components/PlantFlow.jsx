import { useEffect, useState } from "react";
import socket from "../services/socket";
import PlantNode from "./PlantNode";
import { FaArrowRight } from "react-icons/fa";

export default function PlantFlow() {

    const [plant, setPlant] = useState(null);

    useEffect(() => {

        socket.on("plant-update", (data) => {

            setPlant(data);

        });

        return () => {

            socket.off("plant-update");

        };

    }, []);

    if (!plant) {

        return (

            <div className="h-full flex items-center justify-center">

                Waiting for plant data...

            </div>

        );

    }

    const zones = [

        {
            title: "Raw Material",
            health: Math.round(plant.rawMaterialYard.health.availability),
            production: `${plant.rawMaterialYard.production.oreFeedRate.toFixed(1)} t/hr`,
            status:
                plant.rawMaterialYard.alarms.length > 0
                    ? "WARNING"
                    : "NORMAL"
        },

        {
            title: "Coke Oven",
            health: Math.round(plant.cokeOven.health.availability),
            production: `${plant.cokeOven.production.cokeProduction.toFixed(1)} t/hr`,
            status:
                plant.cokeOven.alarms.length > 0
                    ? "WARNING"
                    : "NORMAL"
        },

        {
            title: "Blast Furnace",
            health: Math.round(plant.blastFurnace.health.availability),
            production: `${plant.blastFurnace.production.hotMetalProduction.toFixed(1)} t/hr`,
            status:
                plant.blastFurnace.alarms.length > 0
                    ? "CRITICAL"
                    : "NORMAL"
        },

        {
            title: "SMS",
            health: Math.round(plant.sms.health.availability),
            production: `${plant.sms.production.moltenSteelProduction.toFixed(1)} t/hr`,
            status:
                plant.sms.alarms.length > 0
                    ? "WARNING"
                    : "NORMAL"
        },

        {
            title: "Rolling Mill",
            health: Math.round(plant.rollingMill.health.availability),
            production: `${plant.rollingMill.production.finishedSteel.toFixed(1)} t/hr`,
            status:
                plant.rollingMill.alarms.length > 0
                    ? "WARNING"
                    : "NORMAL"
        }

    ];

    return (

        <div>

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">

                        Steel Plant Digital Twin

                    </h1>

                    <p className="text-gray-600 mt-1">

                        Live Production Flow

                    </p>

                </div>

                <div className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">

                    LIVE

                </div>

            </div>

            <div className="flex justify-center items-center gap-5 flex-wrap">

                {

                    zones.map((zone, index) => (

                        <div
                            key={zone.title}
                            className="flex items-center gap-5"
                        >

                            <PlantNode {...zone} />

                            {

                                index !== zones.length - 1 && (

                                    <FaArrowRight
                                        className="text-2xl text-slate-400"
                                    />

                                )

                            }

                        </div>

                    ))

                }

            </div>

        </div>

    );

}   