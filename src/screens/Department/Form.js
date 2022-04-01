import React, {useEffect} from "react";
import {Box, Button, Card, Grid} from "@mui/material";
import PageTitle from "components/PageTitle";
import * as yup from "yup";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {DepartmentSelector, GeneralSelector} from "selectors";
import {DepartmentActions, GeneralActions} from "slices/actions";
import Input from "components/Input";
import FormSkeleton from "../../components/Skeleton/FormSkeleton";

export default function FormDepartment() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const department = useSelector(DepartmentSelector.getDepartmentById());
    const loading = useSelector(GeneralSelector.loader(DepartmentActions.getDepartmentById.type));
    const actions = [
        DepartmentActions.createDepartment.type,
        DepartmentActions.updateDepartment.type
    ];
    const success = useSelector(GeneralSelector.success(actions));

    useEffect(() => {
        if (id) {
            dispatch(DepartmentActions.getDepartmentById(id));
        }
    }, []);

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

    const validationSchema = yup.object({
        name: yup.
            string().
            required('Name is required')
    });

    const formik = useFormik({
        initialValues: {
            name: department?.name ?? ""
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = (params) => {
        if (id) {
            dispatch(DepartmentActions.updateDepartment({
                ...params,
                id
            }));
        } else {
            dispatch(DepartmentActions.createDepartment(params));
        }
    };

    return (
        <Box>
            <PageTitle isBack={true} title={`${id ? "Update" : "Create"} Department`}/>

            {loading ? (
                <FormSkeleton/>
            ) : (
                <Grid container justifyContent="center">
                    <Grid item lg={6} sm={12} xs={12}>
                        <Card>
                            <form onSubmit={formik.handleSubmit}>
                                <Input
                                    fullWidth
                                    label="Name"
                                    sx={{
                                        mb: 2
                                    }}
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}/>
                                <Grid container justifyContent="flex-end">
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit">
                                        Submit
                                    </Button>
                                </Grid>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}