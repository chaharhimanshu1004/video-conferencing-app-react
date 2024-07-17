const express = require('express');
const cors = require('cors');
const http = require('http');
const createPeerServer = require('./PeerServer');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const peerServer = createPeerServer(server);
app.use('/peerjs', peerServer);

const port = process.env.PORT || 4100;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join-room',(roomId,userId)=>{
    console.log(`a user ${userId} joined the room ${roomId} `);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected',userId); // user connected msg to everyone in the room except myself
  })


  
});
