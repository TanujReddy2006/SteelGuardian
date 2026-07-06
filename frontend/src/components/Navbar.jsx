import { FaBell, FaUserCircle, FaCircle } from "react-icons/fa";

export default function Navbar() {

    return (

        <header className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8">

            {/* Left */}

            <div>

                <h1 className="text-3xl font-bold text-slate-800">

                    SteelGuardian AI

                </h1>

                <p className="text-sm text-gray-500">

                    Steel Plant Digital Twin Dashboard

                </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-8">

                {/* Simulation Status */}

                <div className="flex items-center gap-2">

                    <FaCircle className="text-green-500 text-xs animate-pulse"/>

                    <span className="text-gray-700 font-medium">

                        Simulation Running

                    </span>

                </div>

                {/* Notification */}

                <button className="relative">

                    <FaBell className="text-2xl text-slate-600"/>

                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex justify-center items-center">

                        3

                    </span>

                </button>

                {/* User */}

                <div className="flex items-center gap-3">

                    <FaUserCircle className="text-4xl text-slate-700"/>

                    <div>

                        <p className="font-semibold">

                            Administrator

                        </p>

                        <p className="text-xs text-gray-500">

                            Plant Control

                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

}