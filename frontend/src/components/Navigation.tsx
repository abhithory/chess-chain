"use client"

import React from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";
import Image from 'next/image'


function Navigation() {
  return (
    <div className="glassmorphism-bg bg-secondary/30 w-full flex justify-between px-20 py-4">
    <span className="flex items-center justify-center gap-4">
    <Image
      src="/assests/logo.png"
      width={40}
      height={40}
      alt="Picture of the author"
      />
      <h1 className="text-2xl text-text-color ">Chess Chain</h1>
      </span>

      <ConnectWallet />
    </div>
  )
}

export default Navigation