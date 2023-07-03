"use client"
import Image from 'next/image'
import { useAddress } from "@thirdweb-dev/react";

import { ConnectWallet } from "@thirdweb-dev/react";



export default function Home() {
  const address = useAddress();





  return (
    <section className="page_section flex" >

      <div className="flex-1 flex_center text-text-color ">
        <h1 className="text-6xl font-bold primary_gradient">Marketplace</h1>
        <p className='w-[80%] text-center text-lg mb-8'>Sell and buy nfts</p>

        {address ?
        <div className='flex flex-col gap-4 '>
            <h1>Cooming Soon...</h1>
        </div>
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
