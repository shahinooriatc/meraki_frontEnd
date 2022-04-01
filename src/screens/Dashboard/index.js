import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import PageTitle from "components/PageTitle";
import {useDispatch, useSelector} from "react-redux";
import {UserSelector, ExpensesSelector, AttendanceSelector} from "selectors";
import {getTodayData, groupByMonth} from "utils/convertion";
import {AttendanceActions, ExpensesActions, UserActions} from "slices/actions";
import Charts from "./components/Charts";
import Widgets from "./components/Widgets";
import Can from "utils/can";
import {actions, features} from "constants/permission";

const ChartOptions = {
    series: [],
    options: {
        chart: {
            height: 350,
            type: 'area',
            toolbar: false
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#D929C7'],
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
    }
};

export default function Dashboard() {
    const dispatch = useDispatch();
    const users = useSelector(UserSelector.getUsers());
    const profile = useSelector(UserSelector.profile());
    const expenses = useSelector(ExpensesSelector.getExpenses());
    const attendances = useSelector(AttendanceSelector.getAttendances());

    const [widget, setWidget] = useState({
        employee: 0,
        attendance: 0,
        expenses: 0
    });
    const [employeeChart, setEmployeeChart] = useState(ChartOptions);
    const [expenseChart, setExpenseChart] = useState(ChartOptions);
  
    useEffect(() => {
        if (Can(actions.readAll, features.user)) {
            dispatch(UserActions.getUsers());
            dispatch(ExpensesActions.getExpenses());
            dispatch(AttendanceActions.getAttendances());
        }

        if (Can(actions.readSome, features.user)) {
            dispatch(UserActions.getUsers({ department: profile?.department?._id}));
            dispatch(AttendanceActions.getAttendances({ department: profile?.department?._id}));
        }
    }, [profile]);

    useEffect(() => {
        const grouped = groupByMonth(users?.map(item => ({
            ...item,
            date: item.createdAt
        })));

        setEmployeeChart({
            ...ChartOptions,
            series: [{
                name: 'Employees',
                data: generateChartData(grouped) ?? []
            }]
        });
    }, [users]);

    useEffect(() => {
        const grouped = groupByMonth(expenses.map(item => ({
            ...item,
            date: item.date
        })));

        setExpenseChart({
            ...ChartOptions,
            series: [{
                name: 'Expenses',
                data: generateChartData(grouped) ?? []
            }]
        });

        const todayExpenses = getTodayData(expenses.map(item => ({ ...item, date: item.date })));
        setWidget({
            ...widget,
            expenses: todayExpenses.length > 0? todayExpenses.map(item => item.amount).reduce((prev, next) => prev + next) : 0
        });
    }, [expenses]);

    useEffect(() => {
        const data = attendances?.map(item => ({ ...item, date: item.checkIn }));
        const todayAttendance = getTodayData(data);

        setWidget({
            ...widget,
            attendance: todayAttendance?.length ?? 0
        });
    }, [attendances]);

    const generateChartData = (data) => Array(12).fill().
map((item, i) => {
            if (data[i]) {
                return data[i].length;
            }

            return 0;
        })

    return (
        <Box>
            <PageTitle title="Dashboard"/>

            <Widgets
                countUser={users.length}
                widget={widget}/>

            <Charts
                employee={employeeChart}
                expense={expenseChart}/>
        </Box>
    )
}