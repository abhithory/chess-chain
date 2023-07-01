const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const matchRouter = require('./routes/match');
const { globalErrorHandler } = require('./controller/errorController');


const app = express();
app.use(cors()); // Enable CORS for Express.js

app.use("/api/v1/match",matchRouter);


const appServer = http.createServer(app);
const io = socketIO(appServer, {
    cors: {
        // origin: 'http://localhost:3000', 
        origin: '*', 
        methods: ['GET', 'POST'],
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


app.use(globalErrorHandler);

module.exports = appServer;