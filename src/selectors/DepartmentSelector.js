import {createSelector} from "@reduxjs/toolkit";

const departmentSelector = (state) => state.department;

const getDepartments = () => createSelector(
    departmentSelector,
    department => department.departments
);

const getPagination = () => createSelector(
    departmentSelector,
    department => department.pagination
);

const getDepartmentById = () => createSelector(
    departmentSelector,
    department => department.department
);

const submitDepartment = () => createSelector(
    departmentSelector,
    department => {
        if (department.submit.success) {
            return {
                success: true,
                message: department.submit.success
            }
        }

        return {
            success: false,
            message: department.submit.error
        }
    }
)

const deleteDepartment = () => createSelector(
    departmentSelector,
    department => {
        if (department.delete.success) {
            return {
                success: true,
                message: department.delete.success
            }
        }

        return {
            success: false,
            message: department.delete.error
        }
    }
)

export const DepartmentSelector = {
    getDepartments,
    getPagination,
    getDepartmentById,
    submitDepartment,
    deleteDepartment
}