import React from 'react'
import { Chessboard } from "react-chessboard";


function StyledChessBoard({ position, boardOrientation, onDrop }: any) {

    const boardwidth = Math.round((Math.min(window.innerWidth, window.innerHeight) * 0.80));


    return (
        <div className='flex_center '>
            <div className="glassmorphism-bg rounded-xl">
            <Chessboard boardWidth={boardwidth} boardOrientation={boardOrientation}
                position={position()} onPieceDrop={onDrop}
                />
                </div>
        </div>
    )
}

export default StyledChessBoard