import React, {useEffect, useState} from "react";
import {
    Box, Card, Grid, IconButton, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
    Pagination, Chip, Hidden
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
import {ExpensesSelector, GeneralSelector} from "selectors";
import {ExpensesActions, GeneralActions} from "slices/actions";
import {DefaultSort} from "constants/sort";
import Input from "components/Input";
import SelectField from "components/SelectField";
import ExpenseStatus from "constants/expenseStatus";
import ListSkeleton from "../../components/Skeleton/ListSkeleton";

const FilterBox = styled(Box)(() => ({
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
}));

export default function Expenses() {
    const history = useHistory();
    const dispatch = useDispatch();
    const expenses = useSelector(ExpensesSelector.getExpenses());
    const loading = useSelector(GeneralSelector.loader(ExpensesActions.getExpenses.type));
    const pagination = useSelector(ExpensesSelector.getPagination());
    const success = useSelector(GeneralSelector.success(ExpensesActions.deleteExpense.type));

    const [filter, setFilter] = useState({
        sort: DefaultSort.newest.value,
        page: 1
    });
    const [selected, setSelected] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        dispatch(ExpensesActions.getExpenses(filter));
    }, [filter]);

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

            dispatch(GeneralActions.removeSuccess(ExpensesActions.deleteExpense.type));
            dispatch(ExpensesActions.getExpenses(filter));
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
        dispatch(ExpensesActions.deleteExpense(selected));
    }

    return (
        <Card>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Expenses</Typography>
            <FilterBox>
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item lg={6}>
                        <Input
                            label="Search"
                            placeholder='Search by name'
                            name='keyword'
                            value={filter.keyword ?? ''}
                            onChange={handleChangeFilter}/>
                    </Grid>
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
                                <TableCell>Item</TableCell>
                                <Hidden smDown>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Purchase From</TableCell>
                                    <TableCell>Status</TableCell>
                                </Hidden>
                                <TableCell align="right">Option</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.length === 0 && (
                                <TableRow>
                                    <TableCell align="center" colSpan={6}>
                                        No Data
                                    </TableCell>
                                </TableRow>
                            )}
                            {expenses.map((item, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{item.name}</TableCell>
                                    <Hidden smDown>
                                        <TableCell>{item.amount}</TableCell>
                                        <TableCell>
                                            {item.date ? moment(item.date).format("ddd, DD MMM") : '-'}
                                        </TableCell>
                                        <TableCell>{item.from}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size='small'
                                                label={ExpenseStatus[item.status]}
                                                color={item.status === 'paid' ? 'success' : 'error'}/>
                                        </TableCell>
                                    </Hidden>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => history.push(`/app/expenses/update/${item._id}`)}>
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
                onClick={() => history.push("/app/expenses/create")}/>

            <DialogConfirm
                title="Delete Data"
                content="Are you sure want to delete this data?"
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onSubmit={handleDelete}/>
        </Card>
    )
}