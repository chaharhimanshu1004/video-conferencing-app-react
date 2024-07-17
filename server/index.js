const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust this to your React app's URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
