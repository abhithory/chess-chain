import { MatchResultEnum } from "@/smartContract/networkDetails";


export enum MatchResultStausEnum{
  "NOT"="NOT",
  "WON"="WON",
  "DRAW"="DRAW"
}

export interface MatchsDataResponse {
  data: MatchData[],
  sucess: boolean
}

export interface MatchDataResponse {
  data: MatchData,
  sucess: boolean
}



export interface MatchData {
  matchId: string;
  matchCreatorAddress: string;
  stackedAmount: number;
  matchJoinerAddress: string;
  matchWinnerAddress: string;
  matchResultStatus: MatchResultStausEnum;
  rewardClaimed: boolean;
  createdAt: Date;
}



  export interface MatchEndData {
    matchOver: boolean;
    isDraw:boolean;
    amIWinner: boolean;
    matchResult: MatchResultEnum;
  }