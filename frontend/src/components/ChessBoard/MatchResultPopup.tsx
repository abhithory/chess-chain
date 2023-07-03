"use client";
import React, { useContext, useState } from 'react'
import LoadingPrimaryBtn from '../Buttons/LoadingPrimaryBtn'
import { useRouter } from 'next/navigation'
import { Web3ConnectionContext } from '@/smartContract/Web3ConnectionContext';
import { MatchResultEnum } from '@/smartContract/networkDetails';
import { MatchEndData } from '@/interface/matchInterface';



interface MatchResultPops {
    matchEndData: MatchEndData;
    matchId: string;
    stakeAmount: number;
}
function MatchResultPopup({ matchEndData, matchId, stakeAmount }: MatchResultPops) {
    const router = useRouter();
    const [transactionLoading, setTransactionLoading] = useState(false);

    const [rewardClaimed, setRewardClaimed] = useState(false);

    const { endMatch } = useContext(Web3ConnectionContext);

    const matchDataUri = "";
    const matchNFT = "";
    async function claimYourRewardHandler() {
        setTransactionLoading(true);
        const _matchEnded = await endMatch(matchId, matchDataUri, matchNFT, matchEndData.matchResult);
        if (_matchEnded) {
            setRewardClaimed(true);
            setTransactionLoading(true);
        } else {

        }
    }

    return (
        <div className="flex_center gap-2 text-text-color">

            <h1 className='text-3xl mb-4 font-bold'>Match Over</h1>
            <h2 className='text-2xl  font-semibold'>{matchEndData.isDraw ? "Match is Draw" : (matchEndData?.amIWinner ? "You are winner" : "You lost the Match")}</h2>
            {matchEndData?.amIWinner || matchEndData.isDraw &&

                <>
                    {rewardClaimed ?
                        <>
                            <h1 className="text-xl">Claimed Rewards Successfully!</h1>
                            <h1 className="text-lg">Check in Your Profile/Wallet</h1>
                        </>
                        :
                        <LoadingPrimaryBtn text='Claim Your Rewards' loading={transactionLoading} onClick={claimYourRewardHandler} disabled={transactionLoading} />
                    }
                    <p className="text-primary">{matchEndData.isDraw ? stakeAmount : 2 * stakeAmount} FTM Staked Reward {!matchEndData.isDraw && "+ Match Winning Nft"}</p>
                </>
            }
            <button className='basic_btn_3 mt-4' onClick={() => router.push("/")}>Play Again</button>
        </div>
    )
}

export default MatchResultPopup