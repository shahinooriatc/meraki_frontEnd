import {all, fork} from 'redux-saga/effects'
import {AuthWatcher} from "./AuthSaga";
import {UserWatcher} from "./UserSaga";
import {AttendanceWatcher} from "./AttendanceSaga";
import {DepartmentWatcher} from "./DepartmentSaga";
import {DesignationWatcher} from "./DesignationSaga";
import {ExpenseWatcher} from "./ExpenseSaga";
import {LeaveWatcher} from "./LeaveSaga";
import {SettingWatcher} from "./SettingSaga";

export default function *rootSaga() {
    yield all([
        AuthWatcher,
        UserWatcher,
        AttendanceWatcher,
        DepartmentWatcher,
        DesignationWatcher,
        ExpenseWatcher,
        LeaveWatcher,
        SettingWatcher
    ].map(fork));
}