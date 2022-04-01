import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Can from "../../../utils/can";
import {actions, features} from "../../../constants/permission";
import {Box, Button, Card, Grid, Typography} from "@mui/material";
import {Timer} from "@mui/icons-material";
import moment from "moment";
import {AttendanceActions, GeneralActions} from "../../../slices/actions";
import {useDispatch, useSelector} from "react-redux";
import {AttendanceSelector, GeneralSelector, UserSelector} from "../../../selectors";
import {styled} from "@mui/material/styles";

Activity.propTypes = {
    attendance: PropTypes.object
};

const InfoLog = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between'
}));

export default function Activity() {
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const attendances = useSelector(AttendanceSelector.getAttendances());
    const success = useSelector(GeneralSelector.success([
        AttendanceActions.createAttendance.type,
        AttendanceActions.updateAttendance.type
    ]));

    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        if (Can(actions.read, features.attendance)) {
            dispatch(AttendanceActions.getAttendances({
                user: profile._id,
                date: new Date()
            }));
        }
    }, [profile]);

    useEffect(() => {
        if (attendances.length > 0) {
            setAttendance(attendances[0]);
        }
    }, [attendances]);

    useEffect(() => {
        if (success.length > 0) {
            if (Can(actions.read, features.attendance)) {
                dispatch(AttendanceActions.getAttendances({
                    user: profile._id,
                    date: new Date()
                }));
            }
            dispatch(GeneralActions.removeSuccess(AttendanceActions.createAttendance.type))
        }
    }, [success]);

    const handleCheckIn = () => {
        dispatch(AttendanceActions.createAttendance({
            user: profile._id,
            checkIn: new Date()
        }));
    };

    const handleCheckOut = () => {
        dispatch(AttendanceActions.updateAttendance({
            id: attendance._id,
            checkOut: new Date()
        }));
    };

    if (Can(actions.readSelf, features.attendance)) {
        return (
            <Grid item lg={6} sm={12} xs={12}>
                <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Timer color='primary' sx={{ fontSize: 100 }}/>
                    <Box>
                        <Typography variant='h5' sx={{ mb: 3 }}>Your Activity Today</Typography>
                        <InfoLog>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography>Check In</Typography>
                                <Typography variant='subtitle2'>
                                    {attendance.checkIn ? moment(attendance.checkIn).format('HH:mm') : '-'}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography>Check Out</Typography>
                                <Typography variant='subtitle2'>
                                    {attendance.checkOut ? moment(attendance.checkOut).format('HH:mm') : '-'}
                                </Typography>
                            </Box>
                        </InfoLog>
                    </Box>
                    {!attendance.checkOut && (
                        <Box sx={{ mt: 3 }}>
                            {!attendance.checkIn ? (
                                <Button
                                    fullWidth
                                    variant='contained'
                                    color='success'
                                    onClick={handleCheckIn}>Check In</Button>
                            ) : (
                                <Button
                                    fullWidth
                                    variant='contained'
                                    color='error'
                                    onClick={handleCheckOut}>Check Out</Button>
                            )}
                        </Box>
                    )}
                </Card>
            </Grid>
        )
    }

    return <></>;
}