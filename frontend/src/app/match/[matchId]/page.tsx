"use client"

import { getMatchDetailsApiCall } from '@/apiCalls/matchApiCalls';
import React, { useEffect, useState } from 'react'
import { useAddress } from "@thirdweb-dev/react";



export default function Page({ params: { matchId } }: { params: { matchId: string } }) {
    const address = useAddress();

    const [chessGameDetails, setChessGameDetails] = useState({
        boardOrientation: "white",
        yourAddress:"",
        opponentAddress: "",
    })


    const [loadingMatchData, setLoadingMatchData] = useState(true);

    async function loadMatchData() {
        setLoadingMatchData(true);
        const response = await getMatchDetailsApiCall(matchId);
        if (response?.statusText === "OK") {

            console.log(response.data.data);

            setLoadingMatchData(false);
        }

    }
    useEffect(() => {
        loadMatchData();
    }, [])

    return (<form>
        <input className='basic_input' id='roomcode' name='roomcode' type="text" placeholder="code of room which you want to join" />
        <button className='basic_btn' type='submit'>
            Join Match
        </button>
    </form>)
}

