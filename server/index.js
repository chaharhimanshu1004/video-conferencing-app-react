
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const createPeerServer = require('./PeerServer');

const app = express();
const server = http.createServer(app);

let io;

if (!server.io) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  server.io = io;

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', (roomId, userId) => {
      console.log(`A user ${userId} joined the room ${roomId}`);
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('user-connected', userId);
    });
  });

  console.log('Socket server initialized');
} else {
  io = server.io;
  console.log('Socket already running');
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Initialize PeerJS server
const peerServer = createPeerServer(server);
app.use('/peerjs', peerServer);

const port = process.env.PORT || 4100;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

