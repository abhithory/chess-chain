import { ethers } from "hardhat";

// npx hardhat verify --network polygon 0x00e36A2C56770b42FD32f7dF77c7325B38861260
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
