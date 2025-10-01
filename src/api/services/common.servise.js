import { useState } from "react";
import { apiService } from "../Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { buildUrl, errorMsg } from "../../utils/customFn";

const useCommonServices = () => {

    const counryList = async () => {
        try {
            const url = buildUrl(API_ENDPOINTS?.get_countries);
            return await apiService.get(url);
        } catch (error) {
            errorMsg(error);
            return null;
        }
    };
    const CheckTeamRegistered = async (params = {}) => {
        try {
            const url = buildUrl(API_ENDPOINTS?.check_team_registred, params);
            return await apiService.get(url);
        } catch (error) {
            errorMsg(error);
            return null;
        }
    };
    const FetchLoaylityPoints = async (params = {}) => {
        try {
            const url = buildUrl(API_ENDPOINTS?.get_loyality, params);
            return await apiService.get(url);
        } catch (error) {
            errorMsg(error);
            return null;
        }
    };
       const FetchNotifications = async (params = {}) => {
        try {
            const url = buildUrl(API_ENDPOINTS?.get_notifications, params);
            return await apiService.get(url);
        } catch (error) {
            errorMsg(error);
            return null;
        }
    };

    return {
        counryList,
        CheckTeamRegistered,
        FetchLoaylityPoints,
        FetchNotifications
    };
};

export default useCommonServices;
