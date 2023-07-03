"use client"

import React from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";
import Image from 'next/image'

import { usePathname, useRouter } from 'next/navigation';
import { FaLandmark } from 'react-icons/fa';


function Navigation() {
  const  router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/match/")) {
    return <></>
  }
  return (
    <div className="glassmorphism-bg bg-secondary/30 w-full flex justify-between px-20 py-4">
      <span onClick={()=>router.push("/")} className=" cursor-pointer flex items-center justify-center gap-4">
        <Image
          src="/assests/logo.png"
          width={40}
          height={40}
          alt="Picture of the author"
        />
        <h1 className="text-2xl text-text-color ">Chess Chain</h1>
      </span>
      <span className="flex items-center justify-center gap-4">
        <h1 className="basic_btn_4" onClick={()=>router.push("/profile")}>
          <FaLandmark  className=''/>
          Profile
          </h1>
        <ConnectWallet />
      </span>
    </div>
  )
}

export default Navigation