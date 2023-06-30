
export interface ChessGameInterface {
    boardOrientation: "white" | "black";
    socket:  any;
    userSocketId: string;
    opponentSocketId: string;
}