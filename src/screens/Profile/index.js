import React, {useEffect, useState} from "react";
import {Box, Button, Card, Grid} from "@mui/material";
import PageTitle from "components/PageTitle";
import styled from "@emotion/styled";
import Avatar from "assets/avatar.svg";
import * as yup from "yup";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {GeneralSelector, UserSelector} from "selectors";
import {DepartmentActions, DesignationActions, GeneralActions, UserActions} from "slices/actions";
import {toast} from "react-toastify";
import BasicInformation from "./components/BasicInformation";
import AccountSetting from "./components/AccountSetting";
import COUNTRIES from "../../constants/countries";
import FormSkeleton from "../../components/Skeleton/FormSkeleton";

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

export default function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const loading = useSelector(GeneralSelector.loader(UserActions.profileUser.type));
    const success = useSelector(GeneralSelector.success(UserActions.createUser.type));

    const [preview, setPreview] = useState(null);

    const countries = COUNTRIES.map(item => ({
        id: item.id,
        name: item.name,
        phoneCode: item.phoneCode,
        flag: item.flag
    }));

    useEffect(() => {
        dispatch(UserActions.profileUser());
        dispatch(DepartmentActions.getDepartments());
        dispatch(DesignationActions.getDesignations());
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
        required('Email is required')
    });

    const formik = useFormik({
        initialValues: {
            email: profile?.email ?? '',
            avatar: profile?.avatar ?? null,
            name: profile?.name ?? '',
            phoneNumber: '',
            birthday: profile?.birthday ?? '',
            gender: profile?.gender ?? '',
            city: profile?.city ?? '',
            status: profile?.status,
        },
        enableReinitialize: true,
        validateOnChange: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    useEffect(() => {
        if (profile) {
            const phone = profile.phone;
            const country = countries.find(e => e.name === profile.country);

            if (country) {
                formik.setFieldValue('country', country);
            }

            if (phone && country) {
                const code = country.phoneCode;

                formik.setFieldValue('phoneCode', code ?? '');
                formik.setFieldValue('phoneNumber', phone ? phone.substring(code.length ?? 0) : '');
            }
        }
    }, [profile]);

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);

        formik.setFieldValue('avatar', file);
        setPreview(objectUrl);
    };

    const handleSubmit = (values) => {
        const params = {
            id: profile._id,
            ...values,
            ...(values.phoneCode && values.phoneNumber && {
                phone: values.phoneCode + values.phoneNumber
            })
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '') {
                delete params[key];
            }
        })

        dispatch(UserActions.updateUser(params))
    }

    return (
        <Box>
            <PageTitle isBack={true} title='Update Profile'/>

            {loading ? (
                <FormSkeleton/>
            ) : (
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
                            </Card>
                        </Grid>
                        <Grid item lg={8}>
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
            )}
        </Box>
    )
}