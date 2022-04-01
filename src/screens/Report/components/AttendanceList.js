import React, {useEffect, useState} from "react";
import {
    Box, Card, Grid, MenuItem, Pagination, Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {styled} from "@mui/material/styles";
import {AttendanceSort} from "constants/sort";
import moment from "moment";
import {AttendanceSelector, DepartmentSelector, DesignationSelector, GeneralSelector, UserSelector} from "selectors";
import {AttendanceActions, DepartmentActions, DesignationActions} from "slices/actions";
import Input from "components/Input";
import SelectField from "components/SelectField";
import Can from "utils/can";
import {actions, features} from "constants/permission";
import ListSkeleton from "components/Skeleton/ListSkeleton";

const Content = styled(Card)(() => ({
    marginBottom: 20
}));

export default function AttendanceList() {
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const attendances = useSelector(AttendanceSelector.getAttendances());
    const loading = useSelector(GeneralSelector.loader(AttendanceActions.getAttendances.type));
    const pagination = useSelector(AttendanceSelector.getPagination());
    const departments = useSelector(DepartmentSelector.getDepartments());
    const designations = useSelector(DesignationSelector.getDesignations());

    const [filter, setFilter] = useState({
        sort: AttendanceSort.checkIn.value,
        department: -1,
        designation: -1
    });

    useEffect(() => {
        if (Can(actions.readAll, features.department)) {
            dispatch(DepartmentActions.getDepartments());
        }

        dispatch(DesignationActions.getDesignations());
    }, []);

    useEffect(() => {
        if (Can(actions.readAll, features.user)) {
            fetchAttendance(filter);
        }

        if (Can(actions.readSome, features.user)) {
            setFilter({ ...filter, department: profile.department._id });
            fetchAttendance({
                ...filter,
                department: profile.department._id
            });
        }
    }, [profile]);

    const fetchAttendance = (params) => {
        Object.keys(params).forEach(key => {
            if (params[key] === -1) {
                delete params[key];
            }
        });

        dispatch(AttendanceActions.getAttendances(params));
    }

    const handleChangeFilter = ({ target }) => {
        const { name, value } = target;
        const params = {
            ...filter,
            [name]: value
        };

        if (value === -1) {
            delete params[name];
        }

        setFilter(params);
        fetchAttendance(params);
    };

    return (
        <Box>
            <Content>
                <Grid container spacing={3}>
                    <Grid item lg={4} sm={12} xs={12}>
                        <Input
                            label="Search"
                            value={filter.keyword}
                            name="keyword"
                            onChange={handleChangeFilter}/>
                    </Grid>
                    {Can(actions.readAll, features.department) && (
                        <Grid item lg={3} sm={12} xs={12}>
                            <SelectField
                                label="Department"
                                value={filter.department}
                                name="department"
                                onChange={handleChangeFilter}>
                                <MenuItem value={-1}>All Department</MenuItem>
                                {departments.map((item, i) => (
                                    <MenuItem key={i} value={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </SelectField>
                        </Grid>
                    )}
                    <Grid item lg={3} sm={12} xs={12}>
                        <SelectField
                            label="Designation"
                            value={filter.designation}
                            name="designation"
                            onChange={handleChangeFilter}>
                            <MenuItem value={-1}>All Designations</MenuItem>
                            {designations.map((item, i) => (
                                <MenuItem key={i} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                    <Grid item lg={2}>
                        <SelectField
                            label="Sort"
                            placeholder="Sort by name or email"
                            value={filter.sort}
                            name="sort"
                            onChange={handleChangeFilter}>
                            {Object.keys(AttendanceSort).map((key) => (
                                <MenuItem key={key} value={AttendanceSort[key].value}>
                                    {AttendanceSort[key].name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                </Grid>
            </Content>
            {loading ? (
                <ListSkeleton/>
            ) : (
                <Content>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Check In</TableCell>
                                <TableCell>Check Out</TableCell>
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
                                    <TableCell component="th" scope="row">
                                        {item.user?.name}
                                    </TableCell>
                                    <TableCell>
                                        {item.checkIn ? moment(item.checkIn).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination
                        sx={{ mt: 3 }}
                        count={pagination?.pages}
                        page={pagination?.currentPage}
                        onChange={(e, val) => setFilter({ ...filter, page: val})}/>
                </Content>
            )}
        </Box>
    )
}