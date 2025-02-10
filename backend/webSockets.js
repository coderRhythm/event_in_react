const WebSocket = require("ws");

function createWebSocketServer(server) {
    const wss = new WebSocket.Server({ server }); // Attach WebSocket to HTTP server

    wss.on("connection", (ws) => {
        console.log("Client connected");

        ws.on("message", (message) => {
            console.log(`Received message: ${message}`);
        });

        ws.on("close", () => {
            console.log("Client disconnected");
        });
    });

    return wss;
}

module.exports = createWebSocketServer;
