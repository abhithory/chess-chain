"use client"
import React, { useContext, useState } from 'react'
import { MatchData, MatchDataResponse } from '@/interface/matchInterface';
import { createMatchApiCall, getMatchDetailsApiCall, joinMatchApiCall } from '@/apiCalls/matchApiCalls';
import { AxiosResponse } from 'axios';

import { useRouter } from 'next/navigation'
import { useAddress } from "@thirdweb-dev/react";


import PopUpModel from "@/components/Model/PopUpModel";
import { FaChessKing } from 'react-icons/fa';
import LoadingPrimaryBtn from '../Buttons/LoadingPrimaryBtn';
import { Web3ConnectionContext } from '@/smartContract/Web3ConnectionContext';


function JoinMatch() {
    const router = useRouter();


    const { address, joinMatch } = useContext(Web3ConnectionContext);


    const [matchId, setMatchId] = useState("");
    const [matchJoining, setMatchJoining] = useState(false);
    const [loadingMatchData, setLoadingMatchData] = useState(false);


    const [matchDetails, setMatchDetails] = useState<MatchData>();

    const [isModelOpen, setIsModelOpen] = useState(false);

    async function joinMatchHandler() {
        if (!address) return
        setMatchJoining(true);
        const response: AxiosResponse<MatchDataResponse> | undefined = await joinMatchApiCall(matchId, address);
        if (response?.statusText === "OK") {
            const _matchId = response?.data?.data?.matchId;
            const matchJoined = await joinMatch(_matchId,Number(matchDetails?.stackedAmount));
            if (matchJoined) {
                router.push(`/match/${_matchId}`)
            } else{
                setMatchJoining(false);
            }
        } else {
            setMatchJoining(false);
        }
    }


    async function loadMatchDetails() {
        setLoadingMatchData(true);
        if (!address) return
        const response = await getMatchDetailsApiCall(matchId);
        if (response?.statusText === "OK") {
            const data = response.data.data
            setMatchDetails(data)
        }else {
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
                            <h4>Winner Amount: {2*matchDetails.stackedAmount} FTM</h4>
                            </div>
                            <LoadingPrimaryBtn text='Join Match' loading={matchJoining} onClick={joinMatchHandler} disabled={matchJoining}  />
                        </div>
                    </>
                        :
                        <LoadingPrimaryBtn className='mt-2' text='Load Match Details' loading={matchJoining} onClick={loadMatchDetails} disabled={matchJoining}  />


                    }
                </div>
            </PopUpModel>

        </>
    )
}

export default JoinMatch