import { MatchData, MatchResultStausEnum } from '@/interface/matchInterface'
import React from 'react'

function MatchsDetails({ matchsDetails, userAddress }: { matchsDetails: MatchData[], userAddress:string,loadingMatchs?:boolean }) {

    function formatData(date:any){
        const _dateObj = new Date(date)
        return _dateObj.toDateString()
    }

    function getMatchStatus(status: MatchResultStausEnum, winnerAddress: string) {
        if (status === MatchResultStausEnum.DRAW) {
            return "Draw";
        }

        if (status === MatchResultStausEnum.WON) {
            if (userAddress === winnerAddress) {
                return "YOU WON";
            } else {
                return "YOU LOST";
            }
        }

        if (status === MatchResultStausEnum.NOT) {
            return "NOT FINISHED";
        }
    }
    return (
            <table className="table-auto w-full text-center">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>MathId</th>
                        <th>Opponent Address</th>
                        <th>Staked FTM</th>
                        <th>Match Result</th>
                        <th>Reward Claimed</th>
                    </tr>
                </thead>
                <tbody>
                    {matchsDetails && matchsDetails.map((match, key) => {
                        return (
                            <tr key={key}>
                                <td>{formatData(match.createdAt)}</td>
                                <td>{match.matchId}</td>
                                <td>{match.matchCreatorAddress === userAddress? match.matchJoinerAddress : match.matchCreatorAddress}</td>
                                <td>{match.stackedAmount}</td>
                                <td>{getMatchStatus(match.matchResultStatus,match.matchWinnerAddress)}</td>
                                <td>{match.rewardClaimed ? "Claimed" :"Not Claimed"}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
    )
}

export default MatchsDetails