"use client"
import React, { useState } from 'react'
import { MatchData, MatchDataResponse } from '@/interface/matchInterface';
import { createMatchApiCall, getMatchDetailsApiCall, joinMatchApiCall } from '@/apiCalls/matchApiCalls';
import { AxiosResponse } from 'axios';

import { useRouter } from 'next/navigation'
import { useAddress } from "@thirdweb-dev/react";


import PopUpModel from "@/components/Model/PopUpModel";
import { FaChessKing } from 'react-icons/fa';


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
        const response: AxiosResponse<MatchDataResponse> | undefined = await joinMatchApiCall(matchId, address);
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

            <button className='basic_btn' onClick={() => setIsModelOpen(true)}>
                <FaChessKing /> Join Match</button>

            <PopUpModel isOpen={isModelOpen} closeModal={() => setIsModelOpen(false)}>
                <div className="flex_center ">
                    <h1 className="text-4xl text-text-color font-bold mb-12">Join Match</h1>
                    <input className='basic_input' type="text" onChange={(e) => setMatchId(e.target.value)} placeholder="enter game id" />

                    {matchDetails ?
                    <>
                        <div className='flex_center text-white gap-2'>

                            <div className="flex_center border rounded-xl px-8 py-4 mt-8">
                                <h3 className="text-lg">Match Details</h3>
                            <h4 >Opponent Address: {matchDetails.matchCreatorAddress}</h4>
                            <h4>Stake Amount: {matchDetails.stackedAmount} FTM</h4>
                            <h4>Winner Amount: {1.95*matchDetails.stackedAmount} FTM</h4>
                            </div>
                            <button className='basic_btn' disabled={matchJoining} onClick={joinMatch}>Join Match</button>
                        </div>
                    </>
                        :
                        <button className='basic_btn mt-2' disabled={loadingMatchData} onClick={loadMatchDetails}>Load Match Details</button>

                    }
                </div>
            </PopUpModel>

        </>
    )
}

export default JoinMatch