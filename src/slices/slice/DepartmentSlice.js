import { createSlice } from "@reduxjs/toolkit";

export const DepartmentSlice = createSlice({
    name: "department",
    initialState: {
        departments: [],
        pagination: {},

        department: {},
    },
    reducers: {
        getDepartments: () => {},
        getDepartmentsSuccess: (state, action) => {
            state.department = {};
            state.departments = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        getDepartmentById: () => {},
        getDepartmentByIdSuccess: (state, action) => {
            state.department = action.payload
        },
        createDepartment: () => {},
        updateDepartment: () => {},
        deleteDepartment: () => {},
    }
});

export default DepartmentSlice;