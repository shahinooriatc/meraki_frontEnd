import React, {useEffect} from "react";
import {
    Box,
    Card,
    FormControl,
    Grid,
    InputBase, MenuItem,
    Typography,
    useTheme
} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import COUNTRIES from "constants/countries";
import Input from "components/Input";
import PropTypes from "prop-types";
import SelectField from "../../../components/SelectField";
import Gender from "../../../constants/gender";

BasicInformation.propTypes = {
    formik: PropTypes.object
};

export default function BasicInformation(props) {
    const { formik } = props;
    const theme = useTheme();
    const countries = COUNTRIES.map(item => ({
        id: item.id,
        name: item.name,
        phoneCode: item.phoneCode,
        flag: item.flag
    }));

    useEffect(() => {
        const code = formik.values.country?.phoneCode;
        const phone = formik.values.phone;

        formik.setFieldValue('phoneCode', code ?? '');
        formik.setFieldValue('phone', phone);
    }, [formik.values.country]);

    return (
        <Card sx={{ mb: 3 }}>
            <Typography variant='h5' sx={{ mb: 4 }}>Basic Information</Typography>
            <Grid container spacing={2}>
                <Grid item lg={6} xs={12}>
                    <Input
                        label="Full Name"
                        name='name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}/>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <Input
                        label="Birthday"
                        type="date"
                        name="birthday"
                        onChange={formik.handleChange}
                        value={formik.values.birthday}
                        defaultValue={formik.values.birthday}
                        InputLabelProps={{
                            shrink: true,
                        }}/>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <FormControl fullWidth>
                        <Typography variant='caption'>Country (optional)</Typography>
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
                <Grid item lg={6} xs={12}>
                    <FormControl fullWidth>
                        <Typography variant='caption'>Phone Number (optional)</Typography>
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
                                    autoComplete='new-password'
                                    name='phoneCode'
                                    startAdornment='+'
                                    type='number'
                                    value={formik.values.phoneCode}
                                    onChange={formik.handleChange}/>
                            </Box>
                            <Input
                                name='phoneNumber'
                                value={formik.values.phoneNumber ?? ''}
                                onChange={formik.handleChange}
                                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}/>
                        </Box>
                    </FormControl>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <Input
                        label="City (optional)"
                        name='city'
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        error={formik.touched.city && Boolean(formik.errors.city)}
                        helperText={formik.touched.city && formik.errors.city}/>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <Input
                        label="Address (optional)"
                        name='address'
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}/>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <SelectField
                        label="Gender"
                        name='gender'
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                    >
                        {Object.keys(Gender).map((key) => (
                            <MenuItem key={key} value={Gender[key].value}>
                                {Gender[key].name}
                            </MenuItem>
                        ))}
                    </SelectField>
                </Grid>
            </Grid>
        </Card>
    )
}