import { MatchResultEnum } from "@/smartContract/networkDetails";


export enum MatchResultStausEnum{
  "NOT"="NOT",
  "WON"="WON",
  "DRAW"="DRAW"
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
    createdAt: Date;
  }

  export interface MatchEndData {
    matchOver: boolean;
    isDraw:boolean;
    amIWinner: boolean;
    matchResult: MatchResultEnum;
  }