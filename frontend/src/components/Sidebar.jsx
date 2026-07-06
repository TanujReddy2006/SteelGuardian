import {
    FaIndustry,
    FaChartLine,
    FaMicrochip,
    FaExclamationTriangle,
    FaRobot,
    FaCog,
    FaProjectDiagram
} from "react-icons/fa";

const menuItems = [
    {
        title: "Dashboard",
        icon: <FaChartLine />
    },
    {
        title: "Plant Overview",
        icon: <FaIndustry />
    },
    {
        title: "Live Sensors",
        icon: <FaMicrochip />
    },
    {
        title: "Scenarios",
        icon: <FaProjectDiagram />
    },
    {
        title: "Alerts",
        icon: <FaExclamationTriangle />
    },
    {
        title: "AI Assistant",
        icon: <FaRobot />
    },
    {
        title: "Settings",
        icon: <FaCog />
    }
];

export default function Sidebar() {

    return (

        <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col">

            <div className="p-6 border-b border-slate-700">

                <h1 className="text-2xl font-bold">

                    SteelGuardian AI

                </h1>

                <p className="text-sm text-gray-400 mt-2">

                    Industrial Safety Platform

                </p>

            </div>

            <div className="flex-1 py-6">

                {

                    menuItems.map((item) => (

                        <button

                            key={item.title}

                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-800 transition-all duration-200"

                        >

                            <span className="text-lg">

                                {item.icon}

                            </span>

                            <span>

                                {item.title}

                            </span>

                        </button>

                    ))

                }

            </div>

            <div className="border-t border-slate-700 p-5">

                <div className="text-sm">

                    Simulation

                </div>

                <div className="mt-2 flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"/>

                    <span className="text-green-400">

                        Running

                    </span>

                </div>

            </div>

        </aside>

    );

}