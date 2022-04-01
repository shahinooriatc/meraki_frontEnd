import { createSlice } from "@reduxjs/toolkit";

export const ExpensesSlice = createSlice({
    name: "Expenses",
    initialState: {
        expenses: [],
        pagination: {},
        expense: {}
    },
    reducers: {
        getExpenses: () => {},
        getExpensesSuccess: (state, action) => {
            state.expense = {};
            state.expenses = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        getExpenseById: () => {},
        getExpenseByIdSuccess: (state, action) => {
            state.expense = action.payload
        },
        createExpense: () => {},
        updateExpense: () => {},
        deleteExpense: () => {},
    }
});

export default ExpensesSlice;