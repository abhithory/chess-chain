import { ethers } from "hardhat";

// npx hardhat verify --network fantomTestnet 0xcDc7c4f6649C6c3E3b99deD2BA2e8a3b2DEA07eE
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
