const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Map();

server.on('connection', (ws) => {
    const id = generateUniqueId();
    clients.set(ws, id);

    ws.on('message', (message) => {
        // Broadcast message to all connected clients
        server.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}