import React, {useEffect, useState} from "react";
import {
    Box, Card, Grid, IconButton, MenuItem, Table, TableBody, TableCell, TableHead,
    TableRow, Pagination, Chip, FormControl, InputBase, Hidden
} from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import FloatingButton from "components/FloatingButton";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {Delete, Edit} from "@mui/icons-material";
import DialogConfirm from "components/DialogConfirm";
import {toast} from "react-toastify";
import {GeneralSelector, LeaveSelector, UserSelector} from "selectors";
import {GeneralActions, LeaveActions, UserActions} from "slices/actions";
import {DefaultSort} from "constants/sort";
import SelectField from "components/SelectField";
import {LeaveStatus, LeaveTypes} from "constants/leaveConst";
import Can from "../../utils/can";
import {actions, features} from "../../constants/permission";
import {Autocomplete} from "@mui/lab";
import ListSkeleton from "../../components/Skeleton/ListSkeleton";

const FilterBox = styled(Box)(() => ({
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
}));

export default function Leaves() {
    const history = useHistory();
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const users = useSelector(UserSelector.getUsers());
    const leaves = useSelector(LeaveSelector.getLeaves());
    const loading = useSelector(GeneralSelector.loader(LeaveActions.getLeaves.type));
    const pagination = useSelector(LeaveSelector.getPagination());
    const success = useSelector(GeneralSelector.success(LeaveActions.deleteLeave.type));

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
        dispatch(LeaveActions.getLeaves(filter));
    }, [filter]);

    useEffect(() => {
        if (profile && Can(actions.read, features.leave)) {
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
                    closeOnClick: true
                });

            dispatch(GeneralActions.removeSuccess(LeaveActions.deleteLeave.type));
            dispatch(LeaveActions.getLeaves(filter));
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
        dispatch(LeaveActions.deleteLeave(selected));
    }

    return (
        <Card>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Leave</Typography>
            <FilterBox>
                <Grid container spacing={3} justifyContent="space-between">
                    {Can(actions.readAll, features.leave) && (
                        <Grid item lg={6} sm={6} xs={6}>
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
                                                value: val._id
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
                    <Grid item lg={2}>
                        <SelectField
                            label="Sort"
                            name='sort'
                            value={filter.sort}
                            onChange={handleChangeFilter}
                        >
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
                                <TableCell>Employee</TableCell>
                                <Hidden smDown>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Status</TableCell>
                                </Hidden>
                                <TableCell align="right">Option</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaves.length === 0 && (
                                <TableRow>
                                    <TableCell align="center" colSpan={5}>
                                        No Data
                                    </TableCell>
                                </TableRow>
                            )}
                            {leaves.map((item, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{item.user?.name}</TableCell>
                                    <Hidden smDown>
                                        <TableCell>
                                            {item.start ? moment(item.start).format("ddd, DD MMM") : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {item.start ? moment(item.start).format("ddd, DD MMM") : '-'}
                                        </TableCell>
                                        <TableCell>{item.type ? LeaveTypes[item.type].name : '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size='small'
                                                label={LeaveStatus[item.status] ?? LeaveStatus['0']}
                                                color={item.status === 1 ? 'success' : 'error'}/>
                                        </TableCell>
                                    </Hidden>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => history.push(`/app/leave/update/${item._id}`)}>
                                            <Edit/>
                                        </IconButton>
                                        <IconButton onClick={() => {
                                            setConfirmDelete(true);
                                            setSelected(item._id);
                                        }}>
                                            <Delete/>
                                        </IconButton>
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
                onClick={() => history.push("/app/leave/create")}/>

            <DialogConfirm
                title="Delete Data"
                content="Are you sure want to delete this data?"
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onSubmit={handleDelete}/>
        </Card>
    )
}