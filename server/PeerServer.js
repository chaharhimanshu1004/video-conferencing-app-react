const { ExpressPeerServer } = require('peer');

const createPeerServer = (server) => {
  const peerServer = ExpressPeerServer(server, {
    path: '/myapp'
  });

  peerServer.on('connection', (client) => {
    console.log(`Client connected: ${client.getId()}`);
  });

  peerServer.on('disconnect', (client) => {
    console.log(`Client disconnected: ${client.getId()}`);
  });

  return peerServer;
};

module.exports = createPeerServer;