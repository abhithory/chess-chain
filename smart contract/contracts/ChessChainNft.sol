// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract GameNFT is ERC721URIStorage, Ownable {
  uint256 totalNftMinted;
  address public gamePlayContract;
    

  constructor(address _gameplayAddress)
    ERC721("ChessChainNFT", "CCN")
  {
    gamePlayContract = _gameplayAddress;
  }

  function mintNft(address _matchWinner,string memory tokenURI) external returns (uint256) {
    require(msg.sender == gamePlayContract, "only gameplay contract can mint");
    uint256 nftId = totalNftMinted + 1;

    _mint(_matchWinner, nftId);
    _setTokenURI(nftId, tokenURI);

    return nftId;
  }

  function changeGamePlayContract(address _gameplayAddress) public{
        gamePlayContract = _gameplayAddress;
  }
}
