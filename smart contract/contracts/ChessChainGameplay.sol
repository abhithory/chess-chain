// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ChessChainGameplay is Ownable,ERC721, ReentrancyGuard, ERC721URIStorage, ERC721Enumerable {
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

    mapping(string => Match) public matchOf;

    uint256 public WinnerStakeAmountTimes = 2;
    uint256 public totalNftMinted;

    // TODO: Events for match created, started, ended

    constructor() ERC721("ChessChainNFT", "CCN") {}

    function mintNft(
        address _matchWinner,
        string memory _tokenURI
    ) private returns (uint256) {
        totalNftMinted++;
        uint256 nftId = totalNftMinted;
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
        string memory matchNftURI,
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

        address winnerAddress = address(0);

        if (gameResult == MatchResult.DRAW) {
            transferAmount(
                matchOf[matchId].matchCreator,
                matchOf[matchId].stakeAmount
            );
            transferAmount(
                matchOf[matchId].matchJoiner,
                matchOf[matchId].stakeAmount
            );
        } else if (gameResult == MatchResult.MATCH_CREATOR) {
            winnerAddress = matchOf[matchId].matchCreator;
        } else if (gameResult == MatchResult.MATCH_JOINER) {
            winnerAddress = matchOf[matchId].matchJoiner;
        }

        if (winnerAddress != address(0)) {
            uint256 _nftId = mintNft(winnerAddress, matchNftURI);

            matchOf[matchId].nftId = _nftId;

            transferAmount(
                winnerAddress,
                WinnerStakeAmountTimes * matchOf[matchId].stakeAmount
            );
        }
    }

    function transferAmount(
        address _user,
        uint256 _amount
    ) private nonReentrant {
        (bool success, ) = address(_user).call{value: _amount}("");
        require(success, "sending money failed");
    }


    // The following functions are overrides required by Solidity for nft contract.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
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
