import {createSelector} from "@reduxjs/toolkit";

const settingSelector = (state) => state.setting;

const getSetting = () => createSelector(
    settingSelector,
    setting => setting.setting
);

export const SettingSelector = {
    getSetting
}