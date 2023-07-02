// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

interface ChessChainNftContract {
    function mintNft(
        address _matchWinner,
        string memory tokenURI
    ) external returns (uint256);
}

contract ChessChainGameplay is Ownable {
    enum MatchResult {
        MATCH_CREATOR,
        MATCH_JOINER,
        DRAW
    }
    enum MatchStatus {
        NOT_CREATED,
        CREATED,
        STARTED,
        ENDED
    }

    struct Match {
        MatchStatus matchStatus;
        string matchId;
        address matchCreator;
        address matchJoiner;
        uint256 stakeAmount;
        MatchResult gameResult;
        string matchDataURI;
        uint256 createTime;
        uint256 startTime;
        uint256 endTime;
    }
    mapping(string => Match) public matchOf;
    ChessChainNftContract chessChainNftContract;


    // TODO: Events for match created, started, ended


    constructor (ChessChainNftContract _chessChainNftContract)  {
        chessChainNftContract = _chessChainNftContract;
    }

    function createMatch(
        string memory matchId,
        address matchCreator,
        uint256 stakeAmount
    ) external payable {
        require(
            matchOf[matchId].matchStatus == MatchStatus.NOT_CREATED,
            "Already match created with this mathch id"
        );
        require(msg.value >= stakeAmount, "send full stake amount");

        matchOf[matchId].matchStatus = MatchStatus.CREATED;
        matchOf[matchId].matchId = matchId;
        matchOf[matchId].matchCreator = matchCreator;
        matchOf[matchId].stakeAmount = stakeAmount;
        matchOf[matchId].createTime = block.timestamp;
    }

    function joinMatch(
        string memory matchId,
        address matchJoiner
    ) external payable {
        require(
            matchOf[matchId].matchStatus == MatchStatus.CREATED,
            "Invailid request for this matchId"
        );
        require(
            msg.value >= matchOf[matchId].stakeAmount,
            "send full stake amount"
        );

        matchOf[matchId].matchStatus = MatchStatus.STARTED;
        matchOf[matchId].matchJoiner = matchJoiner;
        matchOf[matchId].startTime = block.timestamp;
    }

    // TODO: connect with external api to check the game result || chainlink
    function endMatch(
        string memory matchId,
        string memory matchDataURI,
        MatchResult gameResult
    ) external payable {
        require(
            matchOf[matchId].matchStatus == MatchStatus.STARTED,
            "Invailid request for this matchId"
        );
        require(
            msg.sender == matchOf[matchId].matchCreator ||
                msg.sender == matchOf[matchId].matchJoiner,
            "only match creator || joiner || admin"
        );

        matchOf[matchId].matchStatus = MatchStatus.ENDED;
        matchOf[matchId].gameResult = gameResult;
        matchOf[matchId].matchDataURI = matchDataURI;
        matchOf[matchId].endTime = block.timestamp;
    }

    function changeNftContractAddress(ChessChainNftContract _chessChainNftContract) public onlyOwner {
        chessChainNftContract = _chessChainNftContract;   
    }
}
