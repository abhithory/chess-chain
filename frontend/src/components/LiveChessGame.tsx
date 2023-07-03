"use client"
import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import * as ChessJS from "chess.js";
import { ChessGameDetailsInterface } from '@/interface';
import LoadingModel from './Model/LoadingModel';
import StyledChessBoard from './ChessBoard/StyledChessBoard';
import MovesHistroy from './ChessBoard/MovesHistroy';

import MatchResultPopup from './ChessBoard/MatchResultPopup';
import { MatchResultEnum } from '@/smartContract/networkDetails';
import { MatchEndData } from '@/interface/matchInterface'; import WaitingForOpponentPopup from './ChessBoard/WaitingForOpponentPopup';






const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

function LiveChessGame({ chessGameDetails }: { chessGameDetails: ChessGameDetailsInterface }) {
    const { boardOrientation, myAddress, opponentAddress, isMatchCreator, matchId, stakeAmount } = chessGameDetails;

    const [opponentWalletAddress, setOpponentWalletAddress] = useState(opponentAddress)

    const [socket, setSocket] = useState<any>();

    const [game, setGame] = useState(new Chess());
    const [gameHistroy, setGameHistroy] = useState<string[]>([]);

    const [areBothPlayerConnected, setAreBothPlayerConnected] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const chessBoardDivRef = useRef(null);

    const [matchEndData, setMatchEndData] = useState<MatchEndData>({
        matchOver: false,
        isDraw: false,
        amIWinner: false,
        matchResult: MatchResultEnum.DRAW
    });


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
        setGameHistroy([...game.history()])
        setIsCheck(game.in_check())


        if (game.game_over()) {
            const isDraw = game.in_draw();
            const amIWinner = game.turn() !== boardOrientation[0];
            setMatchEndData({
                matchOver: true,
                isDraw,
                amIWinner,
                matchResult: isDraw ? MatchResultEnum.DRAW : ((amIWinner && isMatchCreator) ? MatchResultEnum.MATCH_CREATOR : MatchResultEnum.MATCH_JOINER)
            })
        }


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
                setOpponentWalletAddress(_opponentAddress)
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
    }

    useEffect(() => {
        if (!socket) return
        connectWithOpponent();
        return () => {
            socket.off('connection-req-from-player')
            socket.off('connection-req-accepted')
        }
    }, [socket])

    useEffect(() => {
        const socketURI = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
        if (!socketURI) {
            setSocket(null);
            return;
        }
        const _socket = io(socketURI);
        _socket.on('connect', () => {
            _socket.emit("join-match", matchId, () => { });
            setSocket(_socket);
            console.log("1. joined match and connecting with opponent");

        });

        return () => {
            _socket.close();
        };
    }, [setSocket]);

    return (
        <>
            {areBothPlayerConnected &&
                <div className='flex items-stretch gap-10' ref={chessBoardDivRef}>
                    <div className='basis-7/12 h-full'>
                        <StyledChessBoard boardOrientation={boardOrientation}
                            position={game.fen} onDrop={onDrop} myAddress={myAddress} opponentAddress={opponentWalletAddress} isCheck={isCheck} />
                    </div>
                    <div className="basis-5/12 mr-4 mt-4">
                        <MovesHistroy movesHistory={gameHistroy} />
                    </div>
                </div>
            }


            <LoadingModel isOpen={matchEndData?.matchOver}>
                <MatchResultPopup matchEndData={matchEndData} matchId={matchId} stakeAmount={stakeAmount} chessBoardDivRef={chessBoardDivRef} pgn={game.pgn()} movesHistory={gameHistroy} myAddress={myAddress} opponentAddress={opponentWalletAddress} />
            </LoadingModel>

            <LoadingModel isOpen={!areBothPlayerConnected}>
                <WaitingForOpponentPopup matchId={matchId} socket={socket} />
            </LoadingModel>
        </>
    )
}

export default LiveChessGame