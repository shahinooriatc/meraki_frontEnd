import React, {useEffect, useState} from "react";
import {
    Box, Card, Chip, Grid, Hidden, MenuItem, Pagination, Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import ROLES from "constants/role";
import {styled} from "@mui/material/styles";
import {DefaultSort, NameSort} from "constants/sort";
import {DepartmentSelector, DesignationSelector, GeneralSelector, UserSelector} from "selectors";
import {DepartmentActions, DesignationActions, UserActions} from "slices/actions";
import Input from "components/Input";
import SelectField from "components/SelectField";
import Can from "utils/can";
import {actions, features} from "constants/permission";
import ListSkeleton from "components/Skeleton/ListSkeleton";

const Content = styled(Card)(() => ({
    marginBottom: 20
}));

export default function EmployeeList() {
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const users = useSelector(UserSelector.getUsers());
    const loading = useSelector(GeneralSelector.loader(UserActions.getUsers.type));
    const pagination = useSelector(UserSelector.getPagination());
    const departments = useSelector(DepartmentSelector.getDepartments());
    const designations = useSelector(DesignationSelector.getDesignations());

    const [filter, setFilter] = useState({
        sort: NameSort.name.value,
        role: -1,
        status: -1,
        page: 1
    });

    useEffect(() => {
        if (Can(actions.readAll, features.user)) {
            dispatch(DepartmentActions.getDepartments());
        }

        dispatch(DesignationActions.getDesignations());
    }, []);

    useEffect(() => {
        if (Can(actions.readAll, features.user)) {
            fetchUsers(filter);
        }

        if (Can(actions.readSome, features.user)) {
            setFilter({ ...filter, department: profile.department._id });
            fetchUsers({
                ...filter,
                department: profile.department._id
            });
        }
    }, [profile]);

    const fetchUsers = (params) => {
        Object.keys(params).forEach(key => {
            if (params[key] === -1) {
                delete params[key];
            }
        });

        dispatch(UserActions.getUsers(params));
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
        fetchUsers(params);
    };

    return (
        <Box>
            <Content>
                <Grid container spacing={3}>
                    <Grid item lg={3} sm={12} xs={12}>
                        <Input
                            label="Search"
                            value={filter.keyword}
                            name="keyword"
                            onChange={handleChangeFilter}/>
                    </Grid>
                    <Grid item lg={3} sm={12} xs={12}>
                        <SelectField
                            label="Role"
                            value={filter.role}
                            name="role"
                            onChange={handleChangeFilter}>
                            <MenuItem value={-1}>All Role</MenuItem>
                            {Object.keys(ROLES).map(key => (
                                <MenuItem key={key} value={ROLES[key].value}>
                                    {ROLES[key].name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                    <Grid item lg={3} sm={12} xs={12}>
                        <SelectField
                            label="Status"
                            value={filter.status}
                            name="status"
                            onChange={handleChangeFilter}>
                            <MenuItem value={-1}>All Status</MenuItem>
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={0}>Non Active</MenuItem>
                        </SelectField>
                    </Grid>
                    {Can(actions.readAll, features.user) && (
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
                    <Grid item lg={2} sm={12} xs={12}>
                        <SelectField
                            label="Sort"
                            placeholder="Sort by name or email"
                            value={filter.sort}
                            name="sort"
                            onChange={handleChangeFilter}>
                            {Object.keys(DefaultSort).map((key) => (
                                <MenuItem key={key} value={DefaultSort[key].value}>
                                    {DefaultSort[key].name}
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
                                <TableCell>Employee</TableCell>
                                <Hidden smDown>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Designation</TableCell>
                                </Hidden>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell align="center" colSpan={6}>
                                        No Data
                                    </TableCell>
                                </TableRow>
                            )}
                            {users.map((item, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.name}
                                    </TableCell>
                                    <Hidden smDown>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.role.map(e => ROLES[e].name).join(', ')}</TableCell>
                                        <TableCell>{item.department?.name ?? '-'}</TableCell>
                                        <TableCell>{item.designation?.name ?? '-'}</TableCell>
                                    </Hidden>
                                    <TableCell align="center">
                                        <Chip
                                            label={item.status === 1 ? 'Active' : 'Non Active'}
                                            color={item.status === 1 ? 'success' : 'error'}/>
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