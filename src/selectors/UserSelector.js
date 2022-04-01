import {createSelector} from "@reduxjs/toolkit";

const userSelector = (state) => state.user;

const getUsers = () => createSelector(
    userSelector,
    user => user.users
);

const getPagination = () => createSelector(
    userSelector,
    user => user.pagination
);

const getUserById = () => createSelector(
    userSelector,
    user => user.user
);

const submitUser = () => createSelector(
    userSelector,
    user => {
        if (user.submit.success) {
            return {
                success: true,
                message: user.submit.success
            }
        }

        return {
            success: false,
            message: user.submit.error
        }
    }
)

const deleteUser = () => createSelector(
    userSelector,
    user => {
        if (user.delete.success) {
            return {
                success: true,
                message: user.delete.success
            }
        }

        return {
            success: false,
            message: user.delete.error
        }
    }
)

const profile = () => createSelector(
    userSelector,
    user => user.profile
)

export const UserSelector = {
    getUsers,
    getPagination,
    getUserById,
    submitUser,
    deleteUser,
    profile
}