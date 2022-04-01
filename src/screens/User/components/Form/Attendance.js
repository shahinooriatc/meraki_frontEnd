import React, {useEffect} from "react";
import {
    Box, Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AttendanceActions, GeneralActions} from "slices/actions";
import {AttendanceSelector, GeneralSelector} from "selectors";
import moment from "moment";
import {styled} from "@mui/material/styles";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import {DefaultSort} from "../../../../constants/sort";

const Header = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
}));

Attendance.propTypes = {
    user: PropTypes.object,
    form: PropTypes.object
};

export default function Attendance({ user }) {
    const dispatch = useDispatch();
    const attendances = useSelector(AttendanceSelector.getAttendances());
    const actions = [
        AttendanceActions.createAttendance.type,
        AttendanceActions.updateAttendance.type
    ];
    const success = useSelector(GeneralSelector.success(actions));

    useEffect(() => {
        dispatch(AttendanceActions.getAttendances({
            user: user._id,
            sort: DefaultSort.newest.value
        }));
    }, []);

    useEffect(() => {
        if (success.length > 0) {
            const action = success.find(item => actions.includes(item.action));

            toast.success(`${action?.message ?? "Success"}`, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                });

            dispatch(GeneralActions.removeSuccess(actions));

            dispatch(AttendanceActions.getAttendances({
                user: user._id
            }));
        }
    }, [success]);

    const handleCheckIn = () => {
        const params = {
            user: user._id,
            checkIn: new Date()
        };

        dispatch(AttendanceActions.createAttendance(params));
    };

    const handleCheckOut = (id) => {
        const params = {
            id,
            user: user._id,
            checkOut: new Date()
        };

        dispatch(AttendanceActions.updateAttendance(params));
    };

    return (
        <Card>
            <Header>
                <Typography variant='h5'>Attendance Histories</Typography>
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={handleCheckIn}>Check In</Button>
            </Header>

            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell align="right">Option</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendances.length === 0 && (
                            <TableRow>
                                <TableCell align="center" colSpan={5}>
                                    No Data
                                </TableCell>
                            </TableRow>
                        )}
                        {attendances.map((item, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    {item.checkIn ? moment(item.checkIn).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                </TableCell>
                                <TableCell>
                                    {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                </TableCell>
                                <TableCell align="right">
                                    {!item.checkOut ? (
                                        <Button
                                            size='small'
                                            variant='contained'
                                            color='primary'
                                            onClick={() => handleCheckOut(item._id)}>
                                            Check Out
                                        </Button>
                                    ) : '-' }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}