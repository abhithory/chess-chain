"use client"
import React, { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { MatchData } from '@/interface/matchInterface';
import { createMatchApiCall } from '@/apiCalls/matchApiCalls';
import { AxiosResponse } from 'axios';
import { useAddress } from "@thirdweb-dev/react";

import PopUpModel from "@/components/Model/PopUpModel";


function CreateMatch() {
    // const router = useRouter();
    const address = useAddress();


    const [stackedAmount, setStackedAmount] = useState(0);
    const [matchCreating, setMatchCreating] = useState(false);

    const [isModelOpen, setIsModelOpen] = useState(false);

    async function createMatch() {
        if (!address) return
        setMatchCreating(true);
        const response: AxiosResponse<MatchData> | undefined = await createMatchApiCall(address, stackedAmount);
        console.log(response);
        setMatchCreating(false);

        // if (response?.status) {
        //     router.push(`/match/${response.data.matchId}`)
        // }      
    }

    return (
        <>
            <input className='basic_input' type="number" placeholder="how much do you want to stake" />
            <button disabled={matchCreating} onClick={createMatch}>Create Match</button>

            <button className='basic_btn' onClick={() => setIsModelOpen(true)}>Create Match</button>

            <PopUpModel isOpen={isModelOpen} closeModal={() => setIsModelOpen(false)}>
                
            </PopUpModel>

        </>
    )
}

export default CreateMatch