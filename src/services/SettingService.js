import {get, patch} from "../utils/api";

const API_URL = process.env.REACT_APP_API_URL;

const GetSetting = async () => get(`${API_URL}/setting`);

const UpdateSetting = async (id, params) => patch(`${API_URL}/setting/${id}`, params);

export const SettingService = {
    GetSetting,
    UpdateSetting
};
