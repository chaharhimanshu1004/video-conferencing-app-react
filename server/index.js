
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
    socket.on("user-toggle-audio",(userId,roomId)=>{
      console.log(`user ${userId} toggled audio`);
      socket.broadcast.to(roomId).emit("user-toggled-audio",userId);
    })
    socket.on("user-toggle-video",(userId,roomId)=>{
        console.log(`user ${userId} toggled video`);
        socket.broadcast.to(roomId).emit("user-toggled-video",userId);
    })
    socket.on("user-leave",(userId,roomId)=>{
        console.log(`user ${userId} toggled video`);
        socket.broadcast.to(roomId).emit("user-leave",userId);
    })
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      socket.broadcast.emit('user-disconnected', socket.id);
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

