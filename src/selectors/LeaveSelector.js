import {createSelector} from "@reduxjs/toolkit";

const leaveSelector = (state) => state.leave;

const getLeaves = () => createSelector(
    leaveSelector,
    leave => leave.leaves
);

const getPagination = () => createSelector(
    leaveSelector,
    leave => leave.pagination
);

const getLeaveById = () => createSelector(
    leaveSelector,
    leave => leave.leave
);

const countLeave = () => createSelector(
    leaveSelector,
    leave => leave.leaves?.length ?? 0
);

export const LeaveSelector = {
    getLeaves,
    getPagination,
    getLeaveById,
    countLeave
}