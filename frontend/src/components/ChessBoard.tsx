"use client"
import React, { useEffect, useState } from 'react'
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";


function ChessBoard() {
    // @ts-ignore: someting in chess libarray
    const [game, setGame] = useState(new Chess());
    const [gameHistroy, setGameHistroy] = useState([])
    
    function makeAMove(move: { from: any; to: any; promotion: string; }) {
        const gameCopy = { ...game };
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result; // null if the move was illegal, the move object if the move was legal
    }

    function makeRandomMove() {
        const possibleMoves = game.moves();
        if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
            return; // exit if the game is over
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        makeAMove(possibleMoves[randomIndex]);
    }

    function onDrop(sourceSquare: any, targetSquare: any) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return false;
        setTimeout(makeRandomMove, 200);
        return true;
    }

    useEffect(() => {
        setGameHistroy(game.history())

        console.log("==============");
        console.log(game.turn());
        console.log( game.pgn({ max_width: 1 }));
        console.log( typeof game.pgn({ newline: '\n' }));
        
        // console.log("in_check",game.in_check());
        // console.log("in_checkmate",game.in_checkmate());
        // console.log("in_stalemate",game.in_stalemate());
        // console.log("in_draw",game.in_draw());

        // // Returns true if the game has ended via checkmate, stalemate, draw, threefold repetition, or insufficient material. Otherwise, returns false.
        // console.log("gameover",game.game_over());
        

        
    }, [game])
    

    return (
        <div className="w-[30rem] flex">
            <Chessboard position={game.fen()} onPieceDrop={onDrop}
            />
            <div className="flex flex-col">
                {gameHistroy && gameHistroy.map((item, key)=>{
                    return (
                        <span>{item}</span>
                    )
                })}
            </div>
        </div>
    )
}

export default ChessBoard