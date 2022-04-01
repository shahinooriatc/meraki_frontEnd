import AuthSlice from "./slice/AuthSlice";
import UserSlice from "./slice/UserSlice";
import DepartmentSlice from "./slice/DepartmentSlice";
import DesignationSlice from "./slice/DesignationSlice";
import AttendanceSlice from "./slice/AttendanceSlice";
import ExpensesSlice from "./slice/ExpensesSlice";
import LeaveSlice from "./slice/LeaveSlice";
import GeneralSlice from "./slice/GeneralSlice";
import SettingSlice from "./slice/SettingSlice";

const reducers = {
    general: GeneralSlice.reducer,
    auth: AuthSlice.reducer,
    user: UserSlice.reducer,
    department: DepartmentSlice.reducer,
    designation: DesignationSlice.reducer,
    attendance: AttendanceSlice.reducer,
    expenses: ExpensesSlice.reducer,
    leave: LeaveSlice.reducer,
    setting: SettingSlice.reducer
};

export default reducers;