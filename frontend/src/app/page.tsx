"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAddress } from "@thirdweb-dev/react";

import { ConnectWallet } from "@thirdweb-dev/react";
import CreateMatch from '@/components/Match/CreateMatch';
import JoinMatch from '@/components/Match/JoinMatch';



export default function Home() {
  const address = useAddress();





  return (
    <section className="page_section flex" >

      <div className="flex-1 flex_center text-text-color ">
        <h1 className="text-6xl font-bold primary_gradient">Welcome to Chess Chain</h1>
        <p className='text-center mb-4 mt-1'>Your Moves, Forever Captured. </p>
        <p className='w-[80%] text-center text-lg mb-8'>Play chess like never before in a blockchain-powered game. Stake tokens, battle global opponents, and have each Match immortalized as an NFT. Collect, trade, and showcase your unique moves. </p>

        {address ?
        <>
            <CreateMatch />
            <JoinMatch />
        </>
          :
          <>
            <ConnectWallet btnTitle="Connect Wallet To Play" theme="dark" className='px-8 py-4 text-lg'/>
          </>
        }
      </div>

      <div className="flex-1 flex_center ">
        <Image src="/assests/logo.png" width={600} height={600} alt="logo" />
      </div>

    </section>
  )
}
