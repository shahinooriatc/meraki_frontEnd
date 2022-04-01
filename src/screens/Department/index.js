import React, {useEffect, useState} from "react";
import {
    Box, Card, Grid, IconButton, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Pagination
} from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import FloatingButton from "components/FloatingButton";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Delete, Edit} from "@mui/icons-material";
import DialogConfirm from "components/DialogConfirm";
import {toast} from "react-toastify";
import {DepartmentSelector, GeneralSelector} from "selectors";
import {DepartmentActions, GeneralActions} from "slices/actions";
import {DefaultSort} from "constants/sort";
import Input from "components/Input";
import SelectField from "components/SelectField";
import ListSkeleton from "../../components/Skeleton/ListSkeleton";

const FilterBox = styled(Box)(() => ({
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
}));

export default function Department() {
    const history = useHistory();
    const dispatch = useDispatch();
    const departments = useSelector(DepartmentSelector.getDepartments());
    const loading = useSelector(GeneralSelector.loader(DepartmentActions.getDepartments.type));
    const pagination = useSelector(DepartmentSelector.getPagination());
    const success = useSelector(GeneralSelector.success(DepartmentActions.deleteDepartment.type));

    const [filter, setFilter] = useState({
        sort: DefaultSort.newest.value,
        page: 1
    });
    const [selected, setSelected] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        dispatch(DepartmentActions.getDepartments(filter));
    }, [filter]);

    useEffect(() => {
        if (success) {
            setConfirmDelete(false);
            setSelected(null);

            toast.success(`${success?.message ?? "Success"}`, {
                    position: "top-right",
                    autoClose: 4000,
                    closeOnClick: true
                });

            dispatch(GeneralActions.removeSuccess(DepartmentActions.deleteDepartment.type));
            dispatch(DepartmentActions.getDepartments(filter));
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
        dispatch(DepartmentActions.deleteDepartment(selected));
    };

    return (
        <Card>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Department</Typography>
            <FilterBox>
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item lg={6} sm={12} xs={12}>
                        <Input
                            label="Search"
                            name='keyword'
                            placeholder='Search by name'
                            value={filter.keyword ?? ''}
                            onChange={handleChangeFilter}/>
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12}>
                        <SelectField
                            label="Sort by"
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
                            {departments.map((item, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => history.push(`/app/department/update/${item._id}`)}>
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
                onClick={() => history.push("/app/department/create")}/>
        </Card>
    )
}