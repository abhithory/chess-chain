"use client";
import React, { useContext, useState } from 'react'
import LoadingPrimaryBtn from '../Buttons/LoadingPrimaryBtn'
import { useRouter } from 'next/navigation'
import { Web3ConnectionContext } from '@/smartContract/Web3ConnectionContext';
import { MatchResultEnum } from '@/smartContract/networkDetails';
import { MatchEndData } from '@/interface/matchInterface';

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { toast } from 'react-toastify';



interface MatchResultPops {
    matchEndData: MatchEndData;
    matchId: string;
    stakeAmount: number;
    chessBoardDivRef: any;
    pgn?:any;
    movesHistory?:any;
}
function MatchResultPopup({ matchEndData, matchId, stakeAmount, chessBoardDivRef,pgn,movesHistory }: MatchResultPops) {
    const router = useRouter();
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [rewardClaimed, setRewardClaimed] = useState(false);
    const { endMatch, storage } = useContext(Web3ConnectionContext);

    const [nftImage, setNftImage] = useState("");

    async function createImageMetadata() {
        if (!chessBoardDivRef.current) return
        const _imageUrl = await toPng(chessBoardDivRef.current, { quality:.4, backgroundColor:"#A020F0" });
        setNftImage(_imageUrl)

        console.log("creating nft metadata");
        
        const urii = await storage.upload({
            "name": "ChessChain Match Winner NFT",
            "description": "This nft minted by ChessChain when user won the match",
            pgn,
            movesHistory,
            matchId,
            "image": _imageUrl,
        });        
        return urii
    }

    async function createMatchDataURI(){ 
        const urii = await storage.upload({
            matchId,
            pgn,
            movesHistory
        });
        return urii
    }
    async function claimYourRewardHandler() {
        setTransactionLoading(true);

        const nftMetaDataURI = await createImageMetadata();
        // const matchDataURI = await createMatchDataURI();
        const _matchEnded = await endMatch(matchId, nftMetaDataURI, nftMetaDataURI, matchEndData.matchResult);
        if (_matchEnded) {
            setRewardClaimed(true);
        } else {
            toast.error('Something Went wrong. Try Again')
        }
        setTransactionLoading(false);
    }

    console.log(matchEndData);
    

    return (
        <div className="flex_center gap-2 text-text-color">

            <h1 className='text-3xl mb-4 font-bold'>Match Over</h1>
            <h2 className='text-2xl  font-semibold'>{matchEndData.isDraw ? "Match is Draw" : (matchEndData?.amIWinner ? "You are winner" : "You lost the Match")}</h2>
            {(matchEndData?.amIWinner || matchEndData.isDraw )&&

                <>
                    {rewardClaimed ?
                        <>
                            <h1 className="text-2xl">Claimed Rewards Successfully!</h1>
                            <h1 className="text-md">Check in Your Profile/Wallet</h1>
                        </>
                        :
                        <LoadingPrimaryBtn text='Claim Your Rewards' loading={transactionLoading} onClick={claimYourRewardHandler} disabled={transactionLoading} />
                    }
                    <p className=" text-sm">{matchEndData.isDraw ? stakeAmount : 2 * stakeAmount} FTM Staked Reward {!matchEndData.isDraw && "+ Match Winning Nft"}</p>
                    {nftImage&& 
                    <>
                    <img src={nftImage} alt="nft image" width={400} className="rounded-lg" />
                    <h3 className="text-lg">{transactionLoading ? "Please Wait. Claming Reward" :"Your NFT"}</h3>
                    </>
                    }
                </>
            }

            <button className='basic_btn_3 mt-4' onClick={() => router.push("/")}>Play Again</button>        
        </div>
    )
}

export default MatchResultPopup