import { createSelector } from "@reduxjs/toolkit";

const generalSelector = (state) => state.general;

const loader = (action) => createSelector(
    generalSelector,
    general => Boolean(general.loader.find(item => item === action))
);

const errors = actions => createSelector(
    generalSelector,
    general => general.errors.filter(item => actions.includes(item.action))
);

const error = (action) => createSelector(
    generalSelector,
    general => general.errors.find(item => item.action === action)
);

const success = actions => createSelector(
    generalSelector,
    general => {
        if (actions instanceof Array) {
            return general.success.filter(item => actions.includes(item.action));
        } 
            return general.success.find(e => e.action === actions) ?? false;
        

    }
);

export const GeneralSelector = {
    loader,
    errors,
    error,
    success
};