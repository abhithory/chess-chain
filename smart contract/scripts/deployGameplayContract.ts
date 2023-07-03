import { ethers } from "hardhat";

// npx hardhat run scripts/deployGameplayContract.ts --network fantomMainnet
// npx hardhat verify --network fantomMainnet 0x067268F66B8312c2382C9055fa2615baDd124354
async function main() {

  const chessChainContract = await ethers.deployContract("ChessChainGameplay");
  await chessChainContract.waitForDeployment();

  // console.log(`chessChainContract deployed:`);
  // console.log(chessChainContract);
  
  console.log(`deployed to`);
  console.log(chessChainContract.target);
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
