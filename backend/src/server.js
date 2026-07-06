
const http = require("http");

const { Server } = require("socket.io");

const app = require("./app");

const SocketManager = require("./sockets/socketManager");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {

    cors: {

        origin: "http://localhost:5173",

        methods: ["GET", "POST"]

    }

});

SocketManager.initialize(io);

server.listen(PORT, () => {

    console.log("----------------------------------");

    console.log(`SteelGuardian AI Server Running`);

    console.log(`Port : ${PORT}`);

    console.log("----------------------------------");

});