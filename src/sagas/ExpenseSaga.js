import {all, call, put, takeLatest} from 'redux-saga/effects'
import {ExpenseService} from "../services";
import {ExpensesActions, GeneralActions} from "../slices/actions";
import {push} from "connected-react-router";

function *getExpenses({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(ExpenseService.GetExpenses, payload);

        yield put(ExpensesActions.getExpensesSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *getExpenseById({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(ExpenseService.GetExpenseById, payload);

        yield put(ExpensesActions.getExpenseByIdSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *createExpense({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(ExpenseService.CreateExpense, payload);

        yield put(GeneralActions.addSuccess({
            action: type,
            message: result.data.message
        }));
        yield put(push('/app/expenses'))
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *updateExpense({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(ExpenseService.UpdateExpense, payload.id, payload);

        yield put(GeneralActions.addSuccess({
            action: type,
            message: result.data.message
        }));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *deleteExpense({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(ExpenseService.DeleteExpense, payload);

        yield put(GeneralActions.addSuccess({
            action: type,
            message: result.data.message
        }));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

export function *ExpenseWatcher() {
    yield all([
        yield takeLatest(ExpensesActions.getExpenses.type, getExpenses),
        yield takeLatest(ExpensesActions.getExpenseById.type, getExpenseById),
        yield takeLatest(ExpensesActions.createExpense.type, createExpense),
        yield takeLatest(ExpensesActions.updateExpense.type, updateExpense),
        yield takeLatest(ExpensesActions.deleteExpense.type, deleteExpense)
    ]);
}