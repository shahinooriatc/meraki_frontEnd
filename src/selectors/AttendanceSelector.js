import {createSelector} from "@reduxjs/toolkit";

const attendanceSelector = (state) => state.attendance;

const getAttendances = () => createSelector(
    attendanceSelector,
    attendance => attendance.attendances
);

const getPagination = () => createSelector(
    attendanceSelector,
    attendance => attendance.pagination
);

const getAttendanceById = () => createSelector(
    attendanceSelector,
    attendance => attendance.attendance
);

export const AttendanceSelector = {
    getAttendances,
    getPagination,
    getAttendanceById
}