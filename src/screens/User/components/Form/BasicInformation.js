import React, {useEffect} from "react";
import {
    Box,
    Button,
    Card,
    FormControl,
    Grid,
    InputBase,
    MenuItem,
    Typography,
    useTheme
} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import COUNTRIES from "constants/countries";
import {useDispatch, useSelector} from "react-redux";
import {DepartmentSelector, DesignationSelector, GeneralSelector} from "selectors";
import {DepartmentActions, DesignationActions, GeneralActions, UserActions} from "slices/actions";
import {useFormik} from "formik";
import Input from "components/Input";
import SelectField from "components/SelectField";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import Can from "../../../../utils/can";
import {actions, features} from "../../../../constants/permission";

BasicInformation.propTypes = {
    user: PropTypes.object,
    form: PropTypes.object
};

export default function BasicInformation(props) {
    const { user, form } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const departments = useSelector(DepartmentSelector.getDepartments());
    const designations = useSelector(DesignationSelector.getDesignations());
    const success = useSelector(GeneralSelector.success(UserActions.updateUser.type));

    const countries = COUNTRIES.map(item => ({
        id: item.id,
        name: item.name,
        phoneCode: item.phoneCode,
        flag: item.flag
    }));

    useEffect(() => {
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

            dispatch(GeneralActions.removeSuccess(UserActions.updateUser.type));
        }
    }, [success]);

    const formik = useFormik({
        initialValues: {
            name: user?.name ?? "",
            phoneCode: '',
            phoneNumber: "",
            country: user?.country ?? "",
            city: user?.city ?? "",
            address: user?.address ?? "",
            department: user?.department?._id ?? "",
            designation: user?.designation?._id ?? "",
        },
        enableReinitialize: true,
        validateOnChange: true,
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
        const phone = user.phone;
        const country = countries.find(e => e.name === user.country);

        if (country) {
            formik.setFieldValue('country', country);
        }

        if (phone && country) {
            const code = country.phoneCode;

            formik.setFieldValue('phoneCode', code ?? '');
            formik.setFieldValue('phoneNumber', phone.substring(code.length ?? 0));
        }
    }, [user]);

    const handleSubmit = (values) => {
        const params = {
            id: user._id,
            ...values,
            ...form,
            phone: values.phoneCode + values.phoneNumber
        };

        dispatch(UserActions.updateUser(params));
    }

    return (
        <Card>
            <Typography variant='h5' sx={{ mb: 4 }}>Basic Information</Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item lg={6} xs={12}>
                        <Input
                            disabled={Can(actions.readSome, features.user)}
                            label="Full Name"
                            name='name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}/>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <FormControl fullWidth>
                            <Typography variant='caption'>Country</Typography>
                            <Autocomplete
                                disablePortal
                                disabled={Can(actions.readSome, features.user)}
                                name='country'
                                options={countries}
                                value={formik.values.country}
                                onChange={(e, val) => {
                                    formik.setFieldValue('country', val);
                                }}
                                error={formik.touched.country && Boolean(formik.errors.country)}
                                helperText={formik.touched.country && formik.errors.country}
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
                    <Grid item lg={6} xs={12}>
                        <FormControl fullWidth>
                            <Typography variant='caption'>Phone Number</Typography>
                            <Box sx={{
                                display: 'flex',
                                gap: 1.5
                            }}>
                                <Box sx={{ width: 80 }}>
                                    <Input
                                        sx={{
                                            textAlign: 'center',
                                            '& .Mui-disabled': {
                                                fillColor: theme.palette.common.black
                                            }
                                        }}
                                        disabled={Can(actions.readSome, features.user)}
                                        autoComplete='new-password'
                                        name='phoneCode'
                                        startAdornment='+'
                                        type='number'
                                        value={formik.values.phoneCode}
                                        onChange={formik.handleChange}/>
                                </Box>
                                <Input
                                    disabled={Can(actions.readSome, features.user)}
                                    name='phoneNumber'
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}/>
                            </Box>
                        </FormControl>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <Input
                            label="City"
                            name='city'
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                            disabled={Can(actions.readSome, features.user)}/>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <Input
                            label="Address"
                            name='address'
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                            disabled={Can(actions.readSome, features.user)}/>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <SelectField
                            label="Department"
                            name='department'
                            value={formik.values.department}
                            onChange={formik.handleChange}
                            error={formik.touched.department && Boolean(formik.errors.department)}
                            helperText={formik.touched.department && formik.errors.department}
                            disabled={Can(actions.readSome, features.user)}>
                            {departments.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <SelectField
                            label="Designation"
                            name='designation'
                            value={formik.values.designation}
                            onChange={formik.handleChange}
                            error={formik.touched.designation && Boolean(formik.errors.designation)}
                            helperText={formik.touched.designation && formik.errors.designation}
                            disabled={Can(actions.readSome, features.user)}>
                            {designations.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                    {Can(actions.readAll, features.user) && (
                        <Grid sx={{ mt: 3 }} item container justifyContent="flex-end">
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained">
                                Submit
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Card>
    )
}