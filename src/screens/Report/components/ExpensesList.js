import React, {useState} from "react";
import moment from "moment";
import {
    Box, Card, Chip, Grid, Hidden, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {styled} from "@mui/material/styles";
import {DefaultSort} from "constants/sort";
import {ExpensesSelector, GeneralSelector} from "selectors";
import {ExpensesActions} from "slices/actions";
import Input from "components/Input";
import SelectField from "components/SelectField";
import ExpenseStatus from "constants/expenseStatus";
import ListSkeleton from "components/Skeleton/ListSkeleton";

const Content = styled(Card)(() => ({
    marginBottom: 20
}));

export default function ExpensesList() {
    const dispatch = useDispatch();
    const expenses = useSelector(ExpensesSelector.getExpenses());
    const loading = useSelector(GeneralSelector.loader(ExpensesActions.getExpenses.type));

    const [filter, setFilter] = useState({
        sort: DefaultSort.newest.value,
        status: -1
    });

    const fetchExpense = (params) => {
        Object.keys(params).forEach(key => {
            if (params[key] === -1) {
                delete params[key];
            }
        });

        dispatch(ExpensesActions.getExpenses(params));
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
        fetchExpense(params);
    };

    return (
        <Box>
            <Content>
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item lg={2} sm={12} xs={12}>
                        <Input
                            label="Search"
                            value={filter.keyword}
                            name="keyword"
                            onChange={handleChangeFilter}/>
                    </Grid>
                    <Grid item lg={3} sm={12} xs={12}>
                        <Input
                            label="Start At"
                            type="date"
                            name="startAt"
                            onChange={handleChangeFilter}
                            defaultValue={moment(new Date()).format("yyyy-mm-dd")}
                            InputLabelProps={{
                                shrink: true,
                            }}/>
                    </Grid>
                    <Grid item lg={3} sm={12} xs={12}>
                        <Input

                            label="End At"
                            type="date"
                            name="endAt"
                            onChange={handleChangeFilter}
                            defaultValue={moment(new Date()).format("yyyy-mm-dd")}
                            InputLabelProps={{
                                shrink: true,
                            }}/>
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12}>
                        <SelectField
                            label="Status"
                            value={filter.status}
                            name="status"
                            onChange={handleChangeFilter}>
                            <MenuItem value={-1}>All Status</MenuItem>
                            {Object.keys(ExpenseStatus).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {ExpenseStatus[key]}
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
                                <TableCell>Item</TableCell>
                                <TableCell>Amount</TableCell>
                                <Hidden smDown>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Purchase From</TableCell>
                                    <TableCell>Status</TableCell>
                                </Hidden>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.length === 0 && (
                                <TableRow>
                                    <TableCell align="center" colSpan={5}>
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
                                    <TableCell>{item.amount}</TableCell>
                                    <Hidden smDown>
                                        <TableCell>
                                            {item.date ? moment(item.date).format("ddd, DD MMM, HH:mm:ss") : '-'}
                                        </TableCell>
                                        <TableCell>{item.from}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={ExpenseStatus[item.status]}
                                                color={item.status === 'paid' ? 'success' : 'error'}/>
                                        </TableCell>
                                    </Hidden>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Content>
            )}
        </Box>
    )
}