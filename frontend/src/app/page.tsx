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
    <section className="page_section flex_center  gap-5">
      <h1>Welcome to chess chain</h1>

      {address ?
        <div className="border p-4 flex_center gap-4">
          <CreateMatch />
          <JoinMatch />
        </div>
        :
        <ConnectWallet />
      }

    </section>
  )
}
