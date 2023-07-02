const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const matchRouter = require('./routes/match');
const { globalErrorHandler } = require('./controller/errorController');
const AppError = require('./utils/AppError');


const app = express();
app.use(express.json());
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
    socket.on('connection-req-from-player', (matchId,address) => {
        socket.to(matchId).emit('connection-req-from-player', matchId, address);
    });

    socket.on('connection-req-accepted', (matchId,address, connectionReqAccepted) => {
        socket.to(matchId).emit('connection-req-accepted', matchId, address);
        connectionReqAccepted()
    });

    socket.on('chess-piece-moved', (matchId, moveData) => {
        socket.to(matchId).emit('chess-piece-moved',matchId, moveData);
    });

    socket.on('join-match', (matchId, connectWithOpponent)=>{
        socket.join(matchId);
        connectWithOpponent()
    })

    //   socket.on('disconnect', () => {
    //     console.log('A user disconnected');
    //   });
});

app.all("*", (req, res, next) => {
    next(new AppError(`this ${req.originalUrl} route not defined`, 404));
})


app.use(globalErrorHandler);



module.exports = appServer;