const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const matchRouter = require('./routes/match');


const app = express();
app.use(cors()); // Enable CORS for Express.js

app.use("/api/v1/match",matchRouter);

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your allowed origin
        methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    },
});
io.on('connection', socket => {
    socket.on('connect-with-player', (from,to,connectedToRoom) => {
        socket.to(to).emit('connection-req-from-player', from);
        connectedToRoom()
    });


    socket.on('move-chess-piece', (opponentId, moveData) => {
        socket.to(opponentId).emit('chess-piece-moved', moveData);
    });

    socket.on('join-game-room', (roomId)=>{
        socket.join(roomId);
    })

    //   socket.on('disconnect', () => {
    //     console.log('A user disconnected');
    //   });
});

const port = 3001;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
