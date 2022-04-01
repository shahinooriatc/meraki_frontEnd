import {all, call, put, takeLatest} from 'redux-saga/effects'
import {DepartmentService} from "../services";
import {DepartmentActions, GeneralActions} from "../slices/actions";

function *getDepartments({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DepartmentService.GetDepartments, payload);

        yield put(DepartmentActions.getDepartmentsSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *getDepartmentById({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DepartmentService.GetDepartmentById, payload);

        yield put(DepartmentActions.getDepartmentByIdSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *createDepartment({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DepartmentService.CreateDepartment, payload);

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

function *updateDepartment({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DepartmentService.UpdateDepartment, payload.id, payload);

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

function *deleteDepartment({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DepartmentService.DeleteDepartment, payload);

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

export function *DepartmentWatcher() {
    yield all([
        yield takeLatest(DepartmentActions.getDepartments.type, getDepartments),
        yield takeLatest(DepartmentActions.getDepartmentById.type, getDepartmentById),
        yield takeLatest(DepartmentActions.createDepartment.type, createDepartment),
        yield takeLatest(DepartmentActions.updateDepartment.type, updateDepartment),
        yield takeLatest(DepartmentActions.deleteDepartment.type, deleteDepartment)
    ]);
}