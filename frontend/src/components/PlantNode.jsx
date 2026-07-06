import { FaIndustry } from "react-icons/fa";

export default function PlantNode({
    title,
    status = "NORMAL",
    production = "--",
    health = 100
}) {

    const styles = {
        NORMAL: {
            border: "border-green-500",
            badge: "bg-green-100 text-green-700",
            dot: "bg-green-500"
        },
        WARNING: {
            border: "border-yellow-500",
            badge: "bg-yellow-100 text-yellow-700",
            dot: "bg-yellow-500"
        },
        CRITICAL: {
            border: "border-red-500",
            badge: "bg-red-100 text-red-700",
            dot: "bg-red-500"
        }
    };

    const style = styles[status] || styles.NORMAL;

    return (
        <div
            className={`
                bg-white
                rounded-2xl
                border-l-4
                ${style.border}
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                w-60
                p-5
            `}
        >

            {/* Header */}

            <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                        <FaIndustry className="text-blue-600 text-xl"/>

                    </div>

                    <div>

                        <h2 className="font-bold text-slate-800">

                            {title}

                        </h2>

                        <p className="text-xs text-gray-500">

                            Steel Plant Unit

                        </p>

                    </div>

                </div>

                <div className={`w-3 h-3 rounded-full ${style.dot} animate-pulse`} />

            </div>

            <hr className="my-4"/>

                {/* Health */}

                <div className="flex justify-between mb-4">

                    <span className="text-gray-500">

                        Health

                    </span>

                    <span className="font-bold text-green-600">

                        {health}%

                    </span>

                </div>

                {/* Production */}

                <div className="flex justify-between mb-4">

                    <span className="text-gray-500">

                        Production

                    </span>

                    <span className="font-semibold">

                        {production}

                    </span>

                </div>

                {/* Status */}

                <div className="mt-5">

                    <span
                        className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            ${style.badge}
                        `}
                    >
                        {status}
                    </span>

                </div>

        </div>
    );

}