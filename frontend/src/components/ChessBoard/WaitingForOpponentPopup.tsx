"use client";
import React, { useContext, useState } from 'react'
import CopyButton from '../Buttons/CopyButton';
import SimpleLoader from '../loader/loader';


interface WaitingForOpponentProps {
    matchId: string;
    socket: any;
}
function WaitingForOpponentPopup({ socket, matchId }: WaitingForOpponentProps) {
    return (
        socket ?
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

    )
}

export default WaitingForOpponentPopup