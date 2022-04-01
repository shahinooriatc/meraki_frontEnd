import { createSlice } from "@reduxjs/toolkit";

export const DesignationSlice = createSlice({
    name: "Designation",
    initialState: {
        designations: [],
        pagination: {},

        designation: {},
    },
    reducers: {
        getDesignations: () => {},
        getDesignationsSuccess: (state, action) => {
            state.designation = {};
            state.designations = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        getDesignationById: () => {},
        getDesignationByIdSuccess: (state, action) => {
            state.designation = action.payload
        },
        createDesignation: () => {},
        updateDesignation: () => {},
        deleteDesignation: () => {},
    }
});

export default DesignationSlice;