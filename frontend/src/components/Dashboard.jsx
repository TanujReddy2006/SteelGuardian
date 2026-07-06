import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PlantFlow from "./PlantFlow";
import ScenarioPanel from "./ScenarioPanel";

export default function Dashboard() {
    return (
        <div className="h-screen w-full flex bg-slate-100 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-12 gap-6">

                        <section className="col-span-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[360px]">
                            <PlantFlow />
                        </section>

                        <section className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[250px]">
                            Plant Status
                        </section>

                        <section className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[250px] overflow-auto">
                            <ScenarioPanel />
                        </section>

                        <section className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[250px]">
                            Risk Analysis
                        </section>

                        <section className="col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[300px]">
                            Live Sensors
                        </section>

                        <section className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[300px]">
                            Active Alerts
                        </section>

                        <section className="col-span-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[300px]">
                            AI Explanation Engine
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
}