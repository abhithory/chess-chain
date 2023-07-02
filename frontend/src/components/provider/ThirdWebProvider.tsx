"use client";
import {
    ThirdwebProvider,
    metamaskWallet,
    // walletConnect,
} from "@thirdweb-dev/react";

import { Ethereum, Polygon, Mumbai } from "@thirdweb-dev/chains";


function ThirdWebProvider({ children }: any) {
    return (
        <ThirdwebProvider
            supportedWallets={[metamaskWallet()]}
            activeChain="mumbai"
            supportedChains={[ Polygon, Mumbai]}
            dAppMeta={{
                name: "Chess Chain",
                description: "chess chain desss",
                logoUrl: "https://example.com/logo.png",
                url: "https://example.com",
                isDarkMode: true,
              }}
        >
            {children}
        </ThirdwebProvider>
    )
}

export default ThirdWebProvider