import React, {useEffect} from "react";
import {Grid, useTheme} from "@mui/material";
import Widget from "./Widget";
import {AccountBalanceWallet, AssignmentIndOutlined, CalendarToday, People} from "@mui/icons-material";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {LeaveSelector, UserSelector} from "selectors";
import {LeaveActions, SettingActions} from "slices/actions";
import Can from "utils/can";
import {actions, features} from "constants/permission";
import {SettingSelector} from "selectors/SettingSelector";
import Activity from "./Activity";

Widgets.propTypes = {
    countUser: PropTypes.number,
    widget: PropTypes.any
};

export default function Widgets(props) {
    const { countUser, widget } = props;
    const theme = useTheme();
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const countLeave = useSelector(LeaveSelector.countLeave());
    const setting = useSelector(SettingSelector.getSetting());

    useEffect(() => {
        dispatch(SettingActions.getSetting());
    }, []);

    useEffect(() => {
        if (profile) {

            dispatch(LeaveActions.getLeaves({
                user: profile._id
            }));
        }
    }, [profile]);

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Activity/>

            {Can(actions.readSelf, features.leave) && (
                <Grid item lg={6} container spacing={3}>
                    <Grid item lg={12} sm={12} xs={12}>
                        <Widget
                            title="Leave Taken"
                            content={countLeave ?? 0}
                            icon={<AssignmentIndOutlined sx={{ color: theme.palette.primary.main, fontSize: 62 }}/>}/>
                    </Grid>
                    {Can(actions.read, features.attendance) && (
                        <Grid item lg={12} sm={12} xs={12}>
                            <Widget
                                title="Quote Leave"
                                content={setting?.leaveLimit ?? 0}
                                icon={<AssignmentIndOutlined sx={{ color: theme.palette.primary.main, fontSize: 62 }}/>}/>
                        </Grid>
                    )}
                </Grid>
            )}

            {Can(actions.readAll, features.user) && (
                <Grid item lg={4} sm={12} xs={12}>
                    <Widget
                        title="Total Employee"
                        content={countUser ?? 0}
                        icon={<People sx={{ color: theme.palette.primary.main, fontSize: 62 }}/>}/>
                </Grid>
            )}
            {Can(actions.readAll, features.attendance) && (
                <Grid item lg={4} sm={12} xs={12}>
                    <Widget
                        title="Today Attendance"
                        content={widget.attendance}
                        icon={<CalendarToday sx={{ color: theme.palette.primary.main, fontSize: 62 }}/>}/>
                </Grid>
            )}
            {Can(actions.readAll, features.expense) && (
                <Grid item lg={4} sm={12} xs={12}>
                    <Widget
                        title="Today Expenses"
                        content={widget.expenses}
                        icon={<AccountBalanceWallet sx={{ color: theme.palette.primary.main, fontSize: 62 }}/>}/>
                </Grid>
            )}
            {Can(actions.readSome, features.user) && (
                <Grid item lg={6} sm={12} xs={12}>
                    <Widget
                        title="Department Employee"
                        content={widget.expenses}
                        icon={<People sx={{ color: theme.palette.primary.main, fontSize: 62 }}/>}/>
                </Grid>
            )}
            {Can(actions.readSome, features.user) && (
                <Grid item lg={6} sm={12} xs={12}>
                    <Widget
                        title="Department Attendance"
                        content={widget.attendance}
                        icon={<CalendarToday sx={{ color: theme.palette.primary.main, fontSize: 62 }}/>}/>
                </Grid>
            )}
        </Grid>
    )
}