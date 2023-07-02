"use client"
import React, { useState } from 'react'
import { MatchData, MatchDataResponse } from '@/interface/matchInterface';
import { createMatchApiCall, getMatchDetailsApiCall, joinMatchApiCall } from '@/apiCalls/matchApiCalls';
import { AxiosResponse } from 'axios';

import { useRouter } from 'next/navigation'
import { useAddress } from "@thirdweb-dev/react";


import PopUpModel from "@/components/Model/PopUpModel";


function JoinMatch() {
    const router = useRouter();
    const address = useAddress();

    const [matchId, setMatchId] = useState("");
    const [stackedAmount, setStackedAmount] = useState(0);
    const [matchJoining, setMatchJoining] = useState(false);
    const [loadingMatchData, setLoadingMatchData] = useState(false);


    const [matchDetails, setMatchDetails] = useState<MatchData>();

    const [isModelOpen, setIsModelOpen] = useState(false);

    async function joinMatch() {
        if (!address) return
        setMatchJoining(true);
        const response: AxiosResponse<MatchDataResponse> | undefined = await joinMatchApiCall(matchId,address);
        if (response?.statusText === "OK") {
            router.push(`/match/${response?.data?.data?.matchId}`)
        }
        setMatchJoining(false);
    }


    async function loadMatchDetails() {
        setLoadingMatchData(true);
        if (!address) return
        const response = await getMatchDetailsApiCall(matchId);
        if (response?.statusText === "OK") {
            const data = response.data.data
            setStackedAmount(Number(data.stackedAmount));
            setMatchDetails(data)
            setLoadingMatchData(false);
        }
    }


    return (
        <>

            <button className='basic_btn' onClick={() => setIsModelOpen(true)}>Join Match</button>

            <PopUpModel isOpen={isModelOpen} closeModal={() => setIsModelOpen(false)}>
                <div className="pt-8 px-2">
                    <input className='basic_input' type="text" onChange={(e) => setMatchId(e.target.value)} placeholder="enter game id" />
                    <button className='basic_btn' disabled={loadingMatchData} onClick={loadMatchDetails}>load Match</button>

                    {matchDetails &&
                        <>
                            <h4>Opponent Address: {matchDetails.matchCreatorAddress}</h4>
                            <h4>You have to stack {matchDetails.stackedAmount} Matic to play</h4>
                            <button className='basic_btn' disabled={matchJoining} onClick={joinMatch}>Join Match</button>
                        </>
                    }
                </div>
            </PopUpModel>

        </>
    )
}

export default JoinMatch