import { createSlice } from "@reduxjs/toolkit";

export const GeneralSlice = createSlice({
    name: "auth",
    initialState: {
        loader: [],
        errors: [],
        success: [],
    },
    reducers: {
        startLoading: (state, { payload }) => {
            state.loader = [
                ...state.loader,
                payload
            ];
        },
        stopLoading: (state, action) => {
            state.loader = state.loader.filter(item => item !== action.payload);
        },
        addError: (state, action) => {
            state.errors = [...state.errors, action.payload];
        },
        removeError: (state, action) => {
            state.errors = state.errors.filter(item => item.action !== action.payload);
        },
        addSuccess: (state, action) => {
            const index = state.success.findIndex(item => item.action === action.payload.action);

            if (index !== -1) {
                state.success[index] = action.payload;
            } else {
                state.success = [...state.success, action.payload];
            }
        },
        removeSuccess: (state, action) => {
            state.success = state.success.filter(item => !action.payload.includes(item.action));
        }
    }
});

export default GeneralSlice;