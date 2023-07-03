import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config({ path: __dirname + '/.env' })

const ftmscanKey = process.env.FTMSCAN_API_KEY || "";
const testnetkey = process.env.FTM_TESTNET_WALLET_KEY || "";

const mainnetkey = process.env.FTM_MAINNET_WALLET_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks:{
    ganache:{
      url:"http://127.0.0.1:8545",
      accounts: ["0x24cce63cbf7a0eb251e6357f44d118b61153ed5c69f67782f783e89455b0649f"]
    },
    fantomTestnet: {
      // 0xfa2
      url:"https://rpc.testnet.fantom.network/",
      accounts:[testnetkey]
    },
    fantomMainnet: {
      // 250
      url:"https://rpc.ankr.com/fantom/",
      accounts:[mainnetkey]
    }
  },
  etherscan:{
    apiKey: {
      ftmTestnet:ftmscanKey,      
      fantomMainnet:ftmscanKey      
    }
}
};

export default config;
