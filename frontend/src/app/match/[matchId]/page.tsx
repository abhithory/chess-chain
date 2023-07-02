"use client"

import { getMatchDetailsApiCall } from '@/apiCalls/matchApiCalls';
import React, { useEffect, useState } from 'react'
import { useAddress } from "@thirdweb-dev/react";
import LiveChessGame from '@/components/LiveChessGame';
import { ChessGameDetailsInterface } from '@/interface';
import SimpleLoader from '@/components/loader/loader';



export default function Page({ params: { matchId } }: { params: { matchId: string } }) {
    const address = useAddress();

    const [chessGameDetails, setChessGameDetails] = useState<ChessGameDetailsInterface>({
        matchId: "",
        isMatchCreator: true,
        boardOrientation: "white",
        myAddress: "",
        opponentAddress: "",
    })


    const [loadingMatchData, setLoadingMatchData] = useState(true);

    async function loadMatchData() {
        setLoadingMatchData(true);
        if (!address) return
        const response = await getMatchDetailsApiCall(matchId);
        if (response?.statusText === "OK") {
            const data = response.data.data
            const isMatchCreator = data.matchCreatorAddress === address
            const boardOrientation = data.matchCreatorAddress === address ? "white" : "black";
            setChessGameDetails({ matchId, isMatchCreator, boardOrientation, myAddress: address, opponentAddress: isMatchCreator ? data.matchJoinerAddress : data.matchCreatorAddress })
            setLoadingMatchData(false);
        }
    }
    useEffect(() => {
        loadMatchData();
    }, [address])

    return (
        <section className="w-screen h-screen overflow-hidden flex_center">
            {loadingMatchData ?
                <SimpleLoader className='w-20' />
                :
                <LiveChessGame chessGameDetails={chessGameDetails} />}
        </section>
    )
}

