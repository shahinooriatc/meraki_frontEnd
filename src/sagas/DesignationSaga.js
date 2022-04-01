import {all, call, put, takeLatest} from 'redux-saga/effects'
import {DesignationService} from "../services";
import {DesignationActions, GeneralActions} from "../slices/actions";

function *getDesignations({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DesignationService.GetDesignations, payload);

        yield put(DesignationActions.getDesignationsSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *getDesignationById({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DesignationService.GetDesignationById, payload);

        yield put(DesignationActions.getDesignationByIdSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *createDesignation({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DesignationService.CreateDesignation, payload);

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

function *updateDesignation({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DesignationService.UpdateDesignation, payload.id, payload);

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

function *deleteDesignation({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(DesignationService.DeleteDesignation, payload);

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

export function *DesignationWatcher() {
    yield all([
        yield takeLatest(DesignationActions.getDesignations.type, getDesignations),
        yield takeLatest(DesignationActions.getDesignationById.type, getDesignationById),
        yield takeLatest(DesignationActions.createDesignation.type, createDesignation),
        yield takeLatest(DesignationActions.updateDesignation.type, updateDesignation),
        yield takeLatest(DesignationActions.deleteDesignation.type, deleteDesignation)
    ]);
}