import React, {useEffect} from "react";
import {Box, Button, Card, FormControl, Grid, InputBase, Typography, useTheme} from "@mui/material";
import PageTitle from "../../components/PageTitle";
import Input from "../../components/Input";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {GeneralActions, SettingActions} from "../../slices/actions";
import {SettingSelector} from "../../selectors/SettingSelector";
import {Autocomplete} from "@mui/lab";
import COUNTRIES from "../../constants/countries";
import {toast} from "react-toastify";
import {GeneralSelector} from "../../selectors";
import FormSkeleton from "../../components/Skeleton/FormSkeleton";

export default function Setting() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const setting = useSelector(SettingSelector.getSetting());
    const loading = useSelector(GeneralSelector.loader(SettingActions.getSetting.type));
    const countries = COUNTRIES.map(item => ({
        id: item.id,
        name: item.name,
        phoneCode: item.phoneCode,
        flag: item.flag
    }));

    const success = useSelector(GeneralSelector.success(SettingActions.updateSetting.type));

    useEffect(() => {
        dispatch(SettingActions.getSetting());
    }, []);

    useEffect(() => {
        if (success) {
            toast.success(`${success?.message ?? "Success"}`, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: false
            });

            dispatch(GeneralActions.removeSuccess(SettingActions.updateSetting.type));
            dispatch(SettingActions.getSetting());
        }
    }, [success]);

    const formik = useFormik({
        initialValues: {
            name: setting?.name ?? '',
            address: setting?.address ?? '',
            city: setting?.city ?? '',
            country: '',
            email: setting?.email ?? '',
            phone: setting?.phone ?? '',
            leaveLimit: setting?.leaveLimit ?? 0
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    useEffect(() => {
        const code = formik.values.country?.phoneCode;
        const phone = formik.values.phone;

        formik.setFieldValue('phoneCode', code ?? '');
        formik.setFieldValue('phone', phone);
    }, [formik.values.country]);

    useEffect(() => {
        const phone = setting.phone;
        const country = countries.find(e => e.name === setting.country);

        if (country) {
            formik.setFieldValue('country', country);
        }

        if (phone && country) {
            const code = country.phoneCode;

            formik.setFieldValue('phoneCode', code ?? '');
            formik.setFieldValue('phoneNumber', phone.substring(code.length ?? 0));
        }
    }, [setting]);

    const handleSubmit = (values) => {
        const params = {
            id: setting._id,
            ...values,
            phone: values.phoneCode + values.phoneNumber
        };

        dispatch(SettingActions.updateSetting(params));
    }

    return (
        <Box>
            <PageTitle title='Company Setting'/>

            <Card>
                {loading ? (
                    <FormSkeleton/>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    label='Name'
                                    name='name'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}/>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    label='Email'
                                    name='email'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}/>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <Typography variant='caption'>Country</Typography>
                                    <Autocomplete
                                        disablePortal
                                        name='country'
                                        options={countries}
                                        value={formik.values.country}
                                        onChange={(e, val) => {
                                            formik.setFieldValue('country', val);
                                        }}
                                        getOptionLabel={(option) => option.name ?? ''}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                {option.flag} {option.name}
                                            </Box>
                                        )}
                                        renderInput={(params) => <InputBase {...params.InputProps} {...params} />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <Typography variant='caption'>Phone Number</Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1.5
                                    }}>
                                        <Box sx={{ width: 100 }}>
                                            <Input
                                                sx={{
                                                    textAlign: 'center',
                                                    '& .Mui-disabled': {
                                                        fillColor: theme.palette.common.black
                                                    }
                                                }}
                                                autoComplete='new-password'
                                                name='phoneCode'
                                                startAdornment='+'
                                                type='number'
                                                value={formik.values.phoneCode}
                                                onChange={formik.handleChange}/>
                                        </Box>
                                        <Input
                                            name='phoneNumber'
                                            value={formik.values.phoneNumber}
                                            onChange={formik.handleChange}/>
                                    </Box>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    label="City"
                                    name='city'
                                    value={formik.values.city}
                                    onChange={formik.handleChange}/>
                            </Grid>
                            <Grid item lg={6} sm={12} xs={12}>
                                <Input
                                    label="Address"
                                    name='address'
                                    value={formik.values.address}
                                    onChange={formik.handleChange}/>
                            </Grid>
                            <Grid item lg={12} sm={12} xs={12}>
                                <Typography variant='h6'>HR Setting</Typography>
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <Input
                                    type='number'
                                    label="Leave Quote"
                                    name='leaveLimit'
                                    value={formik.values.leaveLimit}
                                    onChange={formik.handleChange}/>
                            </Grid>
                            <Grid item lg={12} container justifyContent='flex-end'>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'>
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