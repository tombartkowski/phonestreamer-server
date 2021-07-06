import WebSocket, { Server as WebSocketServer } from 'ws';

type WebSocketMessage = {
  senderId: string;
  type: string;
  recieverId?: string;
  payload?: any;
};

const rawMessageIsWebSocketMessage = (rawMessage: any): rawMessage is WebSocketMessage => {
  return rawMessage.senderId !== undefined && rawMessage.type !== undefined;
};

let connectedClients: { [key: string]: WebSocket } = {};
let pendingMessages: {
  recieverId: string;
  payload: string;
}[] = [];
let webSocketServer: WebSocketServer;

const createServer = () => {
  webSocketServer = new WebSocketServer({
    port: parseInt(process.env.SIGNALING_SERVER_PORT || '3003'),
  });

  webSocketServer.on('connection', webSocket => {
    console.log(`🔌[socket] Connected client.`);
    webSocket.on('message', data => {
      console.log(`🔌[socket] Raw message ${data.toString()}.`);
      const rawMessage = JSON.parse(data.toString());
      if (!rawMessageIsWebSocketMessage(rawMessage)) {
        return;
      }
      const message = rawMessage as WebSocketMessage;
      if (message.type == 'subscribe') {
        const senderId = String(message.senderId);
        console.log(`🔌[socket] Subscribed client ${senderId}.`);
        connectedClients[senderId] = webSocket;
        pendingMessages
          .filter(pm => pm.recieverId === senderId)
          .forEach(pm => {
            console.log(`🔌[socket] Sending pending messages to ${pm.recieverId} | ${pm.payload}`);
            webSocket.send(pm.payload);
          });
        const ackMessage = {
          type: 'ack',
        };
        webSocket.send(JSON.stringify(ackMessage));
      } else if (message.type == 'forward') {
        const recieverId = String(message.recieverId);
        const senderId = String(message.senderId);
        const payload = JSON.stringify(message.payload);
        if (connectedClients[recieverId] !== undefined) {
          console.log(`🔌[socket] ${senderId} -> ${recieverId} | ${payload}`);
          connectedClients[recieverId].send(payload);
        } else {
          pendingMessages.push({
            recieverId,
            payload,
          });
        }
      }
    });
  });

  webSocketServer.on('listening', () => {
    console.log(`🔌[socket] Sockets are running at http://localhost:3003`);
  });
};

export default createServer;
