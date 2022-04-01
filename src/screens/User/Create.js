import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Card,
    Grid,
    Switch,
    Typography
} from "@mui/material";
import PageTitle from "components/PageTitle";
import styled from "@emotion/styled";
import Avatar from "assets/avatar.svg";
import * as yup from "yup";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {GeneralSelector} from "selectors";
import {useParams} from "react-router-dom";
import {DepartmentActions, DesignationActions, GeneralActions, UserActions} from "slices/actions";
import {toast} from "react-toastify";
import BasicInformation from "./components/Create/BasicInformation";
import AccountSetting from "./components/Create/AccountSetting";

const Picker = styled(Box)(() => ({
    width: 120,
    height: 120,
    margin: "40px auto 10px auto",

    "& input": {
        display: "none"
    },

    "& img": {
        width: "100%",
        borderRadius: 100
    }
}));

const SwitchBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
}));

export default function CreateUser() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [preview, setPreview] = useState(null);

    const success = useSelector(GeneralSelector.success(UserActions.createUser.type));

    useEffect(() => {
        dispatch(DepartmentActions.getDepartments());
        dispatch(DesignationActions.getDesignations());

        if (id) {
            dispatch(UserActions.getUserById(id));
        }
    }, []);

    useEffect(() => {
        if (success) {
            toast.success(`${success?.message ?? "Success"}`, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                });

            dispatch(GeneralActions.removeSuccess(UserActions.createUser.type));
        }
    }, [success]);

    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email().
required('Email is required'),
        department: yup.string().required("Department is required"),
        designation: yup.string().required("Designation is required"),
        role: yup.array().required("Role is required"),
        password: id ? yup.string(): yup.string().min(8, 'Password should be of minimum 8 characters length').
required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            status: false,
            role: []
        },
        enableReinitialize: true,
        validateOnChange: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);

        formik.setFieldValue('avatar', file);
        setPreview(objectUrl);
    };

    const handleToggleStatus = (e) => {
        const { checked } = e.target;

        formik.setFieldValue("status", checked);
    }

    const handleSubmit = (values) => {
        const params = {
            ...values,
            phone: values.phoneCode + values.phoneNumber
        };

        dispatch(UserActions.createUser(params))
    }

    return (
        <Box>
            <PageTitle isBack={true} title='Create Employee'/>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item lg={4} sm={12} xs={12}>
                        <Card>
                            <Picker>
                                <input
                                    type="file"
                                    id="profile"
                                    onChange={handleChangeImage}/>
                                <label htmlFor="profile">
                                    <img
                                        alt="profile"
                                        src={preview || formik.values.avatar || Avatar}/>
                                </label>
                            </Picker>

                            <Box sx={{ mt: 7 }}>
                                <SwitchBox>
                                    <Typography>Disable Account</Typography>
                                    <Switch
                                        name="status"
                                        onChange={handleToggleStatus}
                                        value={formik.values.status}/>
                                </SwitchBox>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item lg={8} sm={12} xs={12}>
                        <BasicInformation
                            formik={formik}/>
                        <AccountSetting
                            formik={formik}/>
                        <Grid container justifyContent='flex-end'>
                            <Button
                                fullWidth
                                size='large'
                                variant='contained'
                                color='primary'
                                type='submit'>Submit</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}