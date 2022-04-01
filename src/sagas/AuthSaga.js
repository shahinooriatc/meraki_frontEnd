import {all, call, put, takeLatest} from 'redux-saga/effects'
import {AuthService} from "../services";
import {AuthActions, GeneralActions, UserActions} from "../slices/actions";
import {push} from "connected-react-router";

function *signIn({type, payload}) {
    try {
        yield put(GeneralActions.startLoading(type));

        delete payload.role;

        const result = yield call(AuthService.Login, payload);

        localStorage.setItem("merakihr-token", result.data.token);

        yield put(GeneralActions.addSuccess({
            action: type,
            message: result.data
        }));
        yield put(GeneralActions.stopLoading(type));
        yield put(push('/app/dashboard'));
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.message
        }));
    }
}

function *signOut({type}) {
    try {
        yield put(GeneralActions.startLoading(type));

        localStorage.removeItem("merakihr-token");

        yield put(UserActions.resetProfile());
        yield put(GeneralActions.stopLoading(type));
        yield put(push('/'));
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
    }
}

export function *AuthWatcher() {
    yield all([
        yield takeLatest(AuthActions.login.type, signIn),
        yield takeLatest(AuthActions.logout.type, signOut)
    ]);
}