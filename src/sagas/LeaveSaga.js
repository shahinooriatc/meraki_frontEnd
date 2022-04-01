import {all, call, put, takeLatest} from 'redux-saga/effects'
import {LeaveService} from "../services";
import {LeaveActions, GeneralActions} from "../slices/actions";

function *getLeaves({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(LeaveService.GetLeaves, payload);

        yield put(LeaveActions.getLeavesSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *getLeaveById({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(LeaveService.GetLeaveById, payload);

        yield put(LeaveActions.getLeaveByIdSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *createLeave({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        payload.user = payload.user._id;

        const result = yield call(LeaveService.CreateLeave, payload);

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

function *updateLeave({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        payload.user = payload.user._id;

        const result = yield call(LeaveService.UpdateLeave, payload.id, payload);

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

function *deleteLeave({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(LeaveService.DeleteLeave, payload);

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

export function *LeaveWatcher() {
    yield all([
        yield takeLatest(LeaveActions.getLeaves.type, getLeaves),
        yield takeLatest(LeaveActions.getLeaveById.type, getLeaveById),
        yield takeLatest(LeaveActions.createLeave.type, createLeave),
        yield takeLatest(LeaveActions.updateLeave.type, updateLeave),
        yield takeLatest(LeaveActions.deleteLeave.type, deleteLeave)
    ]);
}