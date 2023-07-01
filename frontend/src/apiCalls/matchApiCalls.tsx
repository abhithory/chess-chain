import { MatchData } from '@/interface/matchInterface';
import axios, { AxiosResponse } from 'axios';

export const apiBaseUrl = "http://localhost:3000/api/v1"

export const createMatchApiCall = async (matchCreatorAddress: string, stackedAmount:number ) => {
    try {
        const response: AxiosResponse<MatchData> = await axios.post(`${apiBaseUrl}/match/create`,{
            matchCreatorAddress,
            stackedAmount
        });
        return response
    } catch (error) {
        console.log("createMatchApiCall",error);
    }
}