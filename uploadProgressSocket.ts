import WebSocket, { Server as WebSocketServer } from 'ws';

export interface UploadProgressSocket {
  sendProgress: (user: string, progress: number) => void;
}

export const uploadProgressSocket = (): UploadProgressSocket => {
  let connectedClients: { [key: string]: WebSocket } = {};
  const webSocketServer = new WebSocketServer({
    port: parseInt(process.env.UPLOAD_PROGRESS_SOCKET_PORT || '3005'),
  });

  webSocketServer.on('connection', webSocket => {
    console.log(`🔌[upload socket] Connected client.`);
    webSocket.on('message', data => {
      const message = JSON.parse(data.toString());
      if (message.type === 'subscribe') {
        const user = String(message.user);
        console.log(`🔌[upload socket] Subscribed client ${user}.`);
        connectedClients[user] = webSocket;
      }
    });
  });

  webSocketServer.on('listening', () => {
    console.log(`🔌[upload socket] Sockets are running at http://localhost:3005`);
  });

  return {
    sendProgress: (user, progress) => {
      connectedClients[user].send(
        JSON.stringify({
          progress,
        })
      );
    },
  };
};
