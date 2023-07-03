import React from 'react'
import { Chessboard } from "react-chessboard";


interface StyledChessBoardProps {
    position:any;
    boardOrientation:"white" | "black";
    onDrop:any;
    myAddress:string;
    opponentAddress:string;
    isCheck:boolean;
}

function StyledChessBoard({ position, boardOrientation, onDrop, myAddress, opponentAddress, isCheck }: StyledChessBoardProps) {

    const boardwidth = Math.round((Math.min(window.innerWidth, window.innerHeight) * 0.80));


    return (
        <div className='flex_center '>
            <div className="glassmorphism-chessboard-bg ">
                <div className="flex w-full text-text-color justify-end text-sm">
                    <p>{opponentAddress}</p>
                </div>
                <Chessboard boardWidth={boardwidth} boardOrientation={boardOrientation}
                    position={position()} onPieceDrop={onDrop}
                />
                <div className="flex w-full justify-between text-text-color text-sm">
                    <p>
                        {myAddress}
                    </p>
                    {isCheck &&
                        <p className="text-red-500 text-sm">
                            Check!
                        </p>
                    }
                </div>
            </div>
        </div>
    )
}

export default StyledChessBoard