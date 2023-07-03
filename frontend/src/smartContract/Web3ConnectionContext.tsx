import React, { createContext, useMemo, useState } from 'react';
import {
    useAddress, useSDK, useStorage
} from '@thirdweb-dev/react';
import { ChessChainGameplayContract, MatchResultEnum } from '@/smartContract/networkDetails';
import ChessChainGameplay from '@/smartContract/ChessChainGameplay.json';
import { ethers } from 'ethers';

interface ContextProps {
    address: string | undefined,
    sdk: any,
    storage: any,
    createMatch: (matchId: string, stakeAmount: number) => Promise<boolean>,
    joinMatch: (matchId: string, stakeAmount: number) => Promise<boolean>,
    endMatch: (matchId: string, matchDataURI: string, matchNftURI: string, gameResult: MatchResultEnum) => Promise<boolean>,
    getMatchDetailOf: (matchId: string) => any
}

export const Web3ConnectionContext = createContext<ContextProps>({
    address: '',
    sdk: '',
    storage: '',
    createMatch: async (matchId: string, stakeAmount: number) => false,
    joinMatch: async (matchId: string, stakeAmount: number) => false,
    endMatch: async (matchId: string, matchDataURI: string, matchNftURI: string, gameResult: MatchResultEnum) => false,
    getMatchDetailOf: (matchId: string) => { }
});

const Web3ConnectionWrapper = ({ children }: any) => {
    const address = useAddress();
    const storage = useStorage();
    const sdk = useSDK();

    async function getContract() {
        const OrchidzBuildCreatorContract = await sdk?.getContract(
            ChessChainGameplayContract,
            ChessChainGameplay.abi
        );
        return OrchidzBuildCreatorContract;
    }

    // async function getNftMetaData(nftId: number) {
    //     try {
    //         const OrchidzBuildCreatorContract = await getContract();
    //         const tx = await OrchidzBuildCreatorContract?.call(
    //             'nftDetailOf', // Name of your function as it is on the smart contract
    //             [
    //                 nftId
    //             ]
    //         );
    //         const durii = await storage?.download(tx.uri);
    //         // const metadataReq = await fetch(durii.url);
    //         // const metadata = await metadataReq.json();
    //         // const _imgurl = await storage.download(metadata.image);
    //         // return {
    //         //     ...metadata,
    //         //     price: Number(Number(tx.mintPrice) / 10 ** 18),
    //         //     image: _imgurl.url
    //         // };
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async function getUserNftBalance(nftId: number) {
    //     try {
    //         const OrchidzBuildCreatorContract = await getContract();
    //         const tx = await OrchidzBuildCreatorContract?.call(
    //             'balanceOf', // Name of your function as it is on the smart contract
    //             [
    //                 address,
    //                 nftId
    //             ]
    //         );
    //         return tx
    //     } catch (error) {
    //         console.log("balanceOf error", error);
    //     }
    // }

    async function createMatch(matchId: string, stakeAmount: number): Promise<boolean> {
        try {
            const _contract = await getContract();
            const tx = await _contract?.call(
                'createMatch', // Name of your function as it is on the smart contract
                [
                    matchId,
                    address,
                    ethers.utils.parseUnits(String(stakeAmount), "ether")
                ],
                {
                    value: ethers.utils.parseUnits(String(stakeAmount), "ether")
                }
            );
            console.log("createMatch", tx);
            return true;
        } catch (error) {
            console.log("createMatch error", error);
            return false
        }
    }
    async function joinMatch(matchId: string, stakeAmount: number): Promise<boolean> {
        try {
            const _contract = await getContract();
            const tx = await _contract?.call(
                'joinMatch',
                [
                    matchId,
                    address
                ],
                {
                    value: ethers.utils.parseUnits(String(stakeAmount), "ether")
                }
            );
            console.log("joinMatch", tx);
            return true;
        } catch (error) {
            console.log("joinMatch error", error);
            return false
        }
    }

    async function endMatch(matchId: string, matchDataURI: string, matchNftURI: string, gameResult: MatchResultEnum): Promise<boolean> {
        try {
            const _contract = await getContract();
            const tx = await _contract?.call(
                'endMatch',
                [
                    matchId,
                    matchDataURI,
                    matchNftURI,
                    gameResult
                ]
            );
            console.log("endMatch", tx);
            return true;
        } catch (error) {
            console.log("endMatch error", error);
            return false
        }
    }
    async function getMatchDetailOf(matchId: string): Promise<any> {
        try {
            const _contract = await getContract();
            const tx = await _contract?.call(
                'matchDetailOf',
                [
                    matchId
                ]
            );
            console.log("getMatchDetailOf", tx);
            return true;
        } catch (error) {
            console.log("getMatchDetailOf error", error);
            return false
        }
    }

    return (
        <Web3ConnectionContext.Provider value={{
            address, sdk, storage, createMatch, joinMatch, endMatch, getMatchDetailOf
        }}
        >
            {children}
        </Web3ConnectionContext.Provider>
    );
};

export default Web3ConnectionWrapper;
