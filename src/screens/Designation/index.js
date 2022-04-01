import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    Grid,
    Hidden,
    IconButton,
    ListItemIcon,
    MenuItem,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import FloatingButton from "components/FloatingButton";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Delete, Edit, Visibility} from "@mui/icons-material";
import DialogConfirm from "components/DialogConfirm";
import {toast} from "react-toastify";
import {DesignationSelector, GeneralSelector} from "selectors";
import {DesignationActions, GeneralActions} from "slices/actions";
import {DefaultSort} from "constants/sort";
import Input from "components/Input";
import SelectField from "components/SelectField";
import ListSkeleton from "../../components/Skeleton/ListSkeleton";
import CustomMenu from "../../components/CustomMenu";

const FilterBox = styled(Box)(() => ({
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
}));

export default function Designation() {
    const history = useHistory();
    const dispatch = useDispatch();
    const designations = useSelector(DesignationSelector.getDesignations());
    const loading = useSelector(GeneralSelector.loader(DesignationActions.getDesignations.type));
    const pagination = useSelector(DesignationSelector.getPagination());
    const success = useSelector(GeneralSelector.success(DesignationActions.deleteDesignation.type));

    const [filter, setFilter] = useState({
        sort: DefaultSort.newest.value,
        page: 1
    });
    const [selected, setSelected] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        dispatch(DesignationActions.getDesignations());
    }, []);

    useEffect(() => {
        dispatch(DesignationActions.getDesignations(filter));
    }, [filter]);

    useEffect(() => {
        if (success) {
            toast.success(`${success?.message ?? "Success"}`, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true
                });

            setSelected(null);
            setConfirmDelete(false);

            dispatch(DesignationActions.getDesignations());
            dispatch(GeneralActions.removeSuccess(DesignationActions.deleteDesignation.type));
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
        dispatch(DesignationActions.deleteDesignation(selected));
    };

    return (
        <Card>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Designation</Typography>
            <FilterBox>
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item lg={6} sm={12} xs={12}>
                        <Input
                            label="Search"
                            placeholder='Search by name'
                            name='keyword'
                            value={filter.keyword ?? ''}
                            onChange={handleChangeFilter}/>
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12}>
                        <SelectField
                            label="Sort"
                            placeholder="Sort by name or email"
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
                                <TableCell align="right">Option</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {designations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No Data</TableCell>
                                </TableRow>
                            )}
                            {designations.map((item, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Hidden smDown>
                                            <IconButton onClick={() => history.push(`/app/designation/update/${item._id}`)}>
                                                <Edit/>
                                            </IconButton>
                                            <IconButton onClick={() => {
                                                setConfirmDelete(true);
                                                setSelected(item._id);
                                            }}>
                                                <Delete/>
                                            </IconButton>
                                        </Hidden>
                                        <Hidden smUp>
                                            <CustomMenu>
                                                <MenuItem onClick={() => history.push(`/app/designation/update/${item._id}`)}>
                                                    <ListItemIcon>
                                                        <Visibility fontSize="small" />
                                                    </ListItemIcon>
                                                    Detail
                                                </MenuItem>
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
                        page={filter.page}
                        count={pagination.pages}
                        onChange={handleChangePagination}/>
                </Box>
            )}

            <DialogConfirm
                title="Delete Data"
                content="Are you sure want to delete this data?"
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onSubmit={handleDelete}/>

            <FloatingButton
                onClick={() => history.push("/app/designation/create")}/>
        </Card>
    )
}