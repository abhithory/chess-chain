"use client";
import { Fragment, useContext, useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import MatchsDetails from './MatchsDetails'
import NftsDetails from './NftsDetails'
import { MatchData } from '@/interface/matchInterface';
import { getMatchsByUserAddressApiCall } from '@/apiCalls/matchApiCalls';
import { Web3ConnectionContext } from '@/smartContract/Web3ConnectionContext';
import SimpleLoader from '../loader/loader';
import { ConnectWallet } from '@thirdweb-dev/react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}


function ProfileDetails() {

  const { address, getUserNftBalance } = useContext(Web3ConnectionContext);
  const [nftBalance, setNftBalance] = useState(0);
  const [matchsDetails, setMatchsDetails] = useState<MatchData[]>([]);

  const [loadingMatchs, setLoadingMatchs] = useState(true);
  const [loadingNfts, setLoadingNfts] = useState(true);

  async function loadAllMatchsDetails() {
    if (!address) return
    setLoadingMatchs(true);
    const response = await getMatchsByUserAddressApiCall(address);
    setLoadingMatchs(false);

    console.log(response);
    if (response?.data.data) {
      setMatchsDetails(response?.data.data)
    }
  }

  useEffect(() => {
    async function loadNftBalance() {
      setLoadingNfts(true);
      const _balance = await getUserNftBalance();
      setNftBalance(Number(_balance));
      setLoadingNfts(false);
    }

    if (address) {
      loadNftBalance()
      loadAllMatchsDetails()

    }
  }, [address])




  return (
    <div className='w-full flex_center mt-12'>

      <Tab.Group>
        <div className="max-w-md w-full">
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-500/20  p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-pink-700',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-pink-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Matchs Details
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-pink-700',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-pink-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Nfts Details
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <div className="w-[80vw] px-6 py-4 rounded-xl glassmorphism-box text-white flex_center">
              {address ?
                (loadingNfts ?
                  <SimpleLoader className='w-12 my-8' />
                  :
                  <MatchsDetails matchsDetails={matchsDetails} userAddress={address ? address : ""} />
                )
                :
                <ConnectWallet btnTitle="Connect Wallet To See Profile" theme="dark" className='px-8 py-4 text-lg' />
              }
            </div>
          </Tab.Panel>


          <Tab.Panel>
            <div className="w-[80vw] px-6 py-4 rounded-xl glassmorphism-box text-white flex_center">
              {address ?
                (loadingNfts ?
                  <SimpleLoader className='w-12 my-8' />
                  :
                  <NftsDetails nftBalance={nftBalance} />
                )
                :
                <ConnectWallet btnTitle="Connect Wallet To See Profile" theme="dark" className='px-8 py-4 text-lg' />
              }
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default ProfileDetails