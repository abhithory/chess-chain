// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ChessChainGameplay is
    Ownable,
    ERC721,
    ReentrancyGuard,
    ERC721URIStorage,
    ERC721Enumerable
{
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
        uint256 nftId;
        uint256 createTime;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(string => Match) public matchDetailOf;

    uint256 public WinnerStakeAmountTimes = 2;

    // TODO: Events for match created, started, ended

    event MatchCreated(
        string indexed matchId,
        address indexed matchCreator,
        uint256 stakeAmount
    );

    event MatchStarted(string indexed matchId, address indexed mathJoiner);
    event MatchEnded(string indexed matchId, address indexed matchCreator, address indexed matchJoiner,MatchResult gameResult, string matchDataURI);

    constructor() ERC721("ChessChainNFT", "CCN") {}

    function mintNft(address _matchWinner, string memory _tokenURI)
        private
        returns (uint256)
    {
        uint256 _total = totalSupply();
        uint256 nftId = _total + 1;
        _mint(_matchWinner, nftId);
        _setTokenURI(nftId, _tokenURI);
        return nftId;
    }

    function createMatch(
        string memory matchId,
        address matchCreator,
        uint256 stakeAmount
    ) external payable {
        require(
            matchDetailOf[matchId].matchStatus == MatchStatus.NOT_CREATED,
            "Already match created with this mathch id"
        );
        require(msg.value >= stakeAmount, "send full stake amount");

        matchDetailOf[matchId].matchStatus = MatchStatus.CREATED;
        matchDetailOf[matchId].matchId = matchId;
        matchDetailOf[matchId].matchCreator = matchCreator;
        matchDetailOf[matchId].stakeAmount = stakeAmount;
        matchDetailOf[matchId].createTime = block.timestamp;

        emit MatchCreated(matchId, matchCreator, stakeAmount);
    }

    function joinMatch(string memory matchId, address matchJoiner)
        external payable
    {
        require(
            matchDetailOf[matchId].matchStatus == MatchStatus.CREATED,
            "Invailid request for this matchId"
        );
        require(
            msg.value >= matchDetailOf[matchId].stakeAmount,
            "send full stake amount"
        );

        matchDetailOf[matchId].matchStatus = MatchStatus.STARTED;
        matchDetailOf[matchId].matchJoiner = matchJoiner;
        matchDetailOf[matchId].startTime = block.timestamp;
        emit MatchStarted(matchId, matchJoiner);

    }

    // TODO: connect with external api to check the game result || chainlink
    function endMatch(
        string memory matchId,
        string memory matchDataURI,
        string memory matchNftURI,
        MatchResult gameResult
    ) external {
        require(
            matchDetailOf[matchId].matchStatus == MatchStatus.STARTED,
            "Invailid request for this matchId"
        );
        require(
            msg.sender == matchDetailOf[matchId].matchCreator ||
                msg.sender == matchDetailOf[matchId].matchJoiner,
            "only match creator || joiner || admin"
        );

        matchDetailOf[matchId].matchStatus = MatchStatus.ENDED;
        matchDetailOf[matchId].gameResult = gameResult;
        matchDetailOf[matchId].matchDataURI = matchDataURI;
        matchDetailOf[matchId].endTime = block.timestamp;

        address winnerAddress = address(0);

        if (gameResult == MatchResult.DRAW) {
            transferAmount(
                matchDetailOf[matchId].matchCreator,
                matchDetailOf[matchId].stakeAmount
            );
            transferAmount(
                matchDetailOf[matchId].matchJoiner,
                matchDetailOf[matchId].stakeAmount
            );
        } else if (gameResult == MatchResult.MATCH_CREATOR) {
            winnerAddress = matchDetailOf[matchId].matchCreator;
        } else if (gameResult == MatchResult.MATCH_JOINER) {
            winnerAddress = matchDetailOf[matchId].matchJoiner;
        }

        if (winnerAddress != address(0)) {
            uint256 _nftId = mintNft(winnerAddress, matchNftURI);

            matchDetailOf[matchId].nftId = _nftId;

            transferAmount(
                winnerAddress,
                WinnerStakeAmountTimes * matchDetailOf[matchId].stakeAmount
            );
        }

        emit MatchEnded(matchId, matchDetailOf[matchId].matchCreator, matchDetailOf[matchId].matchJoiner, gameResult, matchDataURI);
    }


    function transferAmount(address _user, uint256 _amount)
        private
        nonReentrant
    {
        (bool success, ) = address(_user).call{value: _amount}("");
        require(success, "sending money failed");
    }

    // The following functions are overrides required by Solidity for nft contract.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
