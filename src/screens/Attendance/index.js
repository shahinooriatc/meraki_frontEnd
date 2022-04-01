import React, {useEffect, useState} from "react";
import {
    Box, Card, Grid, IconButton, MenuItem, Table, TableBody, TableCell, TableHead, Pagination,
    TableRow, InputBase, FormControl, Hidden, ListItemIcon
} from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import FloatingButton from "components/FloatingButton";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AttendanceSelector, GeneralSelector, UserSelector} from "selectors";
import moment from "moment";
import {Delete, Edit, Visibility} from "@mui/icons-material";
import {AttendanceActions, GeneralActions, UserActions} from "slices/actions";
import {DefaultSort} from "constants/sort";
import {toast} from "react-toastify";
import DialogConfirm from "components/DialogConfirm";
import SelectField from "components/SelectField";
import Can from "utils/can";
import {actions, features} from "constants/permission";
import {Autocomplete} from "@mui/lab";
import ListSkeleton from "../../components/Skeleton/ListSkeleton";
import CustomMenu from "../../components/CustomMenu";

const FilterBox = styled(Box)(() => ({
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
}));

export default function Attendance() {
    const history = useHistory();
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const users = useSelector(UserSelector.getUsers());
    const attendances = useSelector(AttendanceSelector.getAttendances());
    const loading = useSelector(GeneralSelector.loader(AttendanceActions.getAttendances.type));
    const pagination = useSelector(AttendanceSelector.getPagination());
    const success = useSelector(GeneralSelector.success(AttendanceActions.deleteAttendance.type));

    const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState({
        sort: DefaultSort.newest.value,
        page: 1
    });
    const [selected, setSelected] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        dispatch(UserActions.getUsers());
    }, []);

    useEffect(() => {
        if (filter.user === -1) {
            delete filter.user;
        }

        dispatch(AttendanceActions.getAttendances(filter));
    }, [filter]);

    useEffect(() => {
        if (profile && Can(actions.readSelf, features.attendance)) {
            setFilter({
                ...filter,
                user: profile._id
            });
        }
    }, [profile]);

    useEffect(() => {
        if (success) {
            setConfirmDelete(false);
            setSelected(null);

            toast.success(`${success?.message ?? "Success"}`, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: false
                });

            dispatch(GeneralActions.removeSuccess(AttendanceActions.deleteAttendance.type));
            dispatch(AttendanceActions.getAttendances(filter));
        }
    }, [success]);

    const handleChangeFilter = ({ target }) => {
        const {name, value} = target;

        setFilter({
            ...filter,
            [name]: value
        });
    }

    const handleChangePagination = (e, val) => {
        setFilter({
            ...filter,
            page: val
        });
    };

    const handleDelete = () => {
        dispatch(AttendanceActions.deleteAttendance(selected));
    }

    return (
        <Card>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Attendance</Typography>
            <FilterBox>
                <Grid container spacing={3} justifyContent="space-between">
                    {Can(actions.readAll, features.attendance) && (
                        <Grid item lg={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Typography variant='caption'>Employee</Typography>
                                <Autocomplete
                                    disablePortal
                                    options={users}
                                    value={selectedUser ?? ''}
                                    onChange={(e, val) => {
                                        setSelectedUser(val);
                                        handleChangeFilter({target: {
                                                name: 'user',
                                                value: val ? val._id : -1
                                            }});

                                    }}
                                    getOptionLabel={(option) => option.name ?? ''}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderInput={(params) => <InputBase {...params.InputProps} {...params} />}
                                />
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item lg={2} sm={12} xs={12}>
                        <SelectField
                            label="Sort"
                            name='sort'
                            value={filter.sort}
                            onChange={handleChangeFilter}>
                            {Object.keys(DefaultSort).map((key) => (
                                <MenuItem key={key} value={DefaultSort[key].value}>
                                    {DefaultSort[key].name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                </Grid>
            </FilterBox>

            {loading ? (
                <ListSkeleton/>
            ) : (
                <Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <Hidden smDown>
                                    <TableCell>Check In</TableCell>
                                    <TableCell>Check Out</TableCell>
                                </Hidden>
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
                                    <TableCell component="th" scope="row">
                                        {item.user?.name}<br/>
                                        <Hidden smUp>
                                            <Typography variant='caption'>
                                                In:  {item.checkIn ? moment(item.checkIn).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                            </Typography><br/>
                                            <Typography variant='caption'>
                                                Out:  {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                            </Typography>
                                        </Hidden>
                                    </TableCell>
                                    <Hidden smDown>
                                        <TableCell>
                                            {item.checkIn ? moment(item.checkIn).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {item.checkOut ? moment(item.checkOut).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                        </TableCell>
                                    </Hidden>
                                    <TableCell align="right">
                                        <Hidden smDown>
                                            {!item.checkOut && (
                                                <IconButton
                                                    onClick={() => history.push(`/app/attendance/update/${item._id}`)}>
                                                    <Edit/>
                                                </IconButton>
                                            )}
                                            <IconButton onClick={() => {
                                                setConfirmDelete(true);
                                                setSelected(item._id);
                                            }}>
                                                <Delete/>
                                            </IconButton>
                                        </Hidden>
                                        <Hidden smUp>
                                            <CustomMenu>
                                                {!item.checkOut && (
                                                    <MenuItem onClick={() => history.push(`/app/attendance/update/${item._id}`)}>
                                                        <ListItemIcon>
                                                            <Visibility fontSize="small" />
                                                        </ListItemIcon>
                                                        Detail
                                                    </MenuItem>
                                                )}
                                                <MenuItem
                                                    onClick={() => {
                                                        setConfirmDelete(true);
                                                        setSelected(item._id);
                                                    }}>
                                                    <ListItemIcon>
                                                        <Delete fontSize="small" />
                                                    </ListItemIcon>
                                                    Delete
                                                </MenuItem>
                                            </CustomMenu>
                                        </Hidden>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination
                        sx={{ mt: 1 }}
                        page={filter.page}
                        count={pagination.pages}
                        onChange={handleChangePagination}/>
                </Box>
            )}

            <FloatingButton
                onClick={() => history.push("/app/attendance/create")}/>

            <DialogConfirm
                title="Delete Data"
                content="Are you sure want to delete this data?"
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onSubmit={handleDelete}/>
        </Card>
    )
}