import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
    name: "user",
    initialState: {
        profile: null,
        users: [],
        pagination: {},

        user: {},
    },
    reducers: {
        profileUser: () => {},
        profileUserSuccess: (state, action) => {
            state.profile = action.payload;
        },
        resetProfile: (state) => {
            state.profile = null;
        },
        getUsers: () => {},
        getUsersSuccess: (state, action) => {
            state.user = {};
            state.users = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        getUserById: () => {},
        getUserByIdSuccess: (state, action) => {
            state.user = action.payload;
        },
        createUser: () => {},
        updateUser: () => {},
        deleteUser: () => {},
    }
});

export default UserSlice;