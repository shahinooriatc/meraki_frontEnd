import React from "react";
import {Route, Switch} from "react-router-dom";
import User from "screens/User";
import MainLayout from "./layouts/MainLayout";
import Department from "screens/Department";
import FormUser from "./screens/User/Form";
import FormDepartment from "./screens/Department/Form";
import Designation from "./screens/Designation";
import FormDesignation from "./screens/Designation/Form";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./screens/Auth/Login";
import Dashboard from "./screens/Dashboard";
import Attendance from "./screens/Attendance";
import FormAttendance from "./screens/Attendance/Form";
import Expenses from "./screens/Expenses";
import FormExpenses from "./screens/Expenses/Form";
import Report from "./screens/Report";
import CreateUser from "./screens/User/Create";
import Leaves from "./screens/Leave";
import FormLeave from "./screens/Leave/Form";
import Setting from "./screens/Setting";
import Profile from "./screens/Profile";

const PrivateRoutes = [
    { path: "/app/user", component: User },
    { path: "/app/user/create", component: CreateUser },
    { path: "/app/user/update/:id", component: FormUser },

    { path: "/app/department", component: Department },
    { path: "/app/department/create", component: FormDepartment },
    { path: "/app/department/update/:id", component: FormDepartment },

    { path: "/app/designation", component: Designation },
    { path: "/app/designation/create", component: FormDesignation },
    { path: "/app/designation/update/:id", component: FormDesignation },

    { path: "/app/attendance", component: Attendance },
    { path: "/app/attendance/create", component: FormAttendance },
    { path: "/app/attendance/update/:id", component: FormAttendance },

    { path: "/app/expenses", component: Expenses },
    { path: "/app/expenses/create", component: FormExpenses },
    { path: "/app/expenses/update/:id", component: FormExpenses },

    { path: "/app/leave", component: Leaves },
    { path: "/app/leave/create", component: FormLeave },
    { path: "/app/leave/update/:id", component: FormLeave },

    { path: "/app/report", component: Report},

    { path: "/app/setting", component: Setting},

    { path: "/app/profile", component: Profile},

    { path: "/app/dashboard", component: Dashboard }
]

export default function Routes() {
    return (
        <Switch>
            <Route exact={true} path={PrivateRoutes.map(item => item.path)}>
                <MainLayout>
                    <Switch>
                        {PrivateRoutes.map((item, i) => (
                                <Route key={i} exact path={item.path} component={item.component}/>
                            ))}
                    </Switch>
                </MainLayout>
            </Route>

            <Route exact={true} path={["/"]}>
                <AuthLayout>
                    <Switch>
                        <Route exact path="/" component={Login}/>
                    </Switch>
                </AuthLayout>
            </Route>
        </Switch>
    )
}