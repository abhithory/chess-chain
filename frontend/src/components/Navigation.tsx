"use client"

import React from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";


function Navigation() {
  return (
    <div className="w-screen flex_center">
      <ConnectWallet />
    </div>
  )
}

export default Navigation