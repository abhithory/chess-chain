import { MatchDataResponse } from '@/interface/matchInterface';
import axios, { AxiosResponse } from 'axios';

export const apiBaseUrl = "http://localhost:3001/api/v1"

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

export const getMatchDetailsApiCall = async (matchId) => {
    try {
        const response: AxiosResponse<MatchDataResponse> = await axios.get(`${apiBaseUrl}/match/${matchId}`);
        return response
    } catch (error) {
        console.log("createMatchApiCall",error);
    }
}