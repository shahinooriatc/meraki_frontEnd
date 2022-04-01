import { createSlice } from "@reduxjs/toolkit";

export const SettingSlice = createSlice({
    name: "setting",
    initialState: {
        setting: {}
    },
    reducers: {
        getSetting: () => {},
        getSettingSuccess: (state, action) => {
            state.setting = action.payload;
        },
        updateSetting: () => {}
    }
});

export default SettingSlice;