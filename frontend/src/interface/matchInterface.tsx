
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