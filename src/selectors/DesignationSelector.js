import {createSelector} from "@reduxjs/toolkit";

const designationSelector = (state) => state.designation;

const getDesignations = () => createSelector(
    designationSelector,
    designation => designation.designations
);

const getPagination = () => createSelector(
    designationSelector,
    designation => designation.pagination
);

const getDesignationById = () => createSelector(
    designationSelector,
    designation => designation.designation
);

const submitDesignation = () => createSelector(
    designationSelector,
    designation => {
        if (designation.submit.success) {
            return {
                success: true,
                message: designation.submit.success
            }
        }

        return {
            success: false,
            message: designation.submit.error
        }
    }
)

const deleteDesignation = () => createSelector(
    designationSelector,
    designation => {
        if (designation.delete.success) {
            return {
                success: true,
                message: designation.delete.success
            }
        }

        return {
            success: false,
            message: designation.delete.error
        }
    }
)

export const DesignationSelector = {
    getDesignations,
    getPagination,
    getDesignationById,
    submitDesignation,
    deleteDesignation
}