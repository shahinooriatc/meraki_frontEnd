import React, {useEffect} from "react";
import {
    Box, Button, Card, Grid, MenuItem
} from "@mui/material";
import PageTitle from "components/PageTitle";
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {useFormik} from "formik";
import {useParams} from "react-router-dom";
import moment from "moment";
import {ExpensesSelector, GeneralSelector, UserSelector} from "selectors";
import {ExpensesActions, GeneralActions} from "slices/actions";
import Input from "components/Input";
import SelectField from "components/SelectField";
import {toast} from "react-toastify";
import FormSkeleton from "../../components/Skeleton/FormSkeleton";

const STATUS = {
    pending: "Pending",
    paid: "Paid"
};

export default function FormExpenses() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const expense = useSelector(ExpensesSelector.getExpensesById());
    const loading = useSelector(GeneralSelector.loader(ExpensesActions.getExpenseById.type));
    const profile = useSelector(UserSelector.profile());
    const actions = [
        ExpensesActions.createExpense.type,
        ExpensesActions.updateExpense.type
    ];
    const success = useSelector(GeneralSelector.success(actions));

    useEffect(() => {
        if (success.length > 0) {
            const action = success.find(item => actions.includes(item.action));

            toast.success(`${action?.message ?? "Success"}`, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                pauseOnHover: false,
                pauseOnFocusLoss: false
                });

            dispatch(GeneralActions.removeSuccess(actions));
        }
    }, [success]);

    useEffect(() => {
        if (id) {
            dispatch(ExpensesActions.getExpenseById(id));
        }
    }, []);

    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        amount: yup.string().required('Amount is required'),
        from: yup.string().required("Purchase from is required"),
        status: yup.string().required("Status is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: expense?.name ?? "",
            amount: expense?.amount ?? "",
            date: expense?.date ? moment(expense?.date).format("yyyy-MM-DD") : "",
            from: expense?.from ?? "",
            status: expense?.status ?? "",
        },
        enableReinitialize: true,
        validateOnChange: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const handleSubmit = (values) => {
        if (profile) {
            values.date = new Date(values.date);
            values.createdBy = profile._id;

            if (id) {
                values.id = id;
                dispatch(ExpensesActions.updateExpense(values));
            } else {
                dispatch(ExpensesActions.createExpense(values));
            }
        }
    };

    return (
        <Box>
            <PageTitle isBack={true} title={`${id ? "Update" : "Create"} Expense`}/>

            {loading ? (
                <FormSkeleton/>
            ) : (
                <Card>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    label="Name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}/>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    fullWidth
                                    label="Amount"
                                    name="amount"
                                    value={formik.values.amount}
                                    onChange={formik.handleChange}
                                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                                    helperText={formik.touched.amount && formik.errors.amount}/>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    fullWidth
                                    label="Purchase At"
                                    type="date"
                                    name="date"
                                    defaultValue={formik.values.date}
                                    onChange={formik.handleChange}
                                    error={formik.touched.date && Boolean(formik.errors.date)}
                                    helperText={formik.touched.date && formik.errors.date}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}/>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    fullWidth
                                    label="Purchase From"
                                    name="from"
                                    value={formik.values.from}
                                    onChange={formik.handleChange}
                                    error={formik.touched.from && Boolean(formik.errors.from)}
                                    helperText={formik.touched.from && formik.errors.from}/>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <SelectField
                                    label="Status"
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                    helperText={formik.touched.status && formik.errors.status}>
                                    {Object.keys(STATUS).map(key => (
                                        <MenuItem key={key} value={key}>{STATUS[key]}</MenuItem>
                                    ))}
                                </SelectField>
                            </Grid>
                            <Grid item lg={12} container justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Card>
            )}
        </Box>
    )
}