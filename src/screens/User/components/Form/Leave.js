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
import {LeaveSelector} from "../../../../selectors";
import {LeaveActions} from "../../../../slices/actions";
import {styled} from "@mui/material/styles";
import moment from "moment";
import {push} from "connected-react-router";
import PropTypes from "prop-types";

const Header = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
}));

LeaveHistory.propTypes = {
    user: PropTypes.object
};

export default function LeaveHistory({ user }) {
    const dispatch = useDispatch();
    const leaves = useSelector(LeaveSelector.getLeaves());

    useEffect(() => {
        dispatch(LeaveActions.getLeaves({
            user: user._id
        }))
    }, []);

    return (
        <Card>
            <Header>
                <Typography variant='h5'>Leave Histories</Typography>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => dispatch(push('/app/leave/create'))}>Apply Leave</Button>
            </Header>

            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Check In</TableCell>
                            <TableCell>Break At</TableCell>
                            <TableCell>Back At</TableCell>
                            <TableCell>Check Out</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaves.length === 0 && (
                            <TableRow>
                                <TableCell align="center" colSpan={4}>
                                    No Data
                                </TableCell>
                            </TableRow>
                        )}
                        {leaves.map((item, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    {item.checkIn ? moment(item.checkIn).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                </TableCell>
                                <TableCell>
                                    {item.break ? moment(item.break).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                </TableCell>
                                <TableCell>
                                    {item.back ? moment(item.back).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                </TableCell>
                                <TableCell>
                                    {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}