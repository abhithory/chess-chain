"use client"
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MatchDataResponse } from '@/interface/matchInterface';
import { createMatchApiCall } from '@/apiCalls/matchApiCalls';
import { AxiosResponse } from 'axios';
import { useAddress } from "@thirdweb-dev/react";

import { FaChessQueen } from 'react-icons/fa'

import PopUpModel from "@/components/Model/PopUpModel";
import StyleButton1 from '../Buttons/StyleButton1';
import LoadingPrimaryBtn from '../Buttons/LoadingPrimaryBtn';
import { Web3ConnectionContext } from '@/smartContract/Web3ConnectionContext';
import { toast } from 'react-toastify';

function CreateMatch() {
    const router = useRouter();

    const { address, createMatch } = useContext(Web3ConnectionContext);

    const [stackedAmount, setStackedAmount] = useState(0);
    const [matchCreating, setMatchCreating] = useState(false);

    const [isModelOpen, setIsModelOpen] = useState(false);

    async function createMatchHandler() {
        if (!address || stackedAmount <= 0) return
        setMatchCreating(true);
        const response: AxiosResponse<MatchDataResponse> | undefined = await createMatchApiCall(address, stackedAmount);

        console.log(response);
        

        if (Number(response?.status) < 400 && response?.data?.data) {
            const _matchId = response?.data?.data?.matchId;
            const matchCreated = await createMatch(_matchId,stackedAmount);
            if (matchCreated) {
                router.push(`/match/${_matchId}`)
            } else {
                toast.error('Something Went wrong with web3 connection. Try Again')
                setMatchCreating(false);
            }
        } else {
            toast.error('Something Went wrong with backend. Try Again')
            setMatchCreating(false);
        }
    }

    return (
        <>
            <button className='basic_btn' onClick={() => setIsModelOpen(true)}>
                <FaChessQueen />Create Match
            </button>

            {/* <a href="#_" className="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-indigo-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300 ring-offset-indigo-200 hover:ring-offset-indigo-500 ease focus:outline-none">
                <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                <span className="relative z-20 flex items-center text-sm">
                    <svg className="relative w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Button Text
                </span>
            </a> */}



            <PopUpModel isOpen={isModelOpen} closeModal={() => setIsModelOpen(false)}>
                <div className="flex_center ">
                    <h1 className="text-4xl text-text-color font-bold mb-12">Create Match</h1>
                    <input className='basic_input' type="number" value={stackedAmount} onChange={(e) => setStackedAmount(Number(e.target.value))} placeholder="How much FTM do you want to stake?" />
                    <LoadingPrimaryBtn className='basic_btn_2 my-2' text='Create Match' loading={matchCreating} onClick={createMatchHandler} disabled={matchCreating}  />
                    <h3 className="text-md text-text-color">Winner will get: {2*stackedAmount} FTM</h3>

                </div>
            </PopUpModel>

        </>
    )
}

export default CreateMatch