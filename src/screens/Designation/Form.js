import React, {useEffect} from "react";
import {Box, Button, Card, Grid} from "@mui/material";
import PageTitle from "components/PageTitle";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import * as yup from "yup";
import {useFormik} from "formik";
import {DesignationSelector, GeneralSelector} from "selectors";
import {DesignationActions, GeneralActions} from "slices/actions";
import Input from "components/Input";
import FormSkeleton from "../../components/Skeleton/FormSkeleton";

export default function FormDesignation() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const designation = useSelector(DesignationSelector.getDesignationById());
    const loading = useSelector(GeneralSelector.loader(DesignationActions.getDesignationById.type));
    const actions = [
        DesignationActions.createDesignation.type,
        DesignationActions.updateDesignation.type
    ];
    const success = useSelector(GeneralSelector.success(actions));

    useEffect(() => {
        if (id) {
            dispatch(DesignationActions.getDesignationById(id));
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
        name: yup.string().required('Name is required'),
        description: yup.string()
    });

    const formik = useFormik({
        initialValues: {
            name: designation?.name ?? "",
            department: designation?.department?._id ?? ""
        },
        enableReinitialize: true,
        validateOnChange: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const handleSubmit = (values) => {
        if (id) {
            values.id = id;
            dispatch(DesignationActions.updateDesignation(values));
        } else {
            dispatch(DesignationActions.createDesignation(values));
        }
    }

    return (
        <Box>
            <PageTitle isBack={true} title={`${id ? 'Update' : 'Create'} Designation`}/>

            <Card>
                {loading ? (
                    <FormSkeleton/>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item lg={12} xs={12}>
                                <Input
                                    label="Name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}/>
                            </Grid>
                            <Grid item lg={12} xs={12}>
                                <Input
                                    multiline
                                    rows={5}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}/>
                            </Grid>
                            <Grid item container justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Card>
        </Box>
    )
}