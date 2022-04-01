import {createSelector} from "@reduxjs/toolkit";

const authSelector = (state) => state.auth;

const getLogin = createSelector(
    authSelector,
    auth => auth
);

export const AuthSelector = {
    getLogin
};