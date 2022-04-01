import {createSelector} from "@reduxjs/toolkit";

const expensesSelector = (state) => state.expenses;

const getExpenses = () => createSelector(
    expensesSelector,
    expenses => expenses.expenses
);

const getPagination = () => createSelector(
    expensesSelector,
    expenses => expenses.pagination
);

const getExpensesById = () => createSelector(
    expensesSelector,
    expenses => expenses.expense
);

const submitExpenses = () => createSelector(
    expensesSelector,
    expenses => {
        if (expenses.submit.success) {
            return {
                success: true,
                message: expenses.submit.success
            }
        }

        return {
            success: false,
            message: expenses.submit.error
        }
    }
)

const deleteExpenses = () => createSelector(
    expensesSelector,
    expenses => {
        if (expenses.delete.success) {
            return {
                success: true,
                message: expenses.delete.success
            }
        }

        return {
            success: false,
            message: expenses.delete.error
        }
    }
)

export const ExpensesSelector = {
    getExpenses,
    getPagination,
    getExpensesById,
    submitExpenses,
    deleteExpenses
}