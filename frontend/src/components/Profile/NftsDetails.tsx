import {Web3ConnectionContext} from '@/smartContract/Web3ConnectionContext';
import React from 'react'

function NftsDetails({nftBalance}:{nftBalance: number, loadingNfts?:boolean}) {
  
  return (
      <div className="flex_center">
        <h1>Your Have {nftBalance} NFTs</h1>
      </div>
  )
}

export default NftsDetails