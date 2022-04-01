import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        success: null,
        loading: false,
        error: null,
    },
    reducers: {
        login: () => {},
        loginSuccess: (state, action) => {
            state.success = action.payload;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
        },
        logout: () => {}
    }
});

export default AuthSlice;