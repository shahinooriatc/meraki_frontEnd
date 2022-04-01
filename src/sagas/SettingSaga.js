import {all, call, put, takeLatest} from 'redux-saga/effects'
import {GeneralActions, SettingActions} from "../slices/actions";
import {SettingService} from "../services/SettingService";

function *getSetting({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(SettingService.GetSetting, payload);

        yield put(SettingActions.getSettingSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *updateSetting({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        if (payload.country) {
            payload.country = payload.country.name;
        }

        const result = yield call(SettingService.UpdateSetting, payload.id, payload);

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

export function *SettingWatcher() {
    yield all([
        yield takeLatest(SettingActions.getSetting.type, getSetting),
        yield takeLatest(SettingActions.updateSetting.type, updateSetting)
    ]);
}