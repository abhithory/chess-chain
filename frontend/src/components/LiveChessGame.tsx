"use client"
import React, { useEffect, useState } from 'react'
import io from "socket.io-client";
import * as ChessJS from "chess.js";
import { ChessGameDetailsInterface } from '@/interface';
import LoadingModel from './Model/LoadingModel';
import SimpleLoader from './loader/loader';
import CopyButton from './Buttons/CopyButton';
import StyledChessBoard from './ChessBoard/StyledChessBoard';
import MovesHistroy from './ChessBoard/MovesHistroy';
import LoadingPrimaryBtn from './Buttons/LoadingPrimaryBtn';

import { useRouter } from 'next/navigation'






const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

function LiveChessGame({ chessGameDetails }: { chessGameDetails: ChessGameDetailsInterface }) {
    const router = useRouter();

    const { boardOrientation, myAddress, opponentAddress, isMatchCreator, matchId } = chessGameDetails;

    const [socket, setSocket] = useState<any>();


    const [game, setGame] = useState(new Chess());
    const [gameHistroy, setGameHistroy] = useState<string[]>([]);

    const [areBothPlayerConnected, setAreBothPlayerConnected] = useState(false);

    const [isCheck, setIsCheck] = useState(false);

    const [matchEndData, setMatchEndData] = useState<any>({
        matchOver: false,
        amIWinner: false
    });


    const [transactionLoading, setTransactionLoading] = useState(false)



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
        setIsCheck(game.in_check())


        if (game.game_over()) {
            setMatchEndData({
                matchOver: true,
                amIWinner: game.turn() !== boardOrientation[0]
            })
        }

        // console.log(game.turn());
        setGameHistroy([...game.history()])
        // console.log(game.pgn({ max_width: 1 }));

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

    const boardwidth = Math.round((Math.min(window.innerWidth, window.innerHeight) * 0.80));


    return (
        <>
            {areBothPlayerConnected &&
                <div className='flex items-stretch gap-10'>

                    <div className='basis-7/12 h-full'>
                        <StyledChessBoard boardOrientation={boardOrientation}
                            position={game.fen} onDrop={onDrop} />
                    </div>
                    <div className="basis-5/12 ">
                        <MovesHistroy movesHistory={gameHistroy} />
                    </div>
                </div>
            }


            <LoadingModel isOpen={matchEndData?.matchOver}>
                <div className="flex_center gap-2 text-text-color">

                    <h1 className='text-3xl mb-4 font-bold'>Match Over</h1>
                    <h2 className='text-2xl  font-semibold'>{matchEndData?.amIWinner ? "You are winner" : "You lost the game"}</h2>
                    {matchEndData?.amIWinner &&
                        <>
                            <LoadingPrimaryBtn text='Reedem Winning Price' loading={transactionLoading} onClick={() => setTransactionLoading(false)} disabled={transactionLoading} />
                            <LoadingPrimaryBtn className='' text='Mint Match NFT' loading={transactionLoading} onClick={() => setTransactionLoading(false)} disabled={transactionLoading} />
                        </>
                    }
                    <button className='basic_btn_3 mt-4' onClick={()=>router.push("/")}>Play Again</button>
                </div>
            </LoadingModel>

            <LoadingModel isOpen={!areBothPlayerConnected}>
                {socket ?
                    <div className='text-text-color'>
                        <h2 className='text-2xl'>Waiting for opponent to join</h2>
                        <SimpleLoader className='w-12 my-4' />

                        <div className="flex_center border border-black rounded-xl  py-4  mx-8">

                            <h3 className='text-lg mb-2 '>Share this mathId with other player</h3>
                            <h1>{matchId}</h1>
                            <CopyButton text={matchId} />
                        </div>
                    </div>
                    :
                    <h1>Connecting with server...</h1>
                }
            </LoadingModel>
        </>
    )
}

export default LiveChessGame