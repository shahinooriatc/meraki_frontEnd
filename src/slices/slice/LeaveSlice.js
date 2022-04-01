import { createSlice } from "@reduxjs/toolkit";

export const LeaveSlice = createSlice({
    name: "Leave",
    initialState: {
        leaves: [],
        pagination: {},

        leave: {},
    },
    reducers: {
        getLeaves: () => {},
        getLeavesSuccess: (state, action) => {
            state.leave = {};
            state.leaves = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        getLeaveById: () => {},
        getLeaveByIdSuccess: (state, action) => {
            state.leave = action.payload
        },
        createLeave: () => {},
        updateLeave: () => {},
        deleteLeave: () => {},
    }
});

export default LeaveSlice;