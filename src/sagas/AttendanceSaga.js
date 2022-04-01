import {all, call, put, takeLatest} from 'redux-saga/effects'
import {AttendanceService} from "../services";
import {AttendanceActions, GeneralActions} from "../slices/actions";

function *getAttendances({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(AttendanceService.GetAttendances, payload);

        yield put(AttendanceActions.getAttendancesSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *getAttendanceById({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(AttendanceService.GetAttendanceById, payload);

        yield put(AttendanceActions.getAttendanceByIdSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *createAttendance({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(AttendanceService.CreateAttendance, payload);

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

function *updateAttendance({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(AttendanceService.UpdateAttendance, payload.id, payload);

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

function *deleteAttendance({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(AttendanceService.DeleteAttendance, payload);

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

export function *AttendanceWatcher() {
    yield all([
        yield takeLatest(AttendanceActions.getAttendances.type, getAttendances),
        yield takeLatest(AttendanceActions.getAttendanceById.type, getAttendanceById),
        yield takeLatest(AttendanceActions.createAttendance.type, createAttendance),
        yield takeLatest(AttendanceActions.updateAttendance.type, updateAttendance),
        yield takeLatest(AttendanceActions.deleteAttendance.type, deleteAttendance)
    ]);
}