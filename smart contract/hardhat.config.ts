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
      accounts: ["0x423b1caeb1b7c22de38a9211c01862ff2a58ce298d7c2717e157591244cde04f"]
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
      opera:ftmscanKey      
    }
}
};

export default config;
