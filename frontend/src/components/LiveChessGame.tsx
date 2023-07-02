"use client"
import React, { useEffect, useState } from 'react'
import io from "socket.io-client";
import * as ChessJS from "chess.js";
import { Chessboard } from "react-chessboard";
import { ChessGameDetailsInterface } from '@/interface';
import LoadingModel from './Model/LoadingModel';


const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

function LiveChessGame({ chessGameDetails }: { chessGameDetails: ChessGameDetailsInterface }) {
    const boardwidth = Math.round(window.innerWidth * 0.75);


    const { boardOrientation, myAddress, opponentAddress, isMatchCreator, matchId } = chessGameDetails;

    const [socket, setSocket] = useState<any>(null);


    const [game, setGame] = useState(new Chess());
    const [gameHistroy, setGameHistroy] = useState<string[]>([]);

    const [areBothPlayerConnected, setAreBothPlayerConnected] = useState(false);


    function makeAMove(move: { from: any; to: any; promotion: any; }) {
        const gameCopy = { ...game };
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result; // null if the move was illegal, the move object if the move was legal
    }

    function onDrop(sourceSquare: any, targetSquare: any, piece: any) {
        if (game.turn() !== boardOrientation[0]) return false
        const userMove = {
            from: sourceSquare,
            to: targetSquare,
            promotion: piece[1].toLowerCase() ?? "q",
        }
        const move = makeAMove(userMove);

        if (move === null) return false;
        socket.emit("chess-piece-moved", matchId, userMove)
        return true;
    }


    function checkAndUpdateDetails() {

        console.log("=================", game.turn(), "=================");

        // console.log(game.turn());
        setGameHistroy([...game.history()])
        // console.log(game.pgn({ max_width: 1 }));

        // console.log("in_check", game.in_check());

        // console.log("gameover",game.game_over());
        // // // Returns true if the game has ended via checkmate, stalemate, draw, threefold repetition, or insufficient material. Otherwise, returns false.
        // console.log("in_checkmate", game.in_checkmate());
        // console.log("in_stalemate", game.in_stalemate());
        // console.log("in_draw", game.in_draw());
        // console.log("=================");
    }
    useEffect(() => {
        checkAndUpdateDetails();
    }, [game])

    useEffect(() => {
        if (!socket) return
        socket.on("chess-piece-moved", (matchId: string, move: any) => {
            console.log("chess-piece-moved", matchId, move);
            makeAMove(move)
        })
        return () => {
            socket.off('chess-piece-moved')
        }
    }, [socket])

    function setBothPlayerConnected() {
        setAreBothPlayerConnected(true)
        console.log("4. reqest accepted. both player connected");
    }
    function connectWithOpponent() {

        if (isMatchCreator) {
            console.log("2. it is a match creator. waiting for opponent request");

            socket.on("connection-req-from-player", (_matchId: string, _opponentAddress: string) => {
                console.log("3. request from opponed", _opponentAddress);
                console.log(_matchId);

                socket.emit("connection-req-accepted", matchId, _opponentAddress, setBothPlayerConnected);
            })
        } else {
            socket.emit("connection-req-from-player", matchId, myAddress);
            console.log("2. it is a match joiner. sent request to join match");

            socket.on("connection-req-accepted", (_matchId: string, _yourAddress: string) => {
                console.log("3. connection-req-accepted", _matchId, _yourAddress);
                setBothPlayerConnected()
            })
        }
        return () => {
            socket.off('connection-req-from-player')
            socket.off('connection-req-accepted')
        }
    }
    useEffect(() => {
        const socketURI = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
        if (!socketURI) {
            setSocket(null);
            return;
        }
        const _socket = io(socketURI);
        _socket.on('connect', () => {
            _socket.emit("join-match", matchId, connectWithOpponent);
            console.log("1. joined match and connecting with opponent");

            setSocket(_socket);
        });

        return () => {
            _socket.close();
        };
    }, [setSocket]);


    return (
        <div className="w-full flex">
            {areBothPlayerConnected ?
                <>
                    <Chessboard boardWidth={boardwidth} boardOrientation={boardOrientation}
                        position={game.fen()} onPieceDrop={onDrop}
                    />
                    <div className="flex flex-col">
                        {gameHistroy && gameHistroy.map((item, key) => {
                            return (
                                <span>{item}</span>
                            )
                        })}
                    </div>
                </>
                :
                <LoadingModel isOpen={!areBothPlayerConnected}>
                    {socket ?
                        <>
                            <h1>Connected with server</h1>
                            <h1>Waiting for opponent to join....</h1>
                        </>
                        :
                        <h1>Connecting with server...</h1>
                    }
                </LoadingModel>
            }

        </div>
    )
}

export default LiveChessGame