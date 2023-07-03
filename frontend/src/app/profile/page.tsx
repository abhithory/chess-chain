"use client"
import Image from 'next/image'
import { useAddress } from "@thirdweb-dev/react";

import { ConnectWallet } from "@thirdweb-dev/react";
import ProfileDetails from '@/components/Profile/ProfileDetails';



export default function Home() {
  return (
    <section className="page_section" >
      <div className="flex h-full mt-20">

        <div className="flex-1 flex_center text-text-color ">
          <h1 className="text-7xl font-bold primary_gradient">Your Profile</h1>
          <p className='w-[80%] text-center text-lg mb-8'>Check all Your Matchs and NFTs Details</p>         
        </div>

        <div className="flex-1 flex_center ">
          <Image src="/assests/marketplace2.svg" width={400} height={400} alt="logo" />
        </div>
      </div>

      <ProfileDetails />

    </section>
  )
}
