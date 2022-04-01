import {get, post, patch, del} from "../utils/api";

const API_URL = process.env.REACT_APP_API_URL;

const GetExpenses = async (params) => get(`${API_URL}/expenses`, params);

const GetExpenseById = async (id) => get(`${API_URL}/expenses/${id}`);

const CreateExpense = async (params) => post(`${API_URL}/expenses`, params);

const UpdateExpense = async (id, params) => patch(`${API_URL}/expenses/${id}`, params);

const DeleteExpense = async (id) => del(`${API_URL}/expenses/${id}`);

export const ExpenseService = {
    GetExpenses,
    GetExpenseById,
    CreateExpense,
    UpdateExpense,
    DeleteExpense
};