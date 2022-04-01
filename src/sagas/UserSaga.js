import {all, call, put, takeLatest} from 'redux-saga/effects'
import {UserService} from "../services";
import {AuthActions, GeneralActions, UserActions} from "../slices/actions";

function *getUsers({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(UserService.GetUsers, payload);

        yield put(UserActions.getUsersSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *getUserById({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(UserService.GetUserById, payload);

        yield put(UserActions.getUserByIdSuccess(result.data));
        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(GeneralActions.addError({
            action: type,
            message: err.response?.data?.error
        }));
    }
}

function *createUser({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        payload.status = payload.status ? 1 : 0;

        if (payload.country) {
 payload.country = payload.country.name; 
}

        const result = yield call(UserService.CreateUser, payload);

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

function *updateUser({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        if (!(payload.avatar instanceof File)) {
            delete payload.avatar;
        }

        payload.status = payload.status ? 1 : 0;

        if (payload.country) {
            payload.country = payload.country.name;
        }

        const result = yield call(UserService.UpdateUser, payload.id, payload);

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

function *deleteUser({type, payload}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(UserService.DeleteUser, payload);

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

function *profileUser({type}) {
    try {
        yield put(GeneralActions.removeError(type));
        yield put(GeneralActions.startLoading(type));

        const result = yield call(UserService.Profile);

        if (result) {
            yield put(UserActions.profileUserSuccess(result.data));
        }

        yield put(GeneralActions.stopLoading(type))
    } catch (err) {
        yield put(GeneralActions.stopLoading(type));
        yield put(AuthActions.logout());
    }
}

export function *UserWatcher() {
    yield all([
        yield takeLatest(UserActions.getUsers.type, getUsers),
        yield takeLatest(UserActions.getUserById.type, getUserById),
        yield takeLatest(UserActions.createUser.type, createUser),
        yield takeLatest(UserActions.updateUser.type, updateUser),
        yield takeLatest(UserActions.deleteUser.type, deleteUser),
        yield takeLatest(UserActions.profileUser.type, profileUser)
    ]);
}