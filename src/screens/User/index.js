import React, {useEffect, useState} from "react";
import {
    Box, Card, Chip, Table, TableBody, TableCell, Pagination, TableHead, TableRow,
    Avatar, MenuItem, ListItemIcon, Hidden
} from "@mui/material";
import Typography from "@mui/material/Typography";
import FloatingButton from "components/FloatingButton";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Delete, Visibility} from "@mui/icons-material";
import ROLES from "constants/role";
import {NameSort} from "constants/sort";
import Filter from "./components/Filter";
import CustomMenu from "components/CustomMenu";
import {GeneralSelector, UserSelector} from "selectors";
import {
    DepartmentActions, DesignationActions, GeneralActions, UserActions
} from "slices/actions";
import DialogConfirm from "components/DialogConfirm";
import {toast} from "react-toastify";
import Can from "../../utils/can";
import {actions, features} from "../../constants/permission";
import ListSkeleton from "../../components/Skeleton/ListSkeleton";

export default function User() {
    const history = useHistory();
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const users = useSelector(UserSelector.getUsers());
    const loading = useSelector(GeneralSelector.loader(UserActions.getUsers.type));
    const pagination = useSelector(UserSelector.getPagination());
    const success = useSelector(GeneralSelector.success(UserActions.deleteUser.type));

    const [filter, setFilter] = useState({
        keyword: "",
        sort: NameSort.name.value
    });
    const [selected, setSelected] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        dispatch(DepartmentActions.getDepartments());
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

    useEffect(() => {
        if (success) {
            setConfirmDelete(false);
            setSelected(null);

            toast.success(`${success?.message ?? "Success"}`, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true
                });

            dispatch(GeneralActions.removeSuccess(UserActions.deleteUser.type));
            dispatch(UserActions.getUsers(filter));
        }
    }, [success]);

    const fetchUsers = (params) => {
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

    const handleChangePagination = (e, val) => {
        setFilter({
            ...filter,
            page: val
        });
    };

    const handleDelete = () => {
        dispatch(UserActions.deleteUser(selected));
    }

    return (
        <Card>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Employee</Typography>

            <Hidden smDown>
                <Filter
                    filter={filter}
                    onChange={handleChangeFilter}/>
            </Hidden>

            {loading ? (
                <ListSkeleton/>
            ) : (
                <Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee</TableCell>
                                <Hidden smDown>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Designation</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </Hidden>
                                <TableCell align="right">Option</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell align="center" colSpan={7}>
                                        No Data
                                    </TableCell>
                                </TableRow>
                            )}
                            {users.map((item, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',

                                            '& img': {
                                                borderRadius: 50,
                                            }
                                        }}>
                                            {item.avatar ? (
                                                <img alt='profile' src={item.avatar} width='40'/>
                                            ) : (
                                                <Avatar sx={{ width: 40, height: 40 }}>
                                                    {item.name.toString().substring(0, 2).
                                                    toUpperCase()}
                                                </Avatar>
                                            )}
                                            <Typography sx={{ ml: 2 }} variant='subtitle2'>{item.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <Hidden smDown>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.role.map(e => ROLES[e].name).join(', ')}</TableCell>
                                        <TableCell>{item.department?.name ?? '-'}</TableCell>
                                        <TableCell>{item.designation?.name ?? '-'}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={item.status === 0 ? 'Non Active' : 'Active'}
                                                color={item.status === 0 ? 'error' : 'success'} size='small'/>
                                        </TableCell>
                                    </Hidden>
                                    <TableCell align="right">
                                        <CustomMenu>
                                            <MenuItem onClick={() => history.push(`/app/user/update/${item._id}`)}>
                                                <ListItemIcon>
                                                    <Visibility fontSize="small" />
                                                </ListItemIcon>
                                                Detail
                                            </MenuItem>
                                            {Can(actions.readAll, features.user) && (
                                                <MenuItem onClick={() => {
                                                    setConfirmDelete(true);
                                                    setSelected(item._id);
                                                }}>
                                                    <ListItemIcon>
                                                        <Delete fontSize="small" />
                                                    </ListItemIcon>
                                                    Delete
                                                </MenuItem>
                                            )}
                                        </CustomMenu>
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

            {Can(actions.create, features.user) && (
                <FloatingButton
                    onClick={() => history.push("/app/user/create")}/>
            )}

            <DialogConfirm
                title="Delete Data"
                content="Are you sure want to delete this data?"
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onSubmit={handleDelete}/>
        </Card>
    )
}