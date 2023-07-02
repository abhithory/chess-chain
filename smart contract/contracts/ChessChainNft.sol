// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract GameNFT is ERC721URIStorage {
    address public gamePlayContract;
  constructor(address _gameplayAddress)
    ERC721("ChessChainNFT", "CCN")
  {
    gamePlayContract = _gameplayAddress;
  }

  function mintNft(address _matchWinner,string memory tokenURI) public returns (uint256) {
    require(msg.sender == gamePlayContract, "only gameplay contract can mint");
    uint256 _totalSupply = totalSupply();
    uint256 nftId = _totalSupply + 1;

    _mint(_matchWinner, nftId);
    _setTokenURI(nftId, tokenURI);

    return newItemId;
  }
}
