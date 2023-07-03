
export interface ChessGameDetailsInterface {
    matchId: string,
    isMatchCreator: boolean,
    boardOrientation: "white" | "black";
    myAddress: string;
    opponentAddress: string;
    stakeAmount: number;
}