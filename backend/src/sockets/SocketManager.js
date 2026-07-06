let io = null;

class SocketManager {

    initialize(socketServer) {

        io = socketServer;

        io.on("connection", (socket) => {

            console.log(`Client Connected : ${socket.id}`);

            socket.emit("connection-success", {
                message: "Connected to SteelGuardian AI"
            });

            socket.on("disconnect", () => {

                console.log(`Client Disconnected : ${socket.id}`);

            });

        });

    }

    broadcastPlantState(plantState) {

        if (!io) return;

        io.emit("plant-update", plantState);

    }

    broadcastScenarioUpdate(scenarios) {

        if (!io) return;

        io.emit("scenario-update", scenarios);

    }

    broadcastAlarmUpdate(alarms) {

        if (!io) return;

        io.emit("alarm-update", alarms);

    }

}

module.exports = new SocketManager();