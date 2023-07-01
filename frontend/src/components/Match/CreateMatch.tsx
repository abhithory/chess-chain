"use client"
import React, { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MatchDataResponse } from '@/interface/matchInterface';
import { createMatchApiCall } from '@/apiCalls/matchApiCalls';
import { AxiosResponse } from 'axios';
import { useAddress } from "@thirdweb-dev/react";

import PopUpModel from "@/components/Model/PopUpModel";


function CreateMatch() {
    const router = useRouter();
    const address = useAddress();


    const [stackedAmount, setStackedAmount] = useState(0);
    const [matchCreating, setMatchCreating] = useState(false);

    const [isModelOpen, setIsModelOpen] = useState(false);

    async function createMatch() {
        if (!address || stackedAmount <= 0) return
        setMatchCreating(true);
        const response: AxiosResponse<MatchDataResponse> | undefined = await createMatchApiCall(address, stackedAmount);
        console.log(response);

        if (response?.statusText === "OK") {
            router.push(`/match/${response?.data?.data?.matchId}`)
        }
        setMatchCreating(false);
    }

    return (
        <>

            <button className='basic_btn' onClick={() => setIsModelOpen(true)}>Create Match</button>

            <PopUpModel isOpen={isModelOpen} closeModal={() => setIsModelOpen(false)}>
                <div className="pt-8 px-2">
                    <input className='basic_input' type="number" onChange={(e) => setStackedAmount(Number(e.target.value))} placeholder="how much do you want to stake" />
                    <button className='basic_btn' disabled={matchCreating} onClick={createMatch}>Create Match</button>
                </div>
            </PopUpModel>

        </>
    )
}

export default CreateMatch