import { MatchDataResponse, MatchResultStausEnum, MatchsDataResponse } from '@/interface/matchInterface';
import axios, { AxiosResponse } from 'axios';

export const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "api/v1"

export const getMatchDetailsApiCall = async (matchId:string) => {
    try {
        const response: AxiosResponse<MatchDataResponse> = await axios.get(`${apiBaseUrl}/match/${matchId}`);
        return response
    } catch (error) {
        console.log("createMatchApiCall",error);
    }
}

export const getMatchsByUserAddressApiCall = async (userAddress: string) => {
    try {
        const response: AxiosResponse<MatchsDataResponse> = await axios.get(`${apiBaseUrl}/match/usermatchs/${userAddress}`);
        return response
    } catch (error) {
        console.log("createMatchApiCall",error);
    }
}


export const createMatchApiCall = async (matchCreatorAddress: string, stackedAmount:number ) => {
    try {
        const response: AxiosResponse<MatchDataResponse> = await axios.post(`${apiBaseUrl}/match/create`,{
            matchCreatorAddress,
            stackedAmount
        });
        return response
    } catch (error) {
        console.log("createMatchApiCall",error);
    }
}


export const joinMatchApiCall = async (matchId:string,matchJoinerAddress: string ) => {
    try {
        const response: AxiosResponse<MatchDataResponse> = await axios.patch(`${apiBaseUrl}/match/joinmatch`,{
            matchId,
            matchJoinerAddress
        });
        return response
    } catch (error) {
        console.log("createMatchApiCall",error);
    }
}

export const setMatchWinnerApiCall = async (matchId:string,matchWinnerAddress: string,matchResultStatus: MatchResultStausEnum) => {
    try {
        const response: AxiosResponse<MatchDataResponse> = await axios.patch(`${apiBaseUrl}/match/setmatchwinner`,{
            matchId,
            matchWinnerAddress,
            matchResultStatus
        });
        return response
    } catch (error) {
        console.log("setmatchwinner",error);
    }
}


export const setRewardClaimedApiCall = async (matchId:string) => {
    try {
        const response: AxiosResponse<MatchDataResponse> = await axios.patch(`${apiBaseUrl}/match/rewardClaimed`,{
            matchId
        });
        return response
    } catch (error) {
        console.log("setRewardClaimedApiCall",error);
    }
}
