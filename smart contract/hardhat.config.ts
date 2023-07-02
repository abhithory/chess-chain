import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks:{
    ganache:{
      url:"http://127.0.0.1:8545",
      accounts: ["0x6cd5febc5def1a11e29025c4e9ed738b3f6f28a362acc4f7353661499ed0a698"]
    },
    fantomTestnet: {
      // 0xfa2
      url:"https://rpc.testnet.fantom.network/",
      accounts:["bf00aa4f56758a961097a351d604c37b0885d734d75805fd19339801dcb62eab"]
    },
    fantomMainnet: {
      // 250
      url:"https://rpc.ankr.com/fantom/",
      accounts:["bf00aa4f56758a961097a351d604c37b0885d734d75805fd19339801dcb62eab"]
    }
  }
};

export default config;
